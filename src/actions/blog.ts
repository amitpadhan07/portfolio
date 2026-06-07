"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { ActivityLog } from "@/models/ActivityLog";
import { BlogPostSchema } from "@/validators/schemas";
import { revalidatePath } from "next/cache";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function createBlogPost(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = BlogPostSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    // Check slug uniqueness
    const existing = await BlogPost.findOne({ slug: parsed.data.slug.toLowerCase() });
    if (existing) {
      return { success: false, error: "A blog post with this URL slug already exists." };
    }

    const newPost = await BlogPost.create({
      ...parsed.data,
      slug: parsed.data.slug.toLowerCase(),
    });

    await ActivityLog.create({
      action: `Created new blog post: "${newPost.title}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${newPost.slug}`);
    revalidatePath("/admin/dashboard/blog");

    return { success: true, data: JSON.parse(JSON.stringify(newPost)) };
  } catch (error: any) {
    console.error("Blog post creation error:", error);
    return { success: false, error: "Failed to create blog post: " + error.message };
  }
}

export async function updateBlogPost(id: string, data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = BlogPostSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    const existingPost = await BlogPost.findById(id);
    if (!existingPost) {
      return { success: false, error: "Blog post not found" };
    }

    // Check slug uniqueness if changed
    if (parsed.data.slug.toLowerCase() !== existingPost.slug) {
      const slugConflict = await BlogPost.findOne({ slug: parsed.data.slug.toLowerCase() });
      if (slugConflict) {
        return { success: false, error: "A blog post with this URL slug already exists." };
      }
    }

    // If new featured image is set, delete old image from Cloudinary
    if (parsed.data.featuredImage && existingPost.featuredImage && parsed.data.featuredImage !== existingPost.featuredImage) {
      await deleteFromCloudinary(existingPost.featuredImage);
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    );

    await ActivityLog.create({
      action: `Updated blog post: "${updatedPost?.title}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${updatedPost?.slug}`);
    revalidatePath("/admin/dashboard/blog");

    return { success: true, data: JSON.parse(JSON.stringify(updatedPost)) };
  } catch (error: any) {
    console.error("Blog post update error:", error);
    return { success: false, error: "Failed to update blog post: " + error.message };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    await connectToDatabase();

    const existingPost = await BlogPost.findById(id);
    if (!existingPost) {
      return { success: false, error: "Blog post not found" };
    }

    // Delete image from Cloudinary
    if (existingPost.featuredImage) {
      await deleteFromCloudinary(existingPost.featuredImage);
    }

    await BlogPost.findByIdAndDelete(id);

    await ActivityLog.create({
      action: `Deleted blog post: "${existingPost.title}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/blog");
    revalidatePath("/admin/dashboard/blog");

    return { success: true };
  } catch (error: any) {
    console.error("Blog post deletion error:", error);
    return { success: false, error: "Failed to delete blog post: " + error.message };
  }
}
