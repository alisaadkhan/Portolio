import { motion } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

interface SwipeFillButtonProps {
  children: React.ReactNode;
  href?: string;
  to?: string;
  className?: string;
  variant?: "primary" | "secondary";
  target?: string;
  rel?: string;
  onClick?: () => void;
}

/**
 * Premium "Swipe Fill" Button with Masked Slide Animation
 * 
 * Features:
 * - Smooth color fill transition from left/bottom
 * - Text color switches dynamically as fill progresses
 * - Spring-based physics for snappy feel
 * - Magnetic hover effect
 */
export default function SwipeFillButton({
  children,
  href,
  to,
  className = "",
  variant = "primary",
  target,
  rel,
  onClick
}: SwipeFillButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const baseClasses = "relative flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-xl overflow-hidden group transition-all duration-300";
  
  const variantClasses = variant === "primary" 
    ? "bg-[#0F766E] text-white shadow-2xl shadow-teal-500/20 border-2 border-teal-500/30"
    : "bg-transparent border-2 border-teal-500/40 text-teal-100";

  const content = (
    <>
      {/* Slide Fill Background */}
      <motion.div
        className={`absolute inset-0 z-0 ${
          variant === "primary" 
            ? "bg-teal-400" 
            : "bg-teal-500"
        }`}
        initial={{ x: "-100%" }}
        whileHover={{ x: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          duration: 0.6
        }}
      />

      {/* Text Content with Color Switch */}
      <span className={`relative z-10 flex items-center gap-2 transition-colors duration-300 ${
        variant === "primary"
          ? "group-hover:text-[#020617]"
          : "group-hover:text-white"
      }`}>
        {children}
      </span>
    </>
  );

  // External link (href)
  if (href) {
    return (
      <motion.a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        className={`${baseClasses} ${variantClasses} ${className}`}
        whileHover={{ 
          scale: 1.02,
          boxShadow: variant === "primary" 
            ? "0 0 0 2px rgba(45, 212, 191, 0.6)" 
            : "0 0 0 2px rgba(20, 184, 166, 0.8)"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{ willChange: "transform" }}
      >
        {content}
      </motion.a>
    );
  }

  // Internal route (to)
  if (to) {
    return (
      <Link to={to}>
        <motion.div
          className={`${baseClasses} ${variantClasses} ${className}`}
          whileHover={{ 
            scale: 1.02,
            boxShadow: variant === "primary" 
              ? "0 0 0 2px rgba(255, 255, 255, 0.5)" 
              : "0 0 0 2px rgba(255, 255, 255, 0.8)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{ willChange: "transform" }}
        >
          {content}
        </motion.div>
      </Link>
    );
  }

  // Button element
  return (
    <motion.button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
      whileHover={{ 
        scale: 1.02,
        boxShadow: variant === "primary" 
          ? "0 0 0 2px rgba(255, 255, 255, 0.5)" 
          : "0 0 0 2px rgba(255, 255, 255, 0.8)"
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ willChange: "transform" }}
    >
      {content}
    </motion.button>
  );
}
