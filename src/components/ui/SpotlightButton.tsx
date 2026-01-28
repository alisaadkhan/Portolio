import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface SpotlightButtonProps {
    children: React.ReactNode;
    href?: string;
    to?: string;
    onClick?: () => void;
    className?: string;
    width?: string;
}

export default function SpotlightButton({ children, href, to, onClick, className = "", width = "fit-content" }: SpotlightButtonProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    const Content = (
        // Wrapper for the Border Beam
        <div className={`relative group/btn rounded-full p-[1px] overflow-hidden ${width} ${className}`}>

            {/* 1. The Border Beam (Rotating Gradient) */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-full">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-200%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F000_0%,#3B82F6_50%,#E2E8F000_100%)]" // Blue Beam
                />
            </div>

            {/* 2. Content Container (The Button Body) */}
            <div
                ref={divRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative z-10 h-full rounded-full bg-slate-950/90 backdrop-blur-xl border border-white/10 group-hover/btn:border-white/20 transition-colors overflow-hidden"
            >
                {/* 3. The Spotlight Effect (Internal Glow) */}
                <div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                    style={{
                        opacity,
                        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`, // Matching Blue Glow
                    }}
                />

                {/* 4. Text Content */}
                <div className="relative z-20 px-8 py-3 flex items-center justify-center gap-2 font-bold tracking-wide text-white group-hover/btn:text-[#3B82F6] transition-colors">
                    {children}
                </div>
            </div>
        </div>
    );

    if (to) {
        return <Link to={to} className="inline-block selection:bg-none cursor-pointer">{Content}</Link>;
    }

    if (href) {
        return <a href={href} className="inline-block selection:bg-none cursor-pointer" onClick={onClick}>{Content}</a>;
    }

    return <button onClick={onClick} className="inline-block selection:bg-none cursor-pointer">{Content}</button>;
}
