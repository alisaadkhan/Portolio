import { motion } from "framer-motion";

interface InitialsAvatarProps {
  initials?: string;
  className?: string;
}

const InitialsAvatar = ({ initials = "AS", className = "" }: InitialsAvatarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className={`relative w-full h-full flex items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#a855f7", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#7c3aed", stopOpacity: 1 }} />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Rounded rectangle background */}
        <rect
          x="10"
          y="10"
          width="180"
          height="180"
          rx="30"
          ry="30"
          fill="url(#avatarGradient)"
          filter="url(#glow)"
          opacity="0.95"
        />

        {/* Border */}
        <rect
          x="10"
          y="10"
          width="180"
          height="180"
          rx="30"
          ry="30"
          fill="none"
          stroke="#d8b4fe"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Initials Text */}
        <text
          x="100"
          y="115"
          textAnchor="middle"
          fontSize="80"
          fontWeight="bold"
          fill="white"
          fontFamily="'Inter', sans-serif"
          letterSpacing="-2"
        >
          {initials}
        </text>

        {/* Decorative corner accents */}
        <circle cx="30" cy="30" r="2" fill="#d8b4fe" opacity="0.6" />
        <circle cx="170" cy="30" r="2" fill="#d8b4fe" opacity="0.6" />
        <circle cx="30" cy="170" r="2" fill="#d8b4fe" opacity="0.6" />
        <circle cx="170" cy="170" r="2" fill="#d8b4fe" opacity="0.6" />
      </svg>
    </motion.div>
  );
};

export default InitialsAvatar;
