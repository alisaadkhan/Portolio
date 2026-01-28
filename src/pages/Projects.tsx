import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
    ArrowLeft, ExternalLink, Github, ShieldCheck, Server, Lock, Award, ArrowUpRight
} from "lucide-react";
import { supabase } from "../lib/supabase";
import {
    PhpIcon, MySqlIcon, RedisIcon, CppIcon, QtIcon,
    PythonIcon, FastApiIcon, DockerIcon, DjangoIcon,
    PostgreSqlIcon, RabbitMqIcon
} from "../components/TechIcons";

// --- DATA: TECHNICAL ARCHIVE ---

const PROJECT_ARCHIVE = [
    {
        title: "Digital Signage System",
        description: "Centralized CMS for real-time display updates with sub-200ms latency.",
        skills: ["WebSockets", "Real-time Sync", "Role-Based Access", "Distributed Systems"],
        stack: [
            { name: "PHP 8", icon: PhpIcon, color: "#777BB4" },
            { name: "MySQL", icon: MySqlIcon, color: "#4479A1" },
            { name: "Redis", icon: RedisIcon, color: "#DC382D" }
        ],
        links: { live: "#", repo: "#" },
        year: "2024",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&q=80"
    },
    {
        title: "CPU Scheduling Simulator",
        description: "Algorithmic engine for OS process management handling 10k+ concurrent queues.",
        skills: ["OS Architecture", "Memory Management", "Algorithm Optimization", "C++ STL"],
        stack: [
            { name: "C++", icon: CppIcon, color: "#00599C" },
            { name: "Qt", icon: QtIcon, color: "#41CD52" }
        ],
        links: { live: "#", repo: "#" },
        year: "2024",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop&q=80"
    },
    {
        title: "Secure Authentication API",
        description: "Enterprise-grade auth system with JWT rotation and rate limiting.",
        skills: ["OAuth 2.0", "Cryptography", "API Security", "Defense-in-Depth"],
        stack: [
            { name: "Python", icon: PythonIcon, color: "#3776AB" },
            { name: "FastAPI", icon: FastApiIcon, color: "#009688" },
            { name: "Docker", icon: DockerIcon, color: "#2496ED" }
        ],
        links: { live: "#", repo: "#" },
        year: "2023",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop&q=80"
    },
    {
        title: "E-commerce Microservices",
        description: "Multi-vendor marketplace powerd by event-driven architecture.",
        skills: ["Microservices", "System Design", "Event Bus", "Database Sharding"],
        stack: [
            { name: "Django", icon: DjangoIcon, color: "#092E20" },
            { name: "PostgreSQL", icon: PostgreSqlIcon, color: "#4169E1" },
            { name: "RabbitMQ", icon: RabbitMqIcon, color: "#FF6600" }
        ],
        links: { live: "#", repo: "#" },
        year: "2023",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&q=80"
    }
];

const CERTIFICATIONS = [
    {
        title: "System Architecture",
        issuer: "Professional Milestone",
        date: "2023",
        status: "Verified",
        icon: ShieldCheck,
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&q=80"
    },
    {
        title: "Meta Backend Developer",
        issuer: "Meta / Coursera",
        date: "2023",
        status: "Verified",
        icon: Server,
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop&q=80"
    },
    {
        title: "Cybersecurity Analyst",
        issuer: "Google",
        date: "2022",
        status: "Verified",
        icon: Lock,
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop&q=80"
    }
];

// --- COMPONENTS ---

// 1. Phantom Pill Button
const PhantomButton = ({ children, href, icon: Icon }: { children: React.ReactNode, href: string, icon: any }) => (
    <motion.a
        href={href}
        className="group flex items-center gap-2 px-4 py-2 bg-transparent border border-white/10 rounded-full text-sm font-semibold text-white transition-all overflow-hidden relative"
        whileHover={{ scale: 1.05 }}
        style={{ willChange: "transform" }}
    >
        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
        <span className="relative z-10 flex items-center gap-2 group-hover:text-black transition-colors duration-300">
            <Icon size={14} /> {children}
        </span>
    </motion.a>
);

// 2. Skill Pill (Text Only)
const SkillPill = ({ text }: { text: string }) => (
    <span className="px-3 py-1 border border-slate-700/50 rounded-md text-[11px] font-medium text-slate-400 uppercase tracking-wider">
        {text}
    </span>
);

// Helper to map string tools to icons
const TECH_MAP: any = {
    "PHP": { icon: PhpIcon, color: "#777BB4" },
    "PHP 8": { icon: PhpIcon, color: "#777BB4" },
    "MySQL": { icon: MySqlIcon, color: "#4479A1" },
    "Redis": { icon: RedisIcon, color: "#DC382D" },
    "C++": { icon: CppIcon, color: "#00599C" },
    "Qt": { icon: QtIcon, color: "#41CD52" },
    "Python": { icon: PythonIcon, color: "#3776AB" },
    "FastAPI": { icon: FastApiIcon, color: "#009688" },
    "Docker": { icon: DockerIcon, color: "#2496ED" },
    "Django": { icon: DjangoIcon, color: "#092E20" },
    "PostgreSQL": { icon: PostgreSqlIcon, color: "#4169E1" },
    "RabbitMQ": { icon: RabbitMqIcon, color: "#FF6600" }
};

export default function Projects() {
    // Scroll Detection for Header
    const [scrolled, setScrolled] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);

        fetchProjects();
        
        // Refetch on window focus
        const handleFocus = () => fetchProjects();
        window.addEventListener("focus", handleFocus);
        
        // Real-time subscription
        const projectsChannel = supabase
            .channel('projects-page-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => fetchProjects())
            .subscribe();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("focus", handleFocus);
            supabase.removeChannel(projectsChannel);
        };
    }, []);

    const fetchProjects = async () => {
        // Disable cache - force fresh data from Supabase
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching projects:", error);
            // Fallback to archive if fetch fails
            setProjects(PROJECT_ARCHIVE);
        } else if (data) {
            // Transform DB data to UI format
            const mappedProjects = data.map((p: any) => {
                const toolsList = Array.isArray(p.tools) ? p.tools : (typeof p.tools === 'string' ? p.tools.split(',') : []);
                const cleanTools = toolsList.map((t: string) => t.trim());

                return {
                    title: p.title,
                    description: p.description,
                    skills: cleanTools,
                    stack: cleanTools.map((t: string) => {
                        const map = TECH_MAP[t] || TECH_MAP[Object.keys(TECH_MAP).find(k => k.includes(t)) || ""] || { name: t, icon: Server, color: "#aaa" };
                        return { name: t, icon: map.icon, color: map.color };
                    }),
                    links: { live: p.live_link, repo: p.github_link },
                    year: p.year,
                    image: p.image_url
                };
            });

            // If DB is empty, use archive, otherwise use DB
            if (mappedProjects.length > 0) {
                setProjects(mappedProjects);
            } else {
                setProjects(PROJECT_ARCHIVE);
            }
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 20 }
        }
    };

    const textReveal = {
        hidden: { y: "100%" },
        visible: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-[#3B82F6] selection:text-white">
            {/* --- HEADER --- */}
            <motion.header
                className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
                    ? "bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-4"
                    : "bg-transparent py-6"
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <span className="font-semibold text-sm tracking-wide">Back to Base</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-white/20 hidden sm:block" />
                        <div className="font-mono text-xs font-bold tracking-widest text-slate-500">
                            ARCHIVE <span className="text-[#3B82F6]">///</span> 2024
                        </div>
                    </div>
                </div>
            </motion.header>

            <main className="pt-40 pb-24 px-6 max-w-7xl mx-auto">

                {/* --- PAGE TITLE (MASKED REVEAL) --- */}
                <div className="mb-32">
                    <div className="overflow-hidden">
                        <motion.h1
                            className="text-7xl md:text-9xl font-black tracking-tighter text-white leading-[0.9]"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                        >
                            <div className="overflow-hidden">
                                <motion.span className="block" variants={textReveal}>SELECTED</motion.span>
                            </div>
                            <div className="overflow-hidden">
                                <motion.span
                                    className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600"
                                    variants={textReveal}
                                >
                                    WORKS.
                                </motion.span>
                            </div>
                        </motion.h1>
                    </div>

                    <motion.div
                        className="mt-8 max-w-xl overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <p className="text-xl text-slate-400 leading-relaxed font-light">
                            A curated collection of architectural systems, security protocols, and high-performance engines built for scale.
                        </p>
                    </motion.div>
                </div>

                {/* --- PROJECTS STACK --- */}
                <motion.div
                    className="space-y-32"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            viewport={{ once: true, margin: "-100px" }}
                            className="group"
                        >
                            {/* Layout: Grid 12 cols. Image 5, Content 7 */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                                {/* 1. Image Column (Left) */}
                                <div className="lg:col-span-5 relative order-2 lg:order-1">
                                    <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-slate-900 group-hover:border-white/20 transition-colors duration-500">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full aspect-[4/3] object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 will-change-transform group-hover:scale-105"
                                        />
                                        {/* Overlay vignette */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-50" />
                                    </div>
                                </div>

                                {/* 2. Content Column (Right) */}
                                <div className="lg:col-span-7 space-y-8 order-1 lg:order-2 lg:pl-10">

                                    {/* Header */}
                                    <div>
                                        <h2 className="text-4xl font-bold mb-3 tracking-tight group-hover:text-white text-slate-100 transition-colors">
                                            {project.title}
                                        </h2>
                                        <p className="text-lg text-slate-400 leading-relaxed font-light border-l-2 border-slate-800 pl-4 py-1">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* The Brain (Skills) */}
                                    <div className="space-y-3">
                                        <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">Core Competencies</div>
                                        <div className="flex flex-wrap gap-2">
                                            {project.skills.map(skill => <SkillPill key={skill} text={skill} />)}
                                        </div>
                                    </div>

                                    {/* The Tools (Icons) */}
                                    <div className="space-y-3">
                                        <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">Tech Stack</div>
                                        <div className="flex flex-wrap gap-3">
                                            {project.stack.map(tech => (
                                                <div key={tech.name} className="relative group/icon" title={tech.name}>
                                                    <div className="w-10 h-10 p-2 rounded-xl bg-slate-800/50 border border-white/5 group-hover/icon:border-white/20 transition-colors">
                                                        <tech.icon className="w-full h-full" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-4 pt-4 border-t border-white/5">
                                        <PhantomButton href={project.links.live} icon={ExternalLink}>View Live</PhantomButton>
                                        <PhantomButton href={project.links.repo} icon={Github}>Source Code</PhantomButton>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* --- CERTIFICATIONS MODULE --- */}
                <motion.div
                    className="mt-48 pt-24 border-t border-white/5"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center gap-4 mb-16">
                        <Award className="w-8 h-8 text-slate-400" />
                        <h2 className="text-3xl font-bold tracking-tight">Verified Credentials</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {CERTIFICATIONS.map((cert, idx) => (
                            <motion.div
                                key={idx}
                                className="relative group bg-[#0F172A] border border-white/5 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300"
                                whileHover={{ y: -5 }}
                                style={{ willChange: "transform" }}
                            >
                                {/* Image Area */}
                                <div className="h-48 bg-slate-800 relative overflow-hidden">
                                    <img
                                        src={cert.image}
                                        alt={cert.title}
                                        className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-500"
                                    />
                                    {/* Verified Badge Overlay */}
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                                        <ShieldCheck className="w-3 h-3 text-[#3B82F6]" />
                                        <span className="text-[10px] font-bold tracking-wider uppercase">Verified</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-1 text-white group-hover:text-[#3B82F6] transition-colors">
                                        {cert.title}
                                    </h3>
                                    <div className="flex justify-between items-center text-sm text-slate-500">
                                        <span>{cert.issuer}</span>
                                        <span>{cert.date}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer Minimal */}
                <div className="mt-32 py-12 text-center text-slate-600 text-sm border-t border-white/5">
                    <p>ENGINEERED FOR SCALE</p>
                </div>

            </main>
        </div >
    );
}
