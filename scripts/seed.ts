import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// Manual env loader for .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value.trim();
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not set in .env.local");
  process.exit(1);
}

// Inline models to avoid tsconfig path import issues in external runners
import { User } from "../src/models/User";
import { Profile } from "../src/models/Profile";
import { SocialLink } from "../src/models/SocialLink";
import { Project } from "../src/models/Project";
import { Skill } from "../src/models/Skill";
import { Education } from "../src/models/Education";
import { Certification } from "../src/models/Certification";
import { Achievement } from "../src/models/Achievement";
import { ContactInfo } from "../src/models/ContactInfo";
import { Resume } from "../src/models/Resume";
import { Settings } from "../src/models/Settings";
import { Analytics } from "../src/models/Analytics";
import { ActivityLog } from "../src/models/ActivityLog";

async function seed() {
  console.log("Connecting to MongoDB Database...");
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected successfully!");

  // Clear existing databases
  console.log("Cleaning existing database collections...");
  await User.deleteMany({});
  await Profile.deleteMany({});
  await SocialLink.deleteMany({});
  await Project.deleteMany({});
  await Skill.deleteMany({});
  await Education.deleteMany({});
  await Certification.deleteMany({});
  await Achievement.deleteMany({});
  await ContactInfo.deleteMany({});
  await Resume.deleteMany({});
  await Settings.deleteMany({});
  await Analytics.deleteMany({});
  await ActivityLog.deleteMany({});

  console.log("Collections cleared. Beginning seeding...");

  // 1. Seed User (Admin)
  const passwordHash = await bcrypt.hash("adminpassword", 12);
  const adminUser = await User.create({
    name: "Amit Padhan",
    email: "padhanamit072006@gmail.com",
    passwordHash,
    role: "admin",
  });
  console.log("✓ Admin User created successfully (adminpassword)");

  // 2. Seed Profile
  await Profile.create({
    name: "Amit Padhan",
    title: "AI Full Stack Developer & Software Engineer",
    heroHeading: "Hi, I'm Amit Padhan",
    heroDescription: "AI Full Stack Developer & Software Engineer sophomore at Graphic Era Hill University. Dedicated to coding high-performance software, designing secure schemas, and building intelligent analytical engines.",
    aboutMe: "I am a highly motivated B.Tech Computer Science Engineering student specializing in AI Full Stack. My academic tenure is focused on bridging the gap between core software engineering principles and intelligent cloud-based architectures. I enjoy designing optimal database structures, writing robust APIs, and assembling clean frontend interfaces. Beyond development, my curiosity drives me towards understanding Machine Learning algorithms, NLP processing layers, and Large Language Models.",
    profilePicture: "/Amit.jpg",
    heroImage: "/myphoto.png",
    stats: [
      { label: "Projects Completed", value: 4, suffix: "+", subtext: "Production-ready apps" },
      { label: "DSA Solved", value: 200, suffix: "+", subtext: "Leetcode & local platforms" },
      { label: "Technologies Mastered", value: 20, suffix: "+", subtext: "Languages, Frameworks, DBs" },
    ],
  });
  console.log("✓ Profile created successfully");

  // 3. Seed Social Links
  const socialLinksData = [
    { platform: "GitHub", url: "https://github.com/amitpadhan07", icon: "Github", active: true, order: 1 },
    { platform: "LinkedIn", url: "https://linkedin.com/in/amitpadhan", icon: "Linkedin", active: true, order: 2 },
    { platform: "Instagram", url: "https://www.instagram.com/padhan_amit_07", icon: "Instagram", active: true, order: 3 },
    { platform: "Telegram", url: "https://t.me/amitpad_07", icon: "Send", active: true, order: 4 },
  ];
  await SocialLink.insertMany(socialLinksData);
  console.log("✓ Social Links seeded");

  // 4. Seed Projects
  const projectsData = [
    {
      name: "GEHU Event Management Portal",
      description: "A production-grade, serverless portal built to automate event registrations and check-ins. Decreased check-in queue times by 50% for 500+ student attendees and optimized data schemas to reduce database query latencies.",
      technologies: ["Next.js", "TypeScript", "MongoDB", "React", "Tailwind CSS"],
      githubUrl: "https://github.com/amitpadhan07",
      liveUrl: "https://github.com/amitpadhan07",
      image: "",
      category: "Full Stack App",
      featured: true,
      status: "active",
      order: 1,
    },
    {
      name: "PeriodTracker",
      description: "A secure, privacy-first healthcare tracking application that provides users with insights and dynamic charts analyzing biological cycles, logging trends, and protecting personal metrics via encrypted storage.",
      technologies: ["Next.js", "MongoDB", "Recharts", "Next-Auth", "TypeScript"],
      githubUrl: "https://github.com/amitpadhan07",
      liveUrl: "https://github.com/amitpadhan07",
      image: "",
      category: "Health Analytics",
      featured: true,
      status: "active",
      order: 2,
    },
    {
      name: "Certiii – Certificate Download Portal",
      description: "An automated certificate generation and distribution engine that renders unique participant credentials in real-time, verifying document hashes against a distributed database to prevent fraud.",
      technologies: ["React.js", "Node.js", "Express.js", "MongoDB"],
      githubUrl: "https://github.com/amitpadhan07",
      liveUrl: "https://github.com/amitpadhan07",
      image: "",
      category: "Automation Services",
      featured: false,
      status: "active",
      order: 3,
    },
    {
      name: "RSSB Management System",
      description: "A secure organizational management portal connecting directly to a relational database schema. Automates workflow dispatch, eliminates manual reporting delays, and structures operational statistics.",
      technologies: ["React.js", "Node.js", "Express.js", "PostgreSQL"],
      githubUrl: "https://github.com/amitpadhan07",
      liveUrl: "https://github.com/amitpadhan07",
      image: "",
      category: "Administrative DBMS",
      featured: false,
      status: "active",
      order: 4,
    },
  ];
  await Project.insertMany(projectsData);
  console.log("✓ Projects seeded");

  // 5. Seed Skills
  const skillsData = [
    // Frontend
    { name: "React.js", icon: "Monitor", category: "Frontend", level: "Advanced", order: 1 },
    { name: "Next.js", icon: "Monitor", category: "Frontend", level: "Advanced", order: 2 },
    { name: "HTML5 & CSS3", icon: "Monitor", category: "Frontend", level: "Advanced", order: 3 },
    { name: "Tailwind CSS", icon: "Monitor", category: "Frontend", level: "Advanced", order: 4 },
    // Backend
    { name: "Node.js", icon: "Server", category: "Backend", level: "Advanced", order: 5 },
    { name: "Express.js", icon: "Server", category: "Backend", level: "Advanced", order: 6 },
    { name: "MongoDB", icon: "Database", category: "Database", level: "Advanced", order: 7 },
    { name: "PostgreSQL / SQL", icon: "Database", category: "Database", level: "Intermediate", order: 8 },
    // Programming
    { name: "JavaScript", icon: "Terminal", category: "Programming", level: "Advanced", order: 9 },
    { name: "TypeScript", icon: "Terminal", category: "Programming", level: "Advanced", order: 10 },
    { name: "Python", icon: "Terminal", category: "Programming", level: "Advanced", order: 11 },
    { name: "Java / C++", icon: "Terminal", category: "Programming", level: "Intermediate", order: 12 },
    // AI/ML
    { name: "Machine Learning", icon: "Cpu", category: "AI/ML", level: "Intermediate", order: 13 },
    { name: "NLP Fundamentals", icon: "Cpu", category: "AI/ML", level: "Intermediate", order: 14 },
    { name: "Generative AI", icon: "Cpu", category: "AI/ML", level: "Intermediate", order: 15 },
    { name: "LLMs / Prompting", icon: "Cpu", category: "AI/ML", level: "Intermediate", order: 16 },
  ];
  await Skill.insertMany(skillsData);
  console.log("✓ Skills seeded");

  // 6. Seed Education
  await Education.create({
    institution: "Graphic Era Hill University",
    degree: "B.Tech in Computer Science Engineering (AI Full Stack Focus)",
    duration: "2024 — Present (Expected 2028)",
    description: "Specializing in the AI Full Stack program. Laying a solid foundation in low-level system design and algorithms.",
    grade: "9.2 GPA Equivalent (Specialist Focus)",
  });
  console.log("✓ Education seeded");

  // 7. Seed Certifications
  const certsData = [
    { name: "Database Management Systems", issuer: "NPTEL", date: "2025", certificateUrl: "", image: "" },
    { name: "AWS Cloud CLI Essentials", issuer: "AWS Cloud Academy", date: "2025", certificateUrl: "", image: "" },
    { name: "Google AI for Data Analysis", issuer: "Google", date: "2025", certificateUrl: "", image: "" },
    { name: "Google AI for Research and Insights", issuer: "Google", date: "2025", certificateUrl: "", image: "" },
  ];
  await Certification.insertMany(certsData);
  console.log("✓ Certifications seeded");

  // 8. Seed Achievements
  const achievementsData = [
    { title: "Full-Stack Deployment", description: "Successfully developed and deployed 4 production-grade full-stack web applications.", icon: "FolderGit2", date: "2024 - 2026" },
    { title: "DSA Solving", description: "Solved 200+ data structure and algorithmic problems on LeetCode and local platforms.", icon: "Code", date: "2025" },
    { title: "System Automation", description: "Automated event check-in workflows reducing lines/wait times by 50% for 500+ attendees.", icon: "Zap", date: "2025" },
  ];
  await Achievement.insertMany(achievementsData);
  console.log("✓ Achievements seeded");

  // 9. Seed Contact Info
  await ContactInfo.create({
    email: "padhanamit072006@gmail.com",
    phone: "+91-7505795679",
    address: "Graphic Era Hill University | Dehradun",
    location: "Dehradun, Uttarakhand, India",
    whatsapp: "+91-7505795679",
    telegram: "amitpad_07",
  });
  console.log("✓ Contact Info seeded");

  // 10. Seed Resume
  await Resume.create({
    pdfUrl: "/Amit_Padhan_Resume.pdf",
    downloadCount: 15,
  });
  console.log("✓ Resume seeded");

  // 11. Seed Settings
  await Settings.create({
    siteTitle: "Amit Padhan | AI Full Stack Developer",
    metaDescription: "Professional portfolio of Amit Padhan, AI Full Stack Developer & Software Engineer sophomore at Graphic Era Hill University.",
    keywords: ["Amit Padhan", "Portfolio", "Full Stack Developer", "AI Engineer", "Next.js", "TypeScript"],
    favicon: "/weblogo.jpg",
    analyticsId: "",
    maintenanceMode: false,
  });
  console.log("✓ Global Settings seeded");

  // 12. Seed Analytics (Last 7 Days)
  const analyticsData = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    analyticsData.push({
      date: dateStr,
      visitors: Math.floor(Math.random() * 50) + 15,
      pageViews: Math.floor(Math.random() * 120) + 40,
      resumeDownloads: Math.floor(Math.random() * 8) + 1,
      formSubmissions: Math.floor(Math.random() * 3),
    });
  }
  await Analytics.insertMany(analyticsData);
  console.log("✓ Analytics Trend seeded (last 7 days)");

  // 13. Log Seeding Activity
  await ActivityLog.create({
    action: "Database completely initialized and seeded via setup script",
    adminUser: adminUser.email,
    ipAddress: "127.0.0.1",
  });
  console.log("✓ Activity Log created");

  console.log("Database seeding completed successfully! Close connection.");
  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error("Database seeding failed:", err);
  process.exit(1);
});
