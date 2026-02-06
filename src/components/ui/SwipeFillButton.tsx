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
 * Digital Swipe Button - Cyber-Minimalist Design
 * 
 * Features:
 * - Transparent base with neon border (Violet/Cyan)
 * - Diagonal swipe fill animation on hover
 * - Dynamic text color switch (White → Black)
 * - Glow shadow effect
 * - Monospace font with letter-spacing
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
  // Variant-specific styles
  const variantClasses = variant === "primary" 
    ? "border-[#8b5cf6] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]" 
    : "border-[#06b6d4] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]";
  
  const fillColor = variant === "primary" 
    ? "bg-[#8b5cf6]" 
    : "bg-[#06b6d4]";

  const baseClasses = `
    group relative overflow-hidden
    rounded-lg border backdrop-blur-sm
    bg-transparent px-8 py-3
    text-white font-sans font-semibold
    tracking-wider
    transition-all duration-300 ease-in-out
    flex items-center justify-center gap-2
    hover:text-black
    ${variantClasses}
  `.trim().replace(/\s+/g, ' ');

  const content = (
    <>
      {/* Diagonal swipe fill effect */}
      <span 
        className={`
          absolute inset-0 ${fillColor}
          transform -translate-x-full 
          transition-transform duration-300 ease-in-out
          group-hover:translate-x-0
          skew-x-[-12deg] scale-x-150
          origin-left
        `.trim().replace(/\s+/g, ' ')}
        style={{ zIndex: 0 }}
      ></span>
      
      {/* Button content */}
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
