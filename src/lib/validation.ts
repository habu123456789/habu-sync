import { z } from 'zod';

export const blogPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title zaroori hai')
    .max(200, 'Title 200 characters se zyada nahi'),
  content: z
    .string()
    .trim()
    .min(1, 'Content zaroori hai')
    .max(50_000, 'Content bohot lamba hai'),
  social_link: z
    .string()
    .trim()
    .max(500, 'Link bohot lamba hai')
    .refine((v) => v === '' || /^https?:\/\/[^\s]+$/i.test(v), {
      message: 'Social link https:// se shuru hona chahiye',
    })
    .optional()
    .default(''),
});

export const profileSchema = z.object({
  display_name: z
    .string()
    .trim()
    .max(100, 'Naam 100 characters se chhota rakho')
    .optional()
    .default(''),
  bio: z
    .string()
    .trim()
    .max(1000, 'Bio 1000 characters se chhota rakho')
    .optional()
    .default(''),
  age: z
    .union([z.string(), z.number()])
    .transform((v) => (v === '' || v === null || v === undefined ? null : Number(v)))
    .refine((v) => v === null || (Number.isFinite(v) && v >= 0 && v <= 150), {
      message: 'Age 0 se 150 ke beech honi chahiye',
    })
    .nullable(),
  place: z
    .string()
    .trim()
    .max(100, 'Place 100 characters se chhota rakho')
    .optional()
    .default(''),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
