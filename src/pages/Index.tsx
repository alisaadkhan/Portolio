import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Download, Menu, X, Mail, Github, Linkedin, Send,
  Briefcase, Code, Award, BadgeCheck, HelpCircle, MessageCircle,
  ShieldCheck, Server, Lock, ChevronDown, Terminal, Database,
  Shield, Zap, Globe, GitBranch, FileCode, Cpu, Cloud, Workflow,
  Boxes, Layers, PackageCheck, Rocket
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  NextJsIcon, ReactIcon, PythonIcon, DjangoIcon, AwsIcon,
  PostgreSqlIcon, DockerIcon, FastApiIcon, GitIcon, TypeScriptIcon
} from "../components/TechIcons";
import SpotlightButton from "../components/ui/SpotlightButton";
// TechIcons imports removed as we now use CDN images

// --- DATA ---
const AUTHORITY_BADGES = [
  { text: "Verified Expert", icon: ShieldCheck },
  { text: "Full Stack Architect", icon: Code },
  { text: "100% Job Success", icon: Award }
];

const NAV_LINKS = [
  { name: "Work", href: "/projects", icon: Briefcase },
  { name: "Services", href: "#services", icon: Code },
  { name: "Experience", href: "#experience", icon: Award },
  { name: "Certifications", href: "#certifications", icon: BadgeCheck },
  { name: "FAQ", href: "#faq", icon: HelpCircle }
];

// Split Skills into two categories
const CORE_COMPETENCIES = [
  {
    name: "System Architecture",
    icon: Boxes,
    description: "Designing fault-tolerant, scalable architectures that handle high concurrency. I prioritize stateless microservices and event-driven patterns to ensure 99.9% uptime."
  },
  {
    name: "API Security",
    icon: ShieldCheck,
    description: "Implementing defense-in-depth strategies including OAuth2 flows, JWT rotation, and strict rate-limiting. I ensure all endpoints are fortified against injection and DDoS attacks."
  },
  {
    name: "Database Optimization",
    icon: Database,
    description: "Advanced query tuning and schema normalization. I specialize in indexing strategies and caching layers (Redis) to reduce latency to sub-50ms."
  },
  {
    name: "System Design",
    icon: Workflow,
    description: "Creating comprehensive system designs that balance performance, scalability, and maintainability. Expert in distributed systems patterns and CAP theorem trade-offs."
  },
  {
    name: "DevOps Pipeline",
    icon: GitBranch,
    description: "Building CI/CD pipelines with automated testing, containerization, and zero-downtime deployments. Proficient in Docker, Kubernetes, and infrastructure as code."
  },
  {
    name: "Performance Tuning",
    icon: Zap,
    description: "Optimizing application performance through profiling, caching strategies, and code-level improvements. Achieving sub-100ms response times consistently."
  }
];

const TECH_STACK = [
  {
    name: "Next.js",
    type: "React Framework",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
    description: "React Server Components (RSC) and Edge Runtime."
  },
  {
    name: "React",
    type: "UI Library",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    description: "Component-based architecture and state management."
  },
  {
    name: "Python",
    type: "Backend Language",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    description: "Scalable backend systems and data processing."
  },
  {
    name: "Django",
    type: "Web Framework",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg",
    description: "Secure, high-level Python web framework."
  },
  {
    name: "AWS",
    type: "Cloud Infrastructure",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    description: "Cloud computing and serverless architecture."
  },
  {
    name: "PostgreSQL",
    type: "Database",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
    description: "Advanced relational database management."
  },
  {
    name: "Docker",
    type: "Containerization",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
    description: "Containerization for consistent deployment."
  },
  {
    name: "FastAPI",
    type: "API Framework",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg",
    description: "High-performance API development."
  },
  {
    name: "Git",
    type: "Version Control",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
    description: "Distributed version control system."
  },
  {
    name: "TypeScript",
    type: "Language",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
    description: "Type-safe JavaScript development."
  }
];

const PROJECTS = [
  {
    title: "Digital Signage System",
    description: "Centralized CMS for real-time display updates with sub-200ms latency serving 50+ screens across 3 locations.",
    tools: ["PHP 8", "MySQL", "WebSockets"],
    year: "2024",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=800&fit=crop&q=80",
  },
  {
    title: "CPU Scheduling Simulator",
    description: "Algorithmic engine for OS process management handling 10k+ concurrent queues with optimized memory allocation.",
    tools: ["C++", "Algorithms", "Data Structures"],
    year: "2024",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop&q=80",
  },
  {
    title: "Secure Authentication API",
    description: "Enterprise-grade authentication system with JWT, OAuth 2.0, and rate limiting serving 100k+ daily requests.",
    tools: ["Python", "FastAPI", "Redis"],
    year: "2023",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop&q=80",
  },
  {
    title: "E-commerce Backend",
    description: "Scalable microservices architecture powering a multi-vendor marketplace with real-time inventory sync.",
    tools: ["Django", "PostgreSQL", "Celery"],
    year: "2023",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=800&fit=crop&q=80",
  }
];

const EXPERIENCE = [
  {
    role: "Lead Backend Engineer",
    company: "Upwork / Remote",
    period: "Jun 2024 - Present",
    achievements: [
      "Architecting automation scripts and secure APIs for international clients",
      "Maintaining 100% Job Success Score across 15+ completed projects",
      "Technologies: Python, Django, FastAPI, PostgreSQL"
    ]
  },
  {
    role: "Systems Architect",
    company: "University Projects",
    period: "Sep 2022 - Present",
    achievements: [
      "Leading development on algorithmic systems and OS simulations",
      "Focus: Memory management, database security, concurrency",
      "Technologies: C++, Algorithms, Data Structures"
    ]
  }
];

// --- DATA ---
const SKILLS_LIST = [
  "System Architecture", "API Security", "Database Optimization",
  "System Design", "DevOps Pipeline", "Performance Tuning",
  "React", "Next.js", "TypeScript", "Node.js",
  "Docker", "AWS", "PostgreSQL", "Redis",
  "Microservices", "CI/CD", "GraphQL", "Tailwind CSS",
  "UX Design", "UI Design", "Product Design"
];

const CERTIFICATIONS = [
  {
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&q=80",
    title: "System Architecture"
  },
  {
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop&q=80",
    title: "Meta Backend Developer"
  },
  {
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop&q=80",
    title: "Cybersecurity Analyst"
  }
];

const FAQ_ITEMS = [
  {
    question: "Why hire a Solo Product Team instead of an agency?",
    answer: "Agencies have communication lag and overhead. I offer the speed of a solo founder with the architectural depth of a dedicated team. You speak directly to the engineer building your product."
  },
  {
    question: "What is your tech stack for scalable SaaS?",
    answer: "I build on Next.js for frontend speed, Python/Django for backend logic, and PostgreSQL for data integrity. This stack is chosen for stability and rapid scaling."
  },
  {
    question: "How do you handle security and handovers?",
    answer: "Security is baked in, not an afterthought. I follow OWASP standards. At handover, you receive full documentation, clean repo access, and a video walkthrough of the architecture."
  }
];

// Spring physics constants
const springTransition = { type: "spring" as const, stiffness: 200, damping: 20 };
const fastSpring = { type: "spring" as const, stiffness: 300, damping: 30 };

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition
  }
};

// --- SKILL MODAL COMPONENT ---
function SkillModal({ skill, onClose }: { skill: typeof CORE_COMPETENCIES[0] | typeof TECH_STACK[0]; onClose: () => void }) {
  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          transition={fastSpring}
        />

        {/* Modal Panel - Slides up from bottom */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={springTransition}
          className="fixed bottom-0 left-0 right-0 bg-[#0F172A]/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-8 z-50 max-h-[85vh] overflow-y-auto"
        >
          <div className="max-w-4xl mx-auto">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Large Icon or Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...springTransition, delay: 0.1 }}
              className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mb-6 overflow-hidden"
            >
              {'image' in skill ? (
                <img src={skill.image} alt={skill.name} className="w-12 h-12 object-contain" />
              ) : (
                <skill.icon className="w-10 h-10 text-white" />
              )}
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.15 }}
              className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight"
            >
              {skill.name}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.2 }}
              className="text-slate-300 text-lg leading-relaxed"
              style={{ lineHeight: 1.7 }}
            >
              {skill.description}
            </motion.p>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}

// --- MAGNETIC BUTTON COMPONENT ---
function MagneticButton({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={springTransition}
    >
      {children}
    </motion.a>
  );
}

// --- FAQ ITEM COMPONENT ---
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-[#1E293B] pb-6"
      initial={false}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group"
      >
        <h3 className="text-lg md:text-xl font-bold text-white pr-8 group-hover:text-slate-400 transition-colors">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={fastSpring}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={fastSpring}
            className="overflow-hidden"
          >
            <p className="mt-4 text-[#94A3B8] leading-relaxed" style={{ lineHeight: 1.6 }}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Index() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<typeof CORE_COMPETENCIES[0] | typeof TECH_STACK[0] | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedSkill) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedSkill]);

  return (
    <div className="min-h-screen bg-[#020617] text-white antialiased" style={{ scrollBehavior: "smooth" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          letter-spacing: -0.02em;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* --- AURORA MESH BACKGROUND (Framer-Style Living Background) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Layer 1: The Void (Deepest Black) */}
        <div className="absolute inset-0 bg-[#020617]" />

        {/* Layer 2: The Aurora Orbs - Floating Color Blobs */}

        {/* Orb 1: Steel Blue */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
            filter: "blur(120px)",
            willChange: "transform"
          }}
          animate={{
            x: [100, 300, -100, 100],
            y: [100, -100, 200, 100],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          initial={{ x: 100, y: 100, opacity: 0.3 }}
        />

        {/* Orb 2: Deep Blue */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
            filter: "blur(120px)",
            willChange: "transform",
            right: 0,
            top: "20%"
          }}
          animate={{
            x: [-100, 100, -200, -100],
            y: [-50, 150, 50, -50],
            scale: [1, 0.9, 1.1, 1],
            opacity: [0.4, 0.3, 0.5, 0.4]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          initial={{ opacity: 0.4 }}
        />

        {/* Orb 3: Teal */}
        <motion.div
          className="absolute w-[550px] h-[550px] rounded-full"
          style={{
            background: "radial-gradient(circle, #14B8A6 0%, transparent 70%)",
            filter: "blur(120px)",
            willChange: "transform",
            left: "30%",
            bottom: "10%"
          }}
          animate={{
            x: [-150, 150, 0, -150],
            y: [0, -150, 100, 0],
            scale: [0.9, 1.1, 1, 0.9],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          initial={{ opacity: 0.3 }}
        />

        {/* Layer 3: The Grid Texture with Vignette */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at center, transparent 0%, rgba(2, 6, 23, 0.9) 100%),
              repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(255, 255, 255, 0.03) 50px, rgba(255, 255, 255, 0.03) 51px),
              repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(255, 255, 255, 0.03) 50px, rgba(255, 255, 255, 0.03) 51px)
            `,
            backgroundSize: "cover, 50px 50px, 50px 50px"
          }}
        />
      </div>

      {/* --- CONTENT WRAPPER (z-10 to sit above aurora) --- */}
      <div className="relative z-10">

        {/* --- SKILL MODAL --- */}
        {selectedSkill && (
          <SkillModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
        )}

        {/* --- GLASSMORPHISM STICKY HEADER --- */}
        <motion.nav
          className={`fixed top-0 w-full z-30 transition-all duration-300 ${scrolled ? "shadow-lg shadow-black/20" : ""
            }`}
          style={{
            background: scrolled ? "rgba(15, 23, 42, 0.8)" : "rgba(2, 6, 23, 0.8)",
            backdropFilter: scrolled ? "blur(24px)" : "blur(16px)",
            WebkitBackdropFilter: scrolled ? "blur(24px)" : "blur(16px)",
            borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.05)" : "none"
          }}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={springTransition}
        >
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <motion.a
              href="#"
              className="text-xl font-black text-white tracking-tight"
              whileHover={{ scale: 1.05 }}
              transition={fastSpring}
            >
              Ali Saad Khan
            </motion.a>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((item) => {
                const isInternal = item.href.startsWith("/");
                return isInternal ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center gap-2 text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ) : (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors"
                    whileHover={{ y: -2 }}
                    transition={fastSpring}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </motion.a>
                );
              })}
              <SpotlightButton
                href="#contact"
                className="rounded-full"
              >
                Get in Touch
              </SpotlightButton>
            </div>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-[#0F172A]/95 backdrop-blur-xl border-t border-[#1E293B]"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={fastSpring}
            >
              <div className="flex flex-col p-6 gap-4">
                {NAV_LINKS.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-lg font-bold text-white hover:text-slate-400 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </a>
                ))}
                <a
                  href="#contact"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1E293B] border border-white/10 text-white font-bold rounded-xl text-center shadow-lg mt-2 hover:border-white/50 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Get in Touch
                </a>
              </div>
            </motion.div>
          )}
        </motion.nav>

        {/* --- HERO SECTION --- */}
        <section className="pt-32 pb-24 px-6 min-h-screen flex items-center relative z-20">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Column */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              {/* Authority Badges */}
              <motion.div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8" variants={itemVariants}>
                {AUTHORITY_BADGES.map((badge) => (
                  <motion.span
                    key={badge.text}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm font-bold text-[#94A3B8]"
                    whileHover={{ scale: 1.05, y: -2, boxShadow: "0 8px 30px rgba(255, 255, 255, 0.1)" }}
                    transition={springTransition}
                  >
                    <badge.icon className="w-4 h-4 text-[#3B82F6]" />
                    {badge.text}
                  </motion.span>
                ))}
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tighter"
                variants={itemVariants}
              >
                Solo Product Team
                <br />
                <span className="bg-gradient-to-r from-white to-[#94A3B8] bg-clip-text text-transparent">
                  for Your SaaS
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                className="text-xl text-[#94A3B8] mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                variants={itemVariants}
                style={{ lineHeight: 1.6 }}
              >
                I architect, develop, and deploy secure backend systems end-to-end: from database design to
                production-ready APIs in Python/Django and Next.js. With 4+ years of experience and AI-accelerated
                workflows, you get a senior backend engineer, security specialist, and DevOps engineer in one.
              </motion.p>

              {/* CTAs */}
              <motion.div className="flex flex-wrap justify-center lg:justify-start gap-4" variants={itemVariants}>
                <MagneticButton
                  href="#"
                  className="flex items-center gap-2 px-8 py-4 bg-white text-[#020617] font-bold rounded-xl shadow-2xl shadow-white/10 hover:shadow-white/20 transition-shadow"
                >
                  <Download size={20} /> Get My CV
                </MagneticButton>
                <motion.a
                  href="/projects"
                  className="flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white/20 text-white font-bold rounded-xl hover:border-white hover:text-white transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springTransition}
                >
                  View My Work <ArrowRight size={20} />
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Image Column */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="relative h-[400px] w-[400px] rounded-full overflow-hidden border-4 border-[#CBF381] shadow-2xl bg-black group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Default Image */}
                <img
                  src="/assets/profile-avatar.jpg"
                  alt="Ali Saad Khan"
                  className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-125"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- SKILLS SECTION (SPLIT) --- */}
        <motion.section
          id="services"
          className="py-24 px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Core Competencies */}
            <div>
              <motion.h2
                className="text-sm font-bold uppercase tracking-widest text-[#94A3B8] mb-8"
                variants={itemVariants}
              >
                Core Competencies
              </motion.h2>

              <motion.div
                className="flex flex-wrap justify-center gap-3 lg:px-20"
                variants={containerVariants}
              >
                {SKILLS_LIST.map((skill, index) => (
                  <motion.div
                    key={index}
                    className="px-6 py-3 bg-[#0F172A] border border-[#1E293B] rounded-xl text-[#94A3B8] font-medium text-sm hover:text-white hover:border-[#3B82F6]/50 transition-all cursor-default"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {skill}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Tech Stack - Unified Glass Dock */}
            <div>
              <motion.h2
                className="text-sm font-bold uppercase tracking-widest text-[#94A3B8] mb-8 text-center"
                variants={itemVariants}
              >
                Tech Stack
              </motion.h2>

              {/* Single Unified Container - The Glass Dock (Void Black) */}
              <motion.div
                className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-8 py-6 px-10 bg-[#020617] border border-white/10 rounded-full shadow-2xl"
                variants={containerVariants}
              >
                {TECH_STACK.map((tech, index) => (
                  <div key={tech.name} className="relative group">
                    {/* Tooltip */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#E2E8F0] text-[#0F172A] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap z-50 shadow-xl flex flex-col items-center">
                      <div className="font-bold text-sm leading-tight">{tech.name}</div>
                      <div className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider leading-tight mt-0.5">{tech.type}</div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#E2E8F0]" />
                    </div>

                    {/* Icon */}
                    <motion.button
                      onClick={() => setSelectedSkill(tech)}
                      className="relative w-12 h-12 flex items-center justify-center p-2 rounded-xl bg-transparent hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.2, y: -5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <img
                        src={tech.image}
                        alt={tech.name}
                        className="w-full h-full object-contain filter grayscale-[0.3] group-hover:grayscale-0 transition-all duration-300"
                      />
                    </motion.button>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* --- PROJECTS SECTION (ENHANCED HOVER) --- */}
        <motion.section
          id="work"
          className="py-24 px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-sm font-bold uppercase tracking-widest text-[#94A3B8] mb-12 text-center"
              variants={itemVariants}
            >
              Selected Work
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROJECTS.map((project) => (
                <motion.div
                  key={project.title}
                  className="group relative bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 25px 70px rgba(139, 92, 246, 0.3)"
                  }}
                  transition={springTransition}
                >
                  {/* Image with internal zoom */}
                  <div className="aspect-video overflow-hidden">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={springTransition}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Metadata */}
                    <div className="flex items-center gap-3 mb-4 text-xs text-[#94A3B8]">
                      <span className="font-mono font-bold">{project.year}</span>
                      <span>•</span>
                      <div className="flex gap-2 flex-wrap">
                        {project.tools.map((tool) => (
                          <span key={tool} className="px-2 py-1 bg-[#020617] rounded-md font-medium">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-[#94A3B8] mb-6 leading-relaxed" style={{ lineHeight: 1.6 }}>
                      {project.description}
                    </p>

                    {/* CTA with Arrow Slide */}
                    <Link
                      to="/projects"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E293B] border border-white/10 text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all"
                    >
                      View Case Study
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-16">
            <SpotlightButton to="/projects">
              View My All Work
            </SpotlightButton>
          </div>

        </motion.section>

        {/* --- CERTIFICATIONS SECTION --- */}
        <motion.section
          id="certifications"
          className="py-24 px-6 bg-gradient-to-b from-transparent to-[#0F172A]/30"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-sm font-bold uppercase tracking-widest text-[#94A3B8] mb-12 text-center"
              variants={itemVariants}
            >
              Professional Certifications
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CERTIFICATIONS.map((cert, index) => (
                <motion.div
                  key={index}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={springTransition}
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* --- EXPERIENCE SECTION --- */}
        <motion.section
          id="experience"
          className="py-24 px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="max-w-5xl mx-auto">
            <motion.h2
              className="text-sm font-bold uppercase tracking-widest text-[#94A3B8] mb-12 text-center"
              variants={itemVariants}
            >
              Experience
            </motion.h2>

            <div className="space-y-12">
              {EXPERIENCE.map((job, index) => (
                <motion.div
                  key={index}
                  className="relative pl-12 border-l-2 border-[#1E293B]"
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  transition={springTransition}
                >
                  {/* Purple Dot */}
                  <motion.div
                    className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#8B5CF6] shadow-lg shadow-purple-500/50"
                    whileHover={{ scale: 1.3, boxShadow: "0 0 20px rgba(139, 92, 246, 0.8)" }}
                    transition={springTransition}
                  />

                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-3">
                    <h3 className="text-2xl font-black text-white tracking-tight">{job.role}</h3>
                    <span className="text-sm font-mono text-[#94A3B8] mt-1 md:mt-0">{job.period}</span>
                  </div>
                  <p className="text-lg text-[#8B5CF6] font-bold mb-4">{job.company}</p>
                  <ul className="space-y-2 text-[#94A3B8]">
                    {job.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex gap-3" style={{ lineHeight: 1.6 }}>
                        <span className="text-[#8B5CF6] mt-1">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* --- FAQ SECTION --- */}
        <motion.section
          id="faq"
          className="py-24 px-6 bg-gradient-to-b from-[#0F172A]/30 to-transparent"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2
              className="text-sm font-bold uppercase tracking-widest text-[#94A3B8] mb-12 text-center"
              variants={itemVariants}
            >
              Frequently Asked Questions
            </motion.h2>

            <motion.div className="space-y-6" variants={containerVariants}>
              {FAQ_ITEMS.map((faq, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <FAQItem question={faq.question} answer={faq.answer} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* --- FOOTER CTA --- */}
        <motion.section
          id="contact"
          className="relative py-32 px-6 overflow-hidden"
          style={{
            background: "#020617"
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.h2
              className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight"
              variants={itemVariants}
            >
              Ready to build
              <br />
              <span className="bg-gradient-to-r from-white to-[#94A3B8] bg-clip-text text-transparent">
                scalable infrastructure?
              </span>
            </motion.h2>

            <motion.p
              className="text-xl text-[#94A3B8] mb-12 max-w-2xl mx-auto"
              variants={itemVariants}
              style={{ lineHeight: 1.6 }}
            >
              Take your product from concept to production with a dedicated architect.
            </motion.p>

            <motion.div className="flex flex-wrap justify-center gap-4 mb-16" variants={itemVariants}>
              <MagneticButton
                href="mailto:alisaad75878@gmail.com"
                className="flex items-center gap-3 px-10 py-5 bg-white text-[#020617] font-black rounded-xl shadow-2xl hover:shadow-white/20 transition-shadow text-lg"
              >
                <Mail size={24} /> Email Me
              </MagneticButton>
              <MagneticButton
                href="#contact"
                className="flex items-center gap-3 px-10 py-5 bg-[#1E293B] border border-white/10 text-white font-black rounded-xl shadow-2xl hover:shadow-white/20 hover:border-white/50 transition-all text-lg"
              >
                <Rocket size={24} /> Initialize Project
              </MagneticButton>
            </motion.div>

            {/* Social Links */}
            <motion.div className="flex justify-center gap-6 mb-12" variants={itemVariants}>
              {[
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Send, href: "#", label: "Telegram" }
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="p-4 bg-white/5 backdrop-blur-sm rounded-xl text-white hover:bg-slate-800 border border-white/10 hover:border-white/50 transition-all"
                  whileHover={{ scale: 1.1, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  transition={springTransition}
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </motion.div>

            {/* Footer */}
            <motion.div
              className="pt-12 border-t border-white/10"
              variants={itemVariants}
            >
              <p className="text-[#94A3B8] text-sm">© 2026 Ali Saad Khan. All rights reserved.</p>
            </motion.div>
          </div>

          {/* Animated Background Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.section>
      </div > {/* End Content Wrapper */}
    </div >
  );
}
