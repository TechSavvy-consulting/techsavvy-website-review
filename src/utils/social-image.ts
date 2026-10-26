import type { BlogPost } from '../data/blog';

export interface SocialImage {
  path: string;
  alt: string;
}

export const defaultSocialImage = '/images/share/techsavvy-brand-v8.jpg';
export const defaultSocialImageAlt = 'Illustrative Tulsa-inspired workspace with a laptop showing security, cloud and automation symbols, alongside the TechSavvy logo.';

/** Stable share-image filenames match each retained article URL, not its display title. */
export function socialImageForPost(post: Pick<BlogPost, 'path' | 'imageAlt'>): SocialImage {
  const slug = post.path.split('/').filter(Boolean).at(-1);
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) throw new Error(`Invalid article share-image slug: ${post.path}`);
  return { path: `/images/share/${slug}.jpg`, alt: post.imageAlt };
}
