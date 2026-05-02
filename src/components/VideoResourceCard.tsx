import { useEffect, useMemo, useState } from 'react';
import { Icon } from './ui/Icon';
import { YouTubeEmbed } from './YouTubeEmbed';
import { QuizQuestion } from './QuizQuestion';
import { useAuth } from '../context/AuthContext';
import { ids, logAuditEvent, saveQuizAttempt, saveVideoProgress } from '../services/firestore';
import { getQuestionsForVideo } from '../data/videoQuestions';
import type { VideoProgress, VideoResource } from '../types';

interface Props {
  video: VideoResource;
  initialProgress?: VideoProgress | null;
  onProgressChange?: (progress: VideoProgress) => void;
}

export function VideoResourceCard({ video, initialProgress, onProgressChange }: Props) {
  const { user, learnerPreview } = useAuth();
  const [completed, setCompleted] = useState(Boolean(initialProgress?.markedComplete));
  const [reflection, setReflection] = useState(initialProgress?.reflectionText ?? '');
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showRecall, setShowRecall] = useState(false);
  const [pvAnswers, setPvAnswers] = useState<Record<string, string>>({});
  const [pvSubmitted, setPvSubmitted] = useState(false);

  const recallQuestions = useMemo(() => getQuestionsForVideo(video.id), [video.id]);

  useEffect(() => {
    setCompleted(Boolean(initialProgress?.markedComplete));
    setReflection(initialProgress?.reflectionText ?? '');
  }, [initialProgress]);

  const buildProgress = (overrides: Partial<VideoProgress> = {}): VideoProgress => ({
    userId: user?.uid ?? 'anonymous',
    videoId: video.id,
    moduleId: video.moduleId,
    title: video.title,
    source: video.source,
    watched: true,
    markedComplete: completed,
    reflectionText: reflection,
    createdAt: initialProgress?.createdAt ?? Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  });

  async function handleMarkComplete() {
    if (!user) return;
    setSavingState('saving');
    const next = !completed;
    setCompleted(next);
    const progress = buildProgress({
      markedComplete: next,
      completedAt: next ? Date.now() : undefined,
    });
    if (learnerPreview) {
      setSavingState('saved');
      setTimeout(() => setSavingState('idle'), 1200);
      if (next && recallQuestions.length > 0) {
        setShowRecall(true);
      }
      return;
    }
    await saveVideoProgress(progress);
    await logAuditEvent({
      userId: user.uid,
      type: next ? 'video_completed' : 'video_viewed',
      moduleId: video.moduleId,
      refId: video.id,
    });
    onProgressChange?.(progress);
    setSavingState('saved');
    setTimeout(() => setSavingState('idle'), 1200);
    // After completion, prompt the active-recall mini quiz when available.
    if (next && recallQuestions.length > 0) {
      setShowRecall(true);
    }
  }

  async function submitRecall() {
    setPvSubmitted(true);
    if (!user || learnerPreview) return;
    const correct = recallQuestions.filter(
      (q) => pvAnswers[q.id] === q.correctOptionId,
    ).length;
    const scorePercent =
      recallQuestions.length === 0 ? 0 : (correct / recallQuestions.length) * 100;
    await saveQuizAttempt({
      id: ids.newId(),
      userId: user.uid,
      scope: 'video',
      moduleId: video.moduleId,
      startedAt: Date.now(),
      submittedAt: Date.now(),
      answers: recallQuestions.map((q) => ({
        questionId: q.id,
        selectedOptionId: pvAnswers[q.id] ?? '',
        correct: pvAnswers[q.id] === q.correctOptionId,
      })),
      scorePercent,
    });
    await logAuditEvent({
      userId: user.uid,
      type: 'quiz_submitted',
      moduleId: video.moduleId,
      refId: video.id,
      details: { scope: 'video', score: scorePercent },
    });
  }

  async function handleSaveReflection() {
    if (!user) return;
    setSavingState('saving');
    const progress = buildProgress({ reflectionText: reflection });
    if (learnerPreview) {
      setSavingState('saved');
      setTimeout(() => setSavingState('idle'), 1200);
      return;
    }
    await saveVideoProgress(progress);
    await logAuditEvent({
      userId: user.uid,
      type: 'reflection_submitted',
      moduleId: video.moduleId,
      refId: video.id,
    });
    onProgressChange?.(progress);
    setSavingState('saved');
    setTimeout(() => setSavingState('idle'), 1200);
  }

  return (
    <article className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="pill-primary">
          <Icon name="youtube" size={12} />
          Supplemental AMSSM Video
        </span>
        <span className="pill">{video.learnerLevel}</span>
        {video.durationLabel && <span className="pill">{video.durationLabel}</span>}
      </div>
      <h3 className="mt-2 text-base text-ucla-900 line-clamp-2">{video.title}</h3>

      <div className="mt-3">
        <YouTubeEmbed youtubeId={video.youtubeId} title={video.title} />
      </div>

      <p className="mt-3 text-sm text-slate-700 leading-relaxed">{video.summary}</p>
      <p className="mt-1 text-sm text-slate-500 leading-relaxed">
        <span className="font-semibold text-slate-700">Why this matters: </span>
        {video.clinicalWhy}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          className="btn-secondary"
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="youtube" size={14} />
          Watch on YouTube
        </a>
        <button
          type="button"
          className={completed ? 'btn-primary' : 'btn-secondary'}
          onClick={handleMarkComplete}
          disabled={!user}
        >
          <Icon name={completed ? 'check-circle' : 'circle'} size={14} />
          {completed ? 'Completed' : 'Mark video complete'}
        </button>
        {savingState === 'saving' && (
          <span className="self-center text-xs text-slate-500">Saving…</span>
        )}
        {savingState === 'saved' && (
          <span className="self-center text-xs text-emerald-700">
            {learnerPreview ? 'Previewed' : 'Saved'}
          </span>
        )}
      </div>

      {recallQuestions.length > 0 && (completed || showRecall) && (
        <div className="mt-4 rounded-xl border border-ucla-100 bg-ucla-50/40 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
              Active recall · {recallQuestions.length} quick question
              {recallQuestions.length === 1 ? '' : 's'}
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-ucla-700 hover:text-ucla-900"
              onClick={() => setShowRecall((s) => !s)}
            >
              {showRecall ? 'Hide' : 'Show'}
            </button>
          </div>
          {showRecall && (
            <div className="mt-3 space-y-3">
              {recallQuestions.map((q, idx) => (
                <QuizQuestion
                  key={q.id}
                  question={q}
                  index={idx}
                  total={recallQuestions.length}
                  selectedOptionId={pvAnswers[q.id]}
                  showFeedback={pvSubmitted}
                  locked={pvSubmitted}
                  cheatSheetModuleId={video.moduleId}
                  onSelect={(id) =>
                    setPvAnswers((prev) => ({ ...prev, [q.id]: id }))
                  }
                />
              ))}
              {!pvSubmitted && (
                <div className="flex justify-end">
                  <button
                    className="btn-primary"
                    disabled={
                      Object.keys(pvAnswers).length !== recallQuestions.length || !user
                    }
                    onClick={submitRecall}
                  >
                    Submit answers
                  </button>
                </div>
              )}
              {pvSubmitted && (
                <div className="text-sm text-emerald-800">
                  {learnerPreview
                    ? 'Preview complete. No admin analytics were saved.'
                    : 'Saved. These attempts feed into your progress dashboard.'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {video.reflectionPrompt && (
        <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-800">
            Reflection prompt
          </summary>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed">
            {video.reflectionPrompt}
          </p>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="input mt-2 min-h-[6rem] resize-y"
            placeholder="Write a brief reflection… (optional)"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleSaveReflection}
              disabled={!user || !reflection.trim()}
            >
              Save reflection
            </button>
          </div>
        </details>
      )}
    </article>
  );
}
