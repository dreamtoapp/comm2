export const Slugify = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[،؛؟ـ]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() // Optional: Only if using Latin chars
    .slice(0, 60); // Optional: Limit length
};

export const Deslugify = (slug: string) => {
  return slug
    .replace(/-/g, ' ') // Convert hyphens back to spaces [[3]][[4]]
    .replace(/(^|\s)\S/g, (match) => match.toUpperCase()); // Optional: Capitalize words for readability
};
