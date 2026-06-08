import React from "react";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/Project";
import ProjectsManager from "@/components/admin/ProjectsManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await connectToDatabase();

  const projectsDocs = await Project.find().sort({ order: 1 }).lean();

  const plainProjects = projectsDocs.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    description: p.description,
    technologies: p.technologies || [],
    githubUrl: p.githubUrl || "",
    liveUrl: p.liveUrl || "",
    image: p.image || "",
    category: p.category,
    featured: !!p.featured,
    status: p.status || "active",
    order: p.order || 0,
  }));

  return <ProjectsManager initialProjects={plainProjects} />;
}
