import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://github.com/amitpadhan07";

  let blogUrls: any[] = [];
  try {
    await connectToDatabase();
    const posts = await BlogPost.find({ publishedStatus: "published" }).lean();
    blogUrls = posts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error("Sitemap generation error:", err);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...blogUrls,
  ];
}
