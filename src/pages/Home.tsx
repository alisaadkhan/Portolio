import {
    ArrowUpRight, Github, Linkedin, Mail, ArrowRight, Download,
    Terminal, Cpu, Database, Globe, Layers, Shield,
    Menu, X, Send, Briefcase, Loader2, CheckCircle2
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

// --- COMPONENTS ---
const Typewriter = ({ text, delay }: { text: string, delay: number }) => {
    const [displayText, setDisplayText] = useState("");
    useEffect(() => {
        let i = 0;
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setDisplayText(text.slice(0, i + 1));
                i++;
                if (i === text.length) clearInterval(interval);
            }, 40);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timer);
    }, [text, delay]);
    return <span>{displayText}<span className="animate-pulse text-purple-500">_</span></span>;
};

// Custom Icon for Upwork/Fiverr (Using Text as fallback or simple shapes if needed, but text is cleaner)
const SocialPill = ({ href, label, icon }: any) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full text-slate-400 text-sm hover:text-white hover:bg-white/10 hover:border-purple-500/50 transition-all"
    >
        {icon} <span>{label}</span>
    </a>
);

export default function Home() {
    const [profile, setProfile] = useState<any>(null);
    const [certs, setCerts] = useState<any[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);

        // Fetch Data
        fetchData();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    async function fetchData() {
        // Get Profile
        const { data: profileData } = await supabase.from('profile').select('*').single();
        if (profileData) setProfile(profileData);

        // Get Certs
        const { data: certsData } = await supabase.from('certifications').select('*').order('created_at', { ascending: false });
        if (certsData) setCerts(certsData);
    }

    const STACK = [
        { name: "Python", icon: <Terminal size={18} /> },
        { name: "Next.js", icon: <Globe size={18} /> },
        { name: "Django", icon: <Database size={18} /> },
        { name: "C++", icon: <Cpu size={18} /> },
        { name: "Docker", icon: <Layers size={18} /> },
        { name: "Security", icon: <Shield size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-black text-slate-300 font-sans selection:bg-purple-500/30 overflow-x-hidden">

            {/* --- NAV --- */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/70 backdrop-blur-xl border-b border-white/5' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                    <a href="#" className="text-xl font-bold text-white tracking-tighter">
                        {profile?.display_name?.split(" ")[0] || "Ali"}<span className="text-purple-500">.</span>
                    </a>

                    <div className="hidden md:flex gap-8">
                        {["Stack", "Work", "Certifications", "Contact"].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{item}</a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/#contact" className="hidden md:flex bg-white text-black text-sm font-bold px-5 py-2.5 rounded-full hover:bg-slate-200 transition-colors">
                            Initialize Project
                        </Link>
                        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 pt-32 md:pt-40 pb-20">

                {/* 1. HERO REDESIGN */}
                <section className="mb-32 grid md:grid-cols-2 gap-12 items-center">
                    {/* LEFT SIDE */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">Available for work</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[0.95]">
                            {profile?.display_name || "Solo product team"}
                        </h1>

                        <div className="h-16 md:h-auto mb-8">
                            <p className="text-xl md:text-2xl text-purple-400 font-medium">
                                <Typewriter text={profile?.headline || "Full Stack Solutions Architect"} delay={500} />
                            </p>
                        </div>

                        <p className="text-lg text-slate-400 max-w-xl mb-10 leading-relaxed">
                            {profile?.about_text || "Building secure backends and resilient systems. From low-level resource management to high-level web infrastructure."}
                        </p>

                        <div className="flex flex-wrap gap-4 mb-12">
                            <SocialPill href="https://github.com/alisaadkhan" label="GitHub" icon={<Github size={16} />} />
                            <SocialPill href="https://www.linkedin.com/in/ali-saad-khan-6a2a0b394" label="LinkedIn" icon={<Linkedin size={16} />} />
                            <SocialPill href="https://www.upwork.com/freelancers/~0145ade69cd488f664?mp_source=share" label="Upwork" icon={<Briefcase size={16} />} />
                            <SocialPill href="https://www.fiverr.com/s/P2AlEep" label="Fiverr" icon={<Globe size={16} />} />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <a href="#contact" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2">
                                Initialize Project <ArrowRight size={18} />
                            </a>
                            <Link to="/projects" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
                                View Case Studies
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="relative flex justify-center md:justify-end">
                        {/* Circle Container */}
                        <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-2 border-white/10 p-2">
                            <div className="w-full h-full rounded-full overflow-hidden bg-white/5 relative">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-600 bg-black">
                                        <span className="text-6xl">Ali</span>
                                    </div>
                                )}
                            </div>

                            {/* Verified Badge */}
                            <div className="absolute -top-4 -right-4 bg-black border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                <div className="bg-purple-500 rounded-full p-1 text-white">
                                    <CheckCircle2 size={12} />
                                </div>
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Verified Expert</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. STACK MARQUEE */}
                <section id="stack" className="mb-40 overflow-hidden">
                    <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Tech Arsenal</h2>
                        <div className="h-px bg-white/10 flex-grow"></div>
                    </div>
                    <div className="relative flex overflow-x-hidden group mask-gradient">
                        <div className="animate-marquee flex gap-4 whitespace-nowrap py-4">
                            {[...STACK, ...STACK, ...STACK].map((tech, i) => (
                                <div key={i} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/5 rounded-full text-slate-300">
                                    {tech.icon} <span className="font-semibold text-sm">{tech.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. CERTIFICATIONS (New Section) */}
                {certs.length > 0 && (
                    <section id="certifications" className="mb-40">
                        <div className="flex items-center gap-4 mb-10">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Certifications</h2>
                            <div className="h-px bg-white/10 flex-grow"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {certs.map((cert) => (
                                <div key={cert.id} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                                    <img src={cert.image_url} alt="Certification" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 4. CONTACT (Formspree) */}
                <section id="contact" className="mb-20">
                    <div className="bg-white/5 border border-white/5 p-8 md:p-12 rounded-[2.5rem]">
                        <h2 className="text-3xl font-bold text-white mb-2">Let's build something.</h2>
                        <p className="text-slate-400 mb-8">I'll get back to you automatically.</p>

                        <ContactForm />
                    </div>
                </section>

                <footer className="pt-8 border-t border-white/5 text-center text-slate-600 text-sm flex flex-col gap-2">
                    <p>© 2026 Ali Saad Khan.</p>
                    <div className="flex justify-center gap-6 text-xs">
                        <a href="https://github.com/alisaadkhan" className="hover:text-purple-400 transition-colors">GitHub</a>
                        <a href="https://www.linkedin.com/in/ali-saad-khan-6a2a0b394" className="hover:text-purple-400 transition-colors">LinkedIn</a>
                        <a href="https://www.upwork.com/freelancers/~0145ade69cd488f664?mp_source=share" className="hover:text-purple-400 transition-colors">Upwork</a>
                        <a href="https://www.fiverr.com/s/P2AlEep" className="hover:text-purple-400 transition-colors">Fiverr</a>
                    </div>
                </footer>

            </div>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .mask-gradient {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
        </div>
    );
}

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
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4">
                    <Send size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-slate-400">I'll get back to you as soon as possible.</p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-purple-400 hover:text-purple-300 font-medium"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Name" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none transition-colors" />
                <input type="email" name="email" placeholder="Email" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none transition-colors" />
            </div>
            <input type="text" name="subject" placeholder="Subject" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none transition-colors" />
            <textarea name="message" rows={4} placeholder="How can I help you?" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"></textarea>

            <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {status === "submitting" ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Message</>}
            </button>
            {status === "error" && (
                <p className="text-red-400 text-center text-sm">Something went wrong. Please try again.</p>
            )}
        </form>
    );
}
