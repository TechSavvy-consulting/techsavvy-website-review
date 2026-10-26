/** Resolve local URLs against the configured preview base; root-base builds remain host-neutral. */
export function previewPath(value: string): string {
  if (!value.startsWith('/') || value.startsWith('//')) return value;
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  if (!base) return value;
  const [, pathname, suffix] = value.match(/^([^?#]*)(.*)$/)!;
  const isFile = /\.[a-z\d]+$/i.test(pathname);
  const target = pathname.endsWith('/') || isFile ? pathname : `${pathname}/`;
  return `${base}${target}${suffix}`;
}
