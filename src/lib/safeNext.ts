/**
 * Where to go after logging in. Only same-site paths are allowed, so a crafted
 * "?next=https://evil.example" link can't bounce people to another site.
 */
export function parseNext(value: string | null): string {
  if (value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')) return value
  return '/'
}
