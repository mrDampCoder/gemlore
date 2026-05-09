import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long').trim(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long').trim(),
})

export const gemstoneSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only').trim(),
  name: z.string().min(1, 'Name is required').max(100).trim(),
  category: z.enum(['Precious', 'Semi-precious', 'Organic']),
  color: z.string().min(1, 'Color is required').max(100).trim(),
  hardness: z.number().min(1, 'Hardness must be at least 1').max(10, 'Hardness cannot exceed 10'),
  origin: z.string().min(1, 'Origin is required').max(100).trim(),
  description: z.string().min(10, 'Description must be at least 10 characters').trim(),
  lore: z.string().min(10, 'Lore must be at least 10 characters').trim(),
  visualKey: z.enum(['ruby', 'sapphire', 'emerald', 'diamond', 'amethyst', 'topaz', 'aquamarine', 'garnet', 'opal', 'tourmaline']),
})

export const articleSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only').trim(),
  title: z.string().min(1, 'Title is required').max(200).trim(),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(300).trim(),
  content: z.string().min(100, 'Content must be at least 100 characters').trim(),
  authorName: z.string().min(1, 'Author name is required').max(100).trim(),
})

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(2000, 'Comment is too long').trim(),
  gemstoneId: z.string().optional(),
  articleId: z.string().optional(),
}).refine(
  (data) => data.gemstoneId || data.articleId,
  { message: 'Comment must be associated with a gemstone or article', path: ['gemstoneId'] }
)

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000).trim(),
})

export const adminUpdateUserSchema = z.object({
  isActive: z.boolean().optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
})
