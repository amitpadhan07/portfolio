import React from "react";
import { connectToDatabase } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import BlogManager from "@/components/admin/BlogManager";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  await connectToDatabase();

  const postsDocs = await BlogPost.find().sort({ createdAt: -1 }).lean();

  const plainPosts = postsDocs.map((p: any) => ({
    _id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    content: p.content,
    featuredImage: p.featuredImage || "",
    tags: p.tags || [],
    category: p.category || "Tech",
    publishedStatus: p.publishedStatus || "draft",
    createdAt: p.createdAt.toISOString(),
  }));

  return <BlogManager initialPosts={plainPosts} />;
}
