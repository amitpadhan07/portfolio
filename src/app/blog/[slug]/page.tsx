import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { connectToDatabase } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { Calendar, ChevronLeft, Tag, BookOpen, Clock } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

// Dynamic Metadata Generator for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectToDatabase();
    const post = await BlogPost.findOne({ slug, publishedStatus: "published" }).lean();
    if (post) {
      return {
        title: `${post.title} | Amit Padhan Blog`,
        description: post.content.substring(0, 150) + "...",
        openGraph: {
          title: post.title,
          description: post.content.substring(0, 150) + "...",
          images: post.featuredImage ? [{ url: post.featuredImage }] : [],
        },
      };
    }
  } catch (err) {
    console.error("Failed to load blog metadata:", err);
  }

  return {
    title: "Blog Article | Amit Padhan",
    description: "Explore tech articles on Amit Padhan's portfolio.",
  };
}

// Simple Markdown to HTML Parser
function renderMarkdown(markdown: string) {
  if (!markdown) return "";

  let html = markdown
    // Escape HTML tag characters slightly for safety
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code Blocks
  html = html.replace(/```([\s\S]*?)```/g, (match, p1) => {
    return `<pre class="bg-slate-900/90 border border-white/10 p-4 rounded-xl text-xs overflow-x-auto text-[#E2E8F0] font-mono my-6"><code>${p1.trim()}</code></pre>`;
  });

  // Headers (H3, H2, H1)
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-base font-bold text-[#F8FAFC] tracking-tight mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-lg font-bold text-[#F8FAFC] tracking-tight mt-8 mb-4 border-b border-white/5 pb-2">$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-extrabold text-[#F8FAFC] tracking-tight mt-10 mb-4">$1</h1>');

  // Bold Text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#F8FAFC]">$1</strong>');

  // Italic Text
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-[#94A3B8]">$1</em>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-sky-400 hover:underline inline-flex items-center gap-0.5 font-medium">$1</a>');

  // Bullet Lists
  html = html.replace(/^\s*-\s+(.*?)$/gm, '<li class="list-disc ml-6 my-1.5 text-xs text-[#E2E8F0] font-light leading-relaxed">$1</li>');

  // Paragraph blocks (split by double lines)
  const paragraphs = html.split(/\n{2,}/);
  html = paragraphs
    .map((p) => {
      // If it contains block elements, return as is to avoid nesting p inside pre/h1/li
      if (p.trim().startsWith("<pre") || p.trim().startsWith("<h") || p.trim().startsWith("<li") || p.trim().startsWith("<ul")) {
        return p;
      }
      return `<p class="text-xs sm:text-sm text-[#E2E8F0] font-light leading-relaxed mb-4">${p.replace(/\n/g, "<br />")}</p>`;
    })
    .join("");

  return html;
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  let post: any = null;
  let readingTime = 1;

  try {
    await connectToDatabase();
    const postDoc = await BlogPost.findOne({ slug, publishedStatus: "published" }).lean();
    if (postDoc) {
      post = {
        _id: postDoc._id.toString(),
        title: postDoc.title,
        slug: postDoc.slug,
        content: postDoc.content,
        featuredImage: postDoc.featuredImage || "",
        tags: postDoc.tags || [],
        category: postDoc.category || "Tech",
        createdAt: postDoc.createdAt.toISOString(),
      };
      const wordCount = post.content.split(/\s+/).length;
      readingTime = Math.max(1, Math.ceil(wordCount / 200));
    }
  } catch (err) {
    console.error("Failed to load blog post detail:", err);
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#070b13] py-24 relative overflow-hidden">
      {/* Background radial blurs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-xs text-[#94A3B8] hover:text-sky-400 transition-colors font-mono"
        >
          <ChevronLeft className="w-4.5 h-4.5" /> Back to Blog
        </Link>

        {/* Article Header Details */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {readingTime} min read
            </span>
            <span className="bg-primary/10 text-primary text-[10px] uppercase px-2 py-0.5 rounded font-bold">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F8FAFC] leading-tight">
            {post.title}
          </h1>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-white/5 relative">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content Render Area */}
        <article className="prose prose-invert max-w-none border-b border-white/5 pb-8">
          <div
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
            className="space-y-4"
          />
        </article>

        {/* Tags Footer */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] uppercase font-mono text-[#64748B] tracking-wider">Tags:</span>
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="flex items-center gap-0.5 text-xs bg-white/5 border border-white/10 text-[#94A3B8] px-2.5 py-1 rounded-lg"
              >
                <Tag className="w-3.5 h-3.5 text-sky-400" /> {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
