export const modulePhases = [
  {
    id: 'learn',
    label: 'Learn',
    description: 'Commit to the normal-first goals, core framework, and escalation triggers.',
  },
  {
    id: 'views',
    label: 'Views',
    description: 'Choose the radiographic views that answer the clinical question.',
  },
  {
    id: 'images',
    label: 'Images',
    description: 'Compare normal anatomy against pathology, pitfalls, and do-not-miss findings.',
  },
  {
    id: 'practice',
    label: 'Practice',
    description: 'Commit to an impression, next step, and confidence before feedback.',
  },
  {
    id: 'quiz',
    label: 'Quiz',
    description: 'Test whether the module knowledge is ready without coaching.',
  },
  {
    id: 'takeaways',
    label: 'Takeaways',
    description: 'Close the loop with key points, post-check, confidence, and next steps.',
  },
] as const;

export const modulePhaseCount = modulePhases.length;
