export function withBase(path: string, base = import.meta.env.BASE_URL): string {
  if (/^(?:https?:|mailto:|tel:|#)/i.test(path)) return path;
  return `${base.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`;
}
