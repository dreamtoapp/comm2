export function generateEntityId(prefix = 'seo') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
