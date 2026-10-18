export const site = {
  title: '此间',
  name: '你的名字',
  direction: '个人方向待补充',
  description: '此间，一个记录日常、学习与实践的个人博客。',
  introduction: '个人介绍待补充。这里将记录我的背景、关注的方向，以及为什么想把一些观察和思考写下来。',
  // Add only real contact details you want to make public.
  email: null as string | null,
  socials: [] as { label: string; url: string }[],
  profilePending: true,
};

export const columns = [
  { id: 'essays', title: '随笔', english: 'ESSAYS', description: '日常里的小事，也值得认真写下。', tone: 'neutral' },
  { id: 'notes', title: '学习笔记', english: 'LEARNING NOTES', description: '把读过的、想过的，慢慢整理清楚。', tone: 'neutral' },
  { id: 'making', title: '项目记录', english: 'MAKING THINGS', description: '从一个想法开始，记录尝试与推敲。', tone: 'neutral' },
] as const;
