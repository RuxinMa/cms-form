import { z } from 'zod';

export const cmsFormSchema = z.object({
  heading: z
    .string()
    .min(1, { message: 'Heading is required' })
    .max(100, { message: 'Heading must be 100 characters or less' }),

  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(500, { message: 'Description must be 500 characters or less' }),

  slug: z
    .string()
    .min(1, { message: 'Slug is required' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must be lowercase with hyphens only',
    }),

  content: z
    .string()
    .min(1, { message: 'Content is required' })
    .max(5000, { message: 'Content must be 5000 characters or less' }),

  keywords: z
    .array(z.string())
    .min(1, { message: 'At least one keyword is required' }),

  author: z.string().min(1, { message: 'Author is required' }),

  status: z.enum(['draft', 'published', 'archived']),
  category: z.enum(['news', 'blog', 'press']),

  featured_image: z
    .string()
    .url({ message: 'Featured image must be a valid URL' })
    .or(z.literal('')),

  is_featured: z.boolean(),

  tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),

  // SEO fields optional
  seo_title: z.string().max(60, { message: 'SEO title should be 60 characters or less for best SEO results' }),
  seo_description: z.string().max(160, { message: 'SEO description should be 160 characters or less for best SEO results' }),
});

export type CMSFormSchema = z.infer<typeof cmsFormSchema>;