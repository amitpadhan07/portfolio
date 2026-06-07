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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* Main Portfolio Sections */}
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Timeline />
          <Certifications />
          <Achievements />
          <GithubStats />
          <Contact />
        </div>
      )}
    </>
  );
}
