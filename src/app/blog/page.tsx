import React from "react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { BookOpen, Calendar, ArrowRight, Tag, ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BlogListPage() {
  let plainPosts: any[] = [];

  try {
    await connectToDatabase();
    const postsDocs = await BlogPost.find({ publishedStatus: "published" })
      .sort({ createdAt: -1 })
      .lean();

    plainPosts = postsDocs.map((p: any) => ({
      _id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      content: p.content,
      featuredImage: p.featuredImage || "",
      tags: p.tags || [],
      category: p.category || "Tech",
      createdAt: p.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error("Failed to load blog posts from DB:", err);
  }

  return (
    <div className="min-h-screen bg-[#070b13] py-24 relative overflow-hidden">
      {/* Background radial orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-[#94A3B8] hover:text-sky-400 transition-colors font-mono"
        >
          <ChevronLeft className="w-4.5 h-4.5" /> Back to Portfolio
        </Link>

        {/* Section Title */}
        <div className="flex flex-col items-center text-center space-y-4">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-mono">
            Insights
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            Engineering Blog
          </h1>
          <p className="text-sm text-[#94A3B8] font-light max-w-xl">
            Read my latest writeups, academic research logs, tutorials, and project case studies.
          </p>
        </div>

        {/* Articles Grid */}
        {plainPosts.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-2xl max-w-lg mx-auto">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-[#475569]" />
            <h3 className="text-sm font-semibold text-[#F8FAFC]">No Articles Published</h3>
            <p className="text-xs text-[#94A3B8] font-light mt-1">Check back later for exciting tech stories!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plainPosts.map((post) => (
              <article
                key={post._id}
                className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:border-white/10 hover:bg-white/[0.02]"
              >
                {post.featuredImage ? (
                  <div className="h-48 w-full overflow-hidden border-b border-white/5 relative">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-slate-950/70 border border-white/10 backdrop-blur-md text-[10px] text-sky-400 px-2.5 py-0.5 rounded-md font-mono">
                      {post.category}
                    </span>
                  </div>
                ) : (
                  <div className="h-48 w-full bg-slate-950/60 border-b border-white/5 flex items-center justify-center relative">
                    <BookOpen className="w-10 h-10 text-slate-700" />
                    <span className="absolute top-3 left-3 bg-slate-950/70 border border-white/10 backdrop-blur-md text-[10px] text-sky-400 px-2.5 py-0.5 rounded-md font-mono">
                      {post.category}
                    </span>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] text-[#64748B] font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>

                    <h2 className="font-bold text-lg text-[#F8FAFC] group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h2>

                    {/* tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="flex items-center gap-0.5 text-[9px] bg-white/5 border border-white/10 text-[#94A3B8] px-2 py-0.5 rounded-md"
                          >
                            <Tag className="w-2 h-2 text-sky-400" /> {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold group/btn pt-3 border-t border-white/5"
                  >
                    Read Article{" "}
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
