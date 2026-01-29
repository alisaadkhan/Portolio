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
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
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
  onClick,
  type = "button",
  disabled = false
}: SwipeFillButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const baseClasses = "group relative overflow-hidden rounded-full border border-white bg-transparent px-8 py-3 text-white transition-all duration-300 hover:text-black font-bold flex items-center justify-center gap-2";

  const content = (
    <>
      <span className="absolute inset-0 -z-10 w-0 bg-white transition-all duration-300 ease-out group-hover:w-full"></span>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={`${baseClasses} ${className}`}
      >
        {content}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={`${baseClasses} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {content}
    </button>
  );
}
