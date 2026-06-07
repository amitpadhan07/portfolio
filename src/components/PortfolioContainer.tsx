"use client";

import { useState } from "react";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Timeline from "@/components/Timeline";
import Certifications from "@/components/Certifications";
import Achievements from "@/components/Achievements";
import GithubStats from "@/components/GithubStats";
import Contact from "@/components/Contact";

interface PortfolioContainerProps {
  profile: any;
  skills: any[];
  projects: any[];
  education: any[];
  certifications: any[];
  achievements: any[];
  contactInfo: any;
  resume: any;
  socialLinks: any[];
}

export default function PortfolioContainer({
  profile,
  skills,
  projects,
  education,
  certifications,
  achievements,
  contactInfo,
  resume,
  socialLinks,
}: PortfolioContainerProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <div className="flex flex-col min-h-screen">
          <Hero profile={profile} resume={resume} />
          <About profile={profile} />
          <Skills skills={skills} />
          <Projects projects={projects} />
          <Timeline education={education} />
          <Certifications certifications={certifications} />
          <Achievements achievements={achievements} />
          <GithubStats />
          <Contact contactInfo={contactInfo} socialLinks={socialLinks} />
        </div>
      )}
    </>
  );
}
