export const site = {
  title: 'Z-A',
  name: '白',
  direction: 'zju生科',
  description: '一个记录日常、学习与实践的个人博客。',
  introduction: '个人介绍待补充。这里将记录我的背景、关注的方向，以及为什么想把一些观察和思考写下来。',
  // Add only real contact details you want to make public.
  email: null as string | null,
  socials: [] as { label: string; url: string }[],
  profilePending: true,
};

// Welcome copy and artwork are kept together for everyday editing.
export const welcome = {
  enabled: true,
  title: site.title,
  eyebrow: `${site.title} / A PERSONAL JOURNAL`,
  image: '/images/welcome-mist.webp',
};

export const columns = [
  { id: 'essays', title: '随笔', english: 'ESSAYS', tone: 'neutral' },
  { id: 'notes', title: '学习笔记', english: 'LEARNING NOTES', tone: 'neutral' },
  { id: 'making', title: '项目记录', english: 'MAKING THINGS', tone: 'neutral' },
] as const;
