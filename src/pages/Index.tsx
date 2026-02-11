import SonarBackground from "@/components/SonarBackground";
import ScrollSubmarineEffects from "@/components/ScrollSubmarineEffects";
import SubmarineCrosshair from "@/components/SubmarineCrosshair";
import DepthMeter from "@/components/DepthMeter";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TacticalMap from "@/components/TacticalMap";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import SectionDivider from "@/components/SectionDivider";

import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const sectionTitles: { [key: string]: string } = {
      home: "Vignesh B | Home",
      about: "Vignesh B | About",
      projects: "Vignesh B | Projects",
      skills: "Vignesh B | Skills",
      contact: "Vignesh B | Contact",
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const title = sectionTitles[entry.target.id];
            if (title) document.title = title;
          }
        });
      },
      { threshold: 0.3 }
    );

    Object.keys(sectionTitles).forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const savedTitle = { current: document.title };
    const awayMessages = [
      "Signal lost... 📡",
      "Surface breach detected! ⚠️",
      "System idle...",
      "Awaiting command...",
      "Radar silent...",
      "Come back to the deep! 🌊"
    ];

    const handleVisibilityChange = () => {
      if (document.hidden) {
        savedTitle.current = document.title;
        document.title = awayMessages[Math.floor(Math.random() * awayMessages.length)];
      } else {
        document.title = savedTitle.current;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <div className="relative min-h-screen">
      <SonarBackground />
      <ScrollSubmarineEffects />
      <DepthMeter />
      <SubmarineCrosshair />
      <Navbar />
      <main>
        <HeroSection />
        <SectionDivider variant="sonar" />
        <TacticalMap />
        <SectionDivider variant="bubbles" />
        <AboutSection />
        <SectionDivider variant="bubbles" />
        <ProjectsSection />
        <SectionDivider variant="depth" />
        <SkillsSection />
        <SectionDivider variant="signal" />
        <ContactSection />
      </main>
    </div>
  );
};

export default Index;
