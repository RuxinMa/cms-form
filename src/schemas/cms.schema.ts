import { z } from 'zod';

export const cmsFormSchema = z.object({
  heading: z
    .string()
    .min(1, 'Heading is required')
    .max(100, 'Heading must be 100 characters or less'),

  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or less'),

  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),

  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content must be 5000 characters or less'),

  keywords: z
    .array(z.string())
    .min(1, 'At least one keyword is required'),

  author: z
    .string()
    .min(1, 'Author is required'),

  status: z
    .enum(['draft', 'published', 'archived'], {
      errorMap: () => ({ message: 'Status must be draft, published, or archived' }),
    }),

  category: z
    .enum(['news', 'blog', 'press'], {
      errorMap: () => ({ message: 'Category must be news, blog, or press' }),
    }),

  featured_image: z
    .string()
    .url('Featured image must be a valid URL')
    .or(z.literal('')),

  is_featured: z
    .boolean(),

  tags: z
    .array(z.string())
    .min(1, 'At least one tag is required'),

  // SEO fields are optional - server will use defaults if empty
  seo_title: z
    .string()
    .max(60, 'SEO title should be 60 characters or less for best SEO results'),

  seo_description: z
    .string()
    .max(160, 'SEO description should be 160 characters or less for best SEO results'),
});

export type CMSFormSchema = z.infer<typeof cmsFormSchema>;