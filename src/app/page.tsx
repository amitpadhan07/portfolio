import React from "react";
import { connectToDatabase } from "@/lib/db";
import { Profile } from "@/models/Profile";
import { Skill } from "@/models/Skill";
import { Project } from "@/models/Project";
import { Education } from "@/models/Education";
import { Certification } from "@/models/Certification";
import { Achievement } from "@/models/Achievement";
import { ContactInfo } from "@/models/ContactInfo";
import { Resume } from "@/models/Resume";
import { SocialLink } from "@/models/SocialLink";
import PortfolioContainer from "@/components/PortfolioContainer";

export const dynamic = "force-dynamic"; // Ensure live data on reload

export default async function Page() {
  let plainProfile = null;
  let plainSkills: any[] = [];
  let plainProjects: any[] = [];
  let plainEducation: any[] = [];
  let plainCertifications: any[] = [];
  let plainAchievements: any[] = [];
  let plainContact = null;
  let plainResume = null;
  let plainSocialLinks: any[] = [];

  try {
    await connectToDatabase();

    // 1. Fetch Profile
    const profileDoc = await Profile.findOne().lean();
    if (profileDoc) {
      plainProfile = {
        name: profileDoc.name,
        title: profileDoc.title,
        heroHeading: profileDoc.heroHeading,
        heroDescription: profileDoc.heroDescription,
        aboutMe: profileDoc.aboutMe,
        profilePicture: profileDoc.profilePicture || "",
        heroImage: profileDoc.heroImage || "",
        stats: (profileDoc.stats || []).map((s: any) => ({
          label: s.label,
          value: Number(s.value) || 0,
          suffix: s.suffix || "",
          subtext: s.subtext || "",
        })),
      };
    }

    // 2. Fetch Skills
    const skillsDocs = await Skill.find().sort({ order: 1 }).lean();
    plainSkills = skillsDocs.map((s: any) => ({
      _id: s._id.toString(),
      name: s.name,
      icon: s.icon || "Code",
      category: s.category,
      level: s.level,
      order: s.order || 0,
    }));

    // 3. Fetch Active Projects
    const projectsDocs = await Project.find({ status: "active" }).sort({ order: 1 }).lean();
    plainProjects = projectsDocs.map((p: any) => ({
      _id: p._id.toString(),
      name: p.name,
      description: p.description,
      technologies: p.technologies || [],
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || "",
      image: p.image || "",
      category: p.category,
      featured: p.featured || false,
      status: p.status,
      order: p.order || 0,
    }));

    // 4. Fetch Education
    const educationDocs = await Education.find().sort({ duration: -1 }).lean();
    plainEducation = educationDocs.map((e: any) => ({
      _id: e._id.toString(),
      institution: e.institution,
      degree: e.degree,
      duration: e.duration,
      description: e.description || "",
      grade: e.grade || "",
    }));

    // 5. Fetch Certifications
    const certDocs = await Certification.find().lean();
    plainCertifications = certDocs.map((c: any) => ({
      _id: c._id.toString(),
      name: c.name,
      issuer: c.issuer,
      date: c.date,
      certificateUrl: c.certificateUrl || "",
      image: c.image || "",
    }));

    // 6. Fetch Achievements
    const achievementDocs = await Achievement.find().lean();
    plainAchievements = achievementDocs.map((a: any) => ({
      _id: a._id.toString(),
      title: a.title,
      description: a.description,
      icon: a.icon || "Sparkles",
      date: a.date,
    }));

    // 7. Fetch Contact Info
    const contactDoc = await ContactInfo.findOne().lean();
    if (contactDoc) {
      plainContact = {
        email: contactDoc.email,
        phone: contactDoc.phone || "",
        address: contactDoc.address || "",
        location: contactDoc.location || "",
        whatsapp: contactDoc.whatsapp || "",
        telegram: contactDoc.telegram || "",
      };
    }

    // 8. Fetch Resume Details
    const resumeDoc = await Resume.findOne().lean();
    if (resumeDoc) {
      plainResume = {
        pdfUrl: resumeDoc.pdfUrl || "",
        downloadCount: resumeDoc.downloadCount || 0,
      };
    }

    // 9. Fetch Active Social links
    const socialLinksDocs = await SocialLink.find({ active: true }).sort({ order: 1 }).lean();
    plainSocialLinks = socialLinksDocs.map((s: any) => ({
      _id: s._id.toString(),
      platform: s.platform,
      url: s.url,
      icon: s.icon,
    }));
  } catch (err) {
    console.error("Failed to load dynamic portfolio data from DB:", err);
  }

  return (
    <PortfolioContainer
      profile={plainProfile}
      skills={plainSkills}
      projects={plainProjects}
      education={plainEducation}
      certifications={plainCertifications}
      achievements={plainAchievements}
      contactInfo={plainContact}
      resume={plainResume}
      socialLinks={plainSocialLinks}
    />
  );
}
