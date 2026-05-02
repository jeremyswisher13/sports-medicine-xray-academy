export const modulePhases = [
  {
    id: 'learn',
    label: 'Learn',
    description: 'Orient to the module, core framework, anatomy, and escalation triggers.',
  },
  {
    id: 'views',
    label: 'Views',
    description: 'Know which radiographic views answer the clinical question.',
  },
  {
    id: 'images',
    label: 'Images',
    description: 'Compare normal anatomy, pathology, pitfalls, and do-not-miss findings.',
  },
  {
    id: 'practice',
    label: 'Practice',
    description: 'Apply the read pattern to clinical cases and supplemental video recall.',
  },
  {
    id: 'quiz',
    label: 'Quiz',
    description: 'Check your module knowledge after working through the examples.',
  },
  {
    id: 'takeaways',
    label: 'Takeaways',
    description: 'Finish with key points, post-check, confidence, and next steps.',
  },
] as const;

export const modulePhaseCount = modulePhases.length;
