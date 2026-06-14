import { z } from "zod";

// Admin Authentication Schemas
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Profile Management Schemas
export const ProfileStatSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.number().nonnegative("Value must be a non-negative number"),
  suffix: z.string().optional().default(""),
  subtext: z.string().optional().default(""),
});

export const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  heroHeading: z.string().min(1, "Hero Heading is required"),
  heroDescription: z.string().min(1, "Hero Description is required"),
  aboutMe: z.string().min(1, "About Me is required"),
  profilePicture: z.string().optional().default(""),
  heroImage: z.string().optional().default(""),
  stats: z.array(ProfileStatSchema).default([]),
});

// Social Links Schema
export const SocialLinkSchema = z.object({
  platform: z.string().min(1, "Platform name is required"),
  url: z.string().url("Must be a valid URL"),
  icon: z.string().min(1, "Icon name is required"),
  active: z.boolean().default(true),
  order: z.number().default(0),
});

// Project Management Schema
export const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  technologies: z.array(z.string()).default([]),
  githubUrl: z.string().url("Invalid GitHub URL").or(z.literal("")).optional(),
  liveUrl: z.string().url("Invalid Live Demo URL").or(z.literal("")).optional(),
  image: z.string().optional().default(""),
  category: z.string().min(1, "Category is required"),
  featured: z.boolean().default(false),
  status: z.enum(["active", "draft"]).default("active"),
  order: z.number().default(0),
});

// Skills Schema
export const SkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  icon: z.string().min(1, "Icon name is required"),
  category: z.enum(["Frontend", "Backend", "Database", "Programming", "AI/ML", "Cloud"]),
  level: z.enum(["Advanced", "Intermediate", "Familiar"]),
  order: z.number().default(0),
});

// Education Schema
export const EducationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().optional().default(""),
  grade: z.string().optional().default(""),
});

// Certification Schema
export const CertificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  certificateUrl: z.string().url("Invalid URL").or(z.literal("")).optional(),
  image: z.string().optional().default(""),
  fileUrl: z.string().url("Invalid file URL").or(z.literal("")).optional().default(""),
  fileType: z.enum(["image", "pdf"]).optional().default("image"),
  issuerLogo: z.string().url("Invalid logo URL").or(z.literal("")).optional().default(""),
});

// Achievement Schema
export const AchievementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon name is required"),
  date: z.string().min(1, "Date is required"),
});

// Contact Info Schema
export const ContactInfoSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().default(""),
  address: z.string().optional().default(""),
  location: z.string().optional().default(""),
  whatsapp: z.string().optional().default(""),
  telegram: z.string().optional().default(""),
});

// Contact Form Message Schema
export const MessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional().default("General Inquiry"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

// Blog Post Schema
export const BlogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  featuredImage: z.string().optional().default(""),
  tags: z.array(z.string()).default([]),
  category: z.string().default("Tech"),
  publishedStatus: z.enum(["draft", "published"]).default("draft"),
});

// Global Settings Schema
export const SettingsSchema = z.object({
  siteTitle: z.string().min(1, "Site Title is required"),
  metaDescription: z.string().min(1, "Meta Description is required"),
  keywords: z.array(z.string()).default([]),
  favicon: z.string().optional().default(""),
  analyticsId: z.string().optional().default(""),
  maintenanceMode: z.boolean().default(false),
});
