import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence, useMotionValue, useScroll, useTransform, LazyMotion, domAnimation, m } from "framer-motion";
import {
  ArrowRight, Download, Menu, X, Mail, Github, Linkedin, Send,
  Briefcase, Code, Award, BadgeCheck, HelpCircle, MessageCircle,
  ShieldCheck, Server, Lock, ChevronDown, Terminal, Database,
  Shield, Zap, Globe, GitBranch, FileCode, Cpu, Cloud, Workflow,
  Boxes, Layers, PackageCheck, Rocket, Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  NextJsIcon, ReactIcon, PythonIcon, DjangoIcon, AwsIcon,
  PostgreSqlIcon, DockerIcon, FastApiIcon, GitIcon, TypeScriptIcon
} from "../components/TechIcons";
import SpotlightButton from "../components/ui/SpotlightButton";
import SwipeFillButton from "../components/ui/SwipeFillButton";
import { supabase } from "../lib/supabase";
import { featuredProjects } from "../data/projects";
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

// Upwork Icon - Minimal monochrome for dark theme
const UpworkIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c2.539 0 4.51 1.649 5.31 4.366 1.22-1.834 2.148-4.036 2.687-5.892H24v7.112c0 .956-.777 1.733-1.733 1.733h-.629V4.647h-2.906v10.102h-3.966V9.282c-.564-1.803-2.009-3.969-4.393-3.969-2.7 0-4.515 2.111-4.515 4.952 0 2.841 1.815 4.952 4.515 4.952z" />
  </svg>
);

// Fiverr Icon - Minimal monochrome for dark theme
const FiverrIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.004 15.588a.995.995 0 1 0 0-1.99.995.995 0 0 0 0 1.99M13.95 8.05h1.026c.19 0 .333.147.333.336v.71h1.565v-.71c0-1.045-.84-1.905-1.897-1.905H13.95c-1.054 0-1.896.86-1.896 1.906v.71H10.97v-.71c0-.19.146-.336.335-.336h1.03c.186 0 .332-.148.332-.337V6.144c0-1.046-.84-1.906-1.898-1.906H9.74c-1.055 0-1.897.86-1.897 1.906v.71H6.757c-1.055 0-1.897.86-1.897 1.905v1.807c0 1.045.842 1.905 1.897 1.905h1.086c1.055 0 1.897-.86 1.897-1.905V9.762c0-.19.145-.336.334-.336h1.08v3.612h1.566v-3.612h1.083c.186 0 .333.147.333.336v1.807c0 1.045.84 1.905 1.896 1.905h1.028c1.055 0 1.897-.86 1.897-1.905V9.76c0-1.045-.842-1.905-1.897-1.905z" />
  </svg>
);

// Certifications will be loaded from Supabase
const CERTIFICATIONS_PLACEHOLDER = [
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

// --- MAGNETIC BUTTON COMPONENT (Enhanced with Spring Physics) ---
function MagneticButton({ children, href, className, target, rel }: { children: React.ReactNode; href: string; className?: string; target?: string; rel?: string }) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Enhanced magnetic pull
    const distance = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
    );
    const maxDistance = 100;
    if (distance < maxDistance) {
      x.set((e.clientX - centerX) * 0.25);
      y.set((e.clientY - centerY) * 0.25);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      target={target}
      rel={rel}
      className={className}
      style={{ x, y, willChange: "transform" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.5)"
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
            initial={{ scaleY: 0, opacity: 0, originY: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={fastSpring}
            className="overflow-hidden"
            style={{ willChange: "transform, opacity" }}
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
  const [certifications, setCertifications] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [hoveredIconIndex, setHoveredIconIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // Fetch data from Supabase - set loading before fetch
    setLoading(true);
    fetchData();

    // Refetch on window focus (when returning from admin panel)
    const handleFocus = () => fetchData();
    window.addEventListener("focus", handleFocus);

    // Set up real-time subscriptions
    const projectsChannel = supabase
      .channel('projects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => fetchData())
      .subscribe();

    const skillsChannel = supabase
      .channel('skills-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, () => fetchData())
      .subscribe();

    const certsChannel = supabase
      .channel('certifications-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'certifications' }, () => fetchData())
      .subscribe();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("focus", handleFocus);
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(skillsChannel);
      supabase.removeChannel(certsChannel);
    };
  }, []);

  async function fetchData() {
    console.log('🔄 Starting data fetch...');
    try {
      // NO-CACHE RULE: Force fresh data on every fetch
      // Get Projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('position', { ascending: true });
      console.log('📦 Projects:', projectsData, projectsError);

      // Always set projects - use fallback if needed
      if (projectsData && projectsData.length > 0) {
        setProjects(projectsData);
      } else {
        // Showcase featured projects from projects.ts data
        const fallbackProjects = featuredProjects.map((proj, idx) => ({
          id: idx + 1,
          title: proj.title,
          description: proj.shortDescription,
          image_url: proj.imageUrl,
          year: '2024',
          competencies: Array.isArray(proj.skills) ? proj.skills.slice(0, 3) : [],
          tools: Array.isArray(proj.technologies) ? proj.technologies.slice(0, 6).map(t =>
            t.toLowerCase()
              .replace(/\s+/g, '')
              .replace(/\./g, 'dot')
              .replace(/\+\+/g, 'plusplus')
              .replace(/gemini.*/, 'googlegemini')
              .replace(/tailwindcss/g, 'tailwindcss')
          ) : [],
          live_link: proj.liveUrl || null,
          github_link: proj.githubUrl,
          is_featured: true,
          position: idx
        }));
        setProjects(fallbackProjects);
        console.log('📦 Using fallback projects from featured data:', fallbackProjects);
      }

      // Get Skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('position', { ascending: true });
      console.log('🛠️ Skills:', skillsData, skillsError);
      if (skillsData) setSkills(skillsData);

      // Get Certifications
      const { data: certsData, error: certsError } = await supabase
        .from('certifications')
        .select('*')
        .order('issue_date', { ascending: false });
      console.log('🏆 Certifications:', certsData, certsError);

      // Always set certifications - use fallback if needed
      if (certsData && certsData.length > 0) {
        setCertifications(certsData);
      } else {
        const fallbackCerts = [
          {
            id: 1,
            title: "JavaScript Essentials 1",
            image_url: "/assets/certifications/cisco-javascript.png",
            issuer: "Cisco Networking Academy",
            rotation: "rotate-2"
          },
          {
            id: 2,
            title: "Networking Essentials",
            image_url: "/assets/certifications/cisco-networking.png",
            issuer: "Cisco Networking Academy",
            rotation: "-rotate-3"
          },
          {
            id: 3,
            title: "Web Development Internship",
            image_url: "/assets/certifications/devspire-internship.png",
            issuer: "DevSpire Solutions",
            rotation: "rotate-1"
          },
          {
            id: 4,
            title: "WebCamp Participation",
            image_url: "/assets/certifications/webcamp.png",
            issuer: "Google Developer Student Clubs",
            rotation: "-rotate-6"
          }
        ];
        setCertifications(fallbackCerts);
        console.log('🏆 Using fallback certifications');
      }

      // Get Profile (singleton)
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .limit(1)
        .single();
      console.log('👤 Profile:', profileData, profileError);

      // Always set profile - use fallback if needed
      if (profileData) {
        setProfile(profileData);
      } else {
        const fallbackProfile = {
          id: 1,
          display_name: "Ali Saad Khan",
          headline: "Full Stack Developer | System Architect",
          about_text: "Building scalable, secure, and high-performance web applications with modern technologies.",
          avatar_url: "/assets/profile-avatar.jpg"
        };
        setProfile(fallbackProfile);
        console.log('👤 Using fallback profile');
      }

      console.log('✅ Data fetch complete');
    } catch (error) {
      console.error('❌ Error fetching data:', error);

      // Set fallback data on error
      const fallbackProjects = featuredProjects.map((proj, idx) => ({
        id: idx + 1,
        title: proj.title,
        description: proj.shortDescription,
        image_url: proj.imageUrl,
        year: '2024',
        competencies: Array.isArray(proj.skills) ? proj.skills.slice(0, 3) : [],
        tools: Array.isArray(proj.technologies) ? proj.technologies.slice(0, 6).map(t =>
          t.toLowerCase().replace(/\s+/g, '')
        ) : [],
        live_link: proj.liveUrl || null,
        github_link: proj.githubUrl,
        is_featured: true,
        position: idx
      }));
      setProjects(fallbackProjects);
    } finally {
      // Always set loading to false
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedSkill) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedSkill]);

  // Show loading screen while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen bg-[#020617] text-white antialiased overflow-x-hidden" style={{ scrollBehavior: "smooth" }}>
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
              filter: "blur(80px)",
              willChange: "transform, opacity"
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
              filter: "blur(80px)",
              willChange: "transform, opacity",
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
              filter: "blur(80px)",
              willChange: "transform, opacity",
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
              backdropFilter: scrolled ? "blur(16px)" : "blur(12px)",
              WebkitBackdropFilter: scrolled ? "blur(16px)" : "blur(12px)",
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
                initial={{ scaleY: 0, opacity: 0, originY: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={fastSpring}
                style={{ willChange: "transform, opacity" }}
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
                  <SpotlightButton
                    href="#contact"
                    className="rounded-full w-full mt-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Get in Touch
                  </SpotlightButton>
                </div>
              </motion.div>
            )}
          </motion.nav>

          {/* --- HERO SECTION (CENTERED LAYOUT) --- */}
          <section className="pt-32 pb-24 px-4 md:px-6 min-h-screen flex items-center relative z-20">
            <div className="max-w-4xl mx-auto w-full">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center text-center space-y-8 md:space-y-12"
              >
                {/* Circular Portrait with Floating Badges */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {/* Verified Expert Badge - Floating Top Right */}
                  <motion.div
                    className="absolute -top-3 -right-3 z-10 bg-[#020617] border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Verified</span>
                  </motion.div>

                  {/* Circular Portrait - REDUCED SIZE */}
                  <motion.div
                    className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-black group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <img
                      src="/assets/profile-avatar.jpg"
                      alt="Ali Saad Khan"
                      loading="eager"
                      width="256"
                      height="256"
                      className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                  </motion.div>

                  {/* Job Success Badge - Floating Bottom Left */}
                  <motion.div
                    className="absolute -bottom-3 -left-3 z-10 bg-[#020617] border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Award className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">100% Success</span>
                  </motion.div>
                </motion.div>

                {/* Text Content - CENTERED */}
                <div className="space-y-6 max-w-3xl">
                  {/* Headline - MASKED REVEAL with ROTATION */}
                  <div className="overflow-hidden" style={{ minHeight: "120px" }}>
                    <motion.h1
                      className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter"
                      initial="hidden"
                      animate="visible"
                    >
                      {/* Line 1: Solo Product Team */}
                      <div className="overflow-hidden mb-2" style={{ minHeight: "60px" }}>
                        {"Solo Product Team".split(" ").map((word, wordIndex) => (
                          <span key={wordIndex} className="inline-block overflow-hidden mr-4">
                            <motion.span
                              initial={{ y: "100%", rotate: 3, opacity: 0 }}
                              animate={{ y: 0, rotate: 0, opacity: 1 }}
                              transition={{
                                duration: 0.6,
                                delay: wordIndex * 0.1,
                                ease: [0.33, 1, 0.68, 1],
                                type: "spring",
                                stiffness: 100,
                                damping: 15
                              }}
                              style={{ display: "inline-block", willChange: "transform, opacity" }}
                            >
                              {word}
                            </motion.span>
                          </span>
                        ))}
                      </div>
                      {/* Line 2: for Your SaaS */}
                      <div className="overflow-hidden" style={{ minHeight: "60px" }}>
                        <span className="bg-gradient-to-r from-white to-[#94A3B8] bg-clip-text text-transparent">
                          {"for Your SaaS".split(" ").map((word, wordIndex) => (
                            <span key={wordIndex} className="inline-block overflow-hidden mr-4">
                              <motion.span
                                initial={{ y: "100%", rotate: 3, opacity: 0 }}
                                animate={{ y: 0, rotate: 0, opacity: 1 }}
                                transition={{
                                  duration: 0.6,
                                  delay: 0.3 + (wordIndex * 0.1),
                                  ease: [0.33, 1, 0.68, 1],
                                  type: "spring",
                                  stiffness: 100,
                                  damping: 15
                                }}
                                style={{ display: "inline-block", willChange: "transform, opacity" }}
                              >
                                {word}
                              </motion.span>
                            </span>
                          ))}
                        </span>
                      </div>
                    </motion.h1>
                  </div>

                  {/* Bio Text */}
                  <motion.p
                    className="text-lg md:text-xl text-[#94A3B8] leading-relaxed"
                    variants={itemVariants}
                  >
                    I architect, develop, and deploy secure backend systems end-to-end: from database design to
                    production-ready APIs in Python/Django and Next.js. With 4+ years of experience and AI-accelerated
                    workflows, you get a senior backend engineer, security specialist, and DevOps engineer in one.
                  </motion.p>

                  {/* CTAs */}
                  <motion.div className="flex flex-wrap justify-center gap-4" variants={itemVariants}>
                    <SwipeFillButton
                      href="https://docs.google.com/document/d/1HDHDkSANIH_wL_5iHVOJanS65mlz8GZrSR5aSWjLdws/edit?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="primary"
                    >
                      <Download size={20} /> Get My CV
                    </SwipeFillButton>
                    <SwipeFillButton
                      to="/projects"
                      variant="secondary"
                    >
                      View My Work <ArrowRight size={20} />
                    </SwipeFillButton>
                  </motion.div>

                  {/* Trusted By Badges */}
                  <motion.div
                    className="flex flex-wrap items-center justify-center gap-3 pt-4"
                    variants={itemVariants}
                  >
                    <span className="text-sm text-[#64748B] font-medium uppercase tracking-wider">Trusted by:</span>
                    {AUTHORITY_BADGES.map((badge) => (
                      <motion.span
                        key={badge.text}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg text-xs font-bold text-[#94A3B8]"
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={springTransition}
                      >
                        <badge.icon className="w-3.5 h-3.5 text-[#3B82F6]" />
                        {badge.text}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
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

                {/* Single Unified Container - The Glass Dock (macOS Effect) */}
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
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#E2E8F0]" />
                      </div>

                      {/* Icon - macOS Dock Effect */}
                      <motion.button
                        onClick={() => setSelectedSkill(tech)}
                        className="relative w-12 h-12 flex items-center justify-center p-2 rounded-xl bg-transparent hover:bg-white/10 transition-colors"
                        onHoverStart={() => setHoveredIconIndex(index)}
                        onHoverEnd={() => setHoveredIconIndex(null)}
                        animate={{
                          scale: hoveredIconIndex === index ? 1.3 :
                            Math.abs((hoveredIconIndex ?? -999) - index) === 1 ? 1.15 : 1,
                          y: hoveredIconIndex === index ? -8 :
                            Math.abs((hoveredIconIndex ?? -999) - index) === 1 ? -4 : 0
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        style={{ willChange: "transform" }}
                      >
                        <img
                          src={tech.image}
                          alt={tech.name}
                          loading="lazy"
                          width="48"
                          height="48"
                          className="w-full h-full object-contain filter grayscale-[0.3] group-hover:grayscale-0 transition-all duration-300"
                        />
                      </motion.button>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* --- PROJECTS SECTION (SCROLL PARALLAX + ENHANCED HOVER) --- */}
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
                {(projects && projects.length > 0) ? projects.map((project, index) => (
                  <motion.div
                    key={project.id || index}
                    className="group relative bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 25px 70px rgba(139, 92, 246, 0.3)"
                    }}
                    transition={springTransition}
                    style={{ willChange: "transform" }}
                  >
                    {/* Image with cinematic entrance */}
                    {project.image_url && (
                      <motion.div
                        className="aspect-video overflow-hidden"
                      >
                        <motion.img
                          src={project.image_url}
                          alt={project.title}
                          loading="lazy"
                          width="800"
                          height="450"
                          className="w-full h-full object-cover"
                          initial={{ scale: 1.1, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true, margin: "-100px" }}
                          whileHover={{ scale: 1.05 }}
                          transition={{
                            duration: 0.8,
                            ease: [0.33, 1, 0.68, 1]
                          }}
                          style={{ willChange: "transform, opacity" }}
                        />
                      </motion.div>
                    )}

                    {/* Content */}
                    <div className="p-8">
                      <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
                        {project.title}
                      </h3>
                      <p className="text-[#94A3B8] mb-4 leading-relaxed" style={{ lineHeight: 1.6 }}>
                        {project.description}
                      </p>

                      {/* Core Competencies (Text Pills) */}
                      {project.competencies && Array.isArray(project.competencies) && project.competencies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.competencies.map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1 border border-slate-700 text-slate-300 rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Tech Stack (Icons) */}
                      {project.tools && Array.isArray(project.tools) && project.tools.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-6">
                          {project.tools.map((tool: string, idx: number) => (
                            <img
                              key={idx}
                              src={`https://cdn.simpleicons.org/${tool}`}
                              alt={tool}
                              className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity"
                              title={tool}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* CTA with Arrow Slide */}
                      {(project.live_link || project.github_link) && (
                        <div className="flex gap-3">
                          {project.live_link && (
                            <a
                              href={project.live_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E293B] border border-white/10 text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all"
                            >
                              View Live
                              <ArrowRight size={18} />
                            </a>
                          )}
                          {project.github_link && (
                            <a
                              href={project.github_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E293B] border border-white/10 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-all"
                            >
                              <Github size={18} />
                              Code
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-2 text-center py-20 text-slate-500">
                    {loading ? <Loader2 className="animate-spin mx-auto" size={32} /> : 'No projects yet. Add some in the admin panel!'}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-16">
              <SpotlightButton to="/projects">
                View My All Work
              </SpotlightButton>
            </div>

          </motion.section>

          {/* --- CERTIFICATIONS SECTION (SCATTERED POLAROID LAYOUT) --- */}
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
                className="text-sm font-bold uppercase tracking-widest text-[#94A3B8] mb-16 text-center"
                variants={itemVariants}
              >
                Professional Certifications
              </motion.h2>

              {/* "Messy Stack" Layout */}
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 relative">
                {(certifications && certifications.length > 0) ? certifications.map((cert, index) => (
                  <motion.div
                    key={cert.id || index}
                    className={`relative w-[300px] md:w-[380px] aspect-[4/3] group cursor-pointer ${cert.rotation || ''}`}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.1,
                      rotate: 0,
                      zIndex: 50,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    style={{ willChange: "transform" }}
                  >
                    <div className="relative h-full rounded-xl overflow-hidden border-8 border-white bg-white shadow-xl transition-all duration-300 group-hover:shadow-2xl">
                      {/* Polaroid Image */}
                      <div className="relative w-full h-[80%] bg-slate-100 overflow-hidden">
                        <img
                          src={cert.image_url || cert.image}
                          alt={cert.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Caption */}
                      <div className="h-[20%] bg-white flex flex-col items-center justify-center px-4 py-2">
                        <h3 className="text-slate-900 font-bold text-sm md:text-base text-center leading-tight truncate w-full">
                          {cert.title}
                        </h3>
                        <p className="text-slate-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                          {cert.issuer}
                        </p>
                      </div>

                      {/* Tape Effect */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-6 bg-blue-100/30 backdrop-blur-sm -rotate-2 border-t border-white/20 shadow-sm" />
                    </div>
                  </motion.div>
                )) : (
                  <div className="w-full text-center py-20 text-slate-500 border border-dashed border-white/10 rounded-2xl">
                    <p>No certifications available yet.</p>
                  </div>
                )}
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

          {/* --- CONTACT FORM SECTION (Formspree) --- */}
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
            <div className="max-w-5xl mx-auto relative z-10">
              <motion.h2
                className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight text-center"
                variants={itemVariants}
              >
                Let's build
                <br />
                <span className="bg-gradient-to-r from-white to-[#94A3B8] bg-clip-text text-transparent">
                  something great
                </span>
              </motion.h2>

              <motion.p
                className="text-xl text-[#94A3B8] mb-12 max-w-2xl mx-auto text-center"
                variants={itemVariants}
                style={{ lineHeight: 1.6 }}
              >
                I'll get back to you automatically within 24 hours.
              </motion.p>

              {/* Contact Form - Lazy Loaded */}
              <motion.div variants={itemVariants}>
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                  </div>
                }>
                  <ContactForm />
                </Suspense>
              </motion.div>

              {/* Footer - Text-Only Clean Design */}
              <motion.footer
                className="pt-16 mt-16 border-t border-white/10"
                variants={itemVariants}
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Copyright */}
                  <p className="text-slate-400 text-sm order-2 md:order-1">
                    © 2026 Ali Saad Khan. All rights reserved.
                  </p>

                  {/* Social Links - Text Only */}
                  <div className="flex items-center gap-8 order-1 md:order-2">
                    {[
                      { href: "https://github.com/alisaadkhan", label: "GitHub" },
                      { href: "https://www.linkedin.com/in/ali-saad-khan-6a2a0b394", label: "LinkedIn" },
                      { href: "https://www.upwork.com/freelancers/~0145ade69cd488f664", label: "Upwork" },
                      { href: "https://www.fiverr.com/s/P2AlEep", label: "Fiverr" }
                    ].map(({ href, label }) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative text-slate-400 hover:text-white text-sm font-medium transition-colors group"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        aria-label={label}
                      >
                        {label}
                        <motion.span
                          className="absolute -bottom-1 left-0 right-0 h-[1px] bg-white"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          style={{ originX: 0.5 }}
                        />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.footer>
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
              style={{ willChange: "transform, opacity" }}
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
              style={{ willChange: "transform, opacity" }}
            />
          </motion.section>
        </div > {/* End Content Wrapper */}
      </div >
    </LazyMotion>
  );
}

// ContactForm Component with Formspree
function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("https://formspree.io/f/xjgwpoee", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-white/5 rounded-2xl border border-white/10"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-400 mb-4">
          <Send size={40} />
        </div>
        <h3 className="text-3xl font-bold text-white mb-2">Message Sent!</h3>
        <p className="text-[#94A3B8] text-lg">I'll get back to you within 24 hours.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Subject</label>
        <input
          type="text"
          name="subject"
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors"
          placeholder="Project inquiry"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Message</label>
        <textarea
          name="message"
          rows={6}
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors resize-none"
          placeholder="Tell me about your project..."
        ></textarea>
      </div>

      {status === "error" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-center text-sm"
        >
          Something went wrong. Please try again.
        </motion.p>
      )}

      <SwipeFillButton
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-5 text-lg"
        variant="primary"
        children={
          status === "submitting" ? (
            <>
              <Loader2 className="animate-spin" size={24} /> Sending...
            </>
          ) : (
            <>
              <Send size={24} /> Send Message
            </>
          )
        }
      />
    </form>
  );
}
