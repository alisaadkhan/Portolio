import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Sparkles } from "lucide-react";
import SocialLinks from "./SocialLinks";
import InitialsAvatar from "./InitialsAvatar";

interface IdentityPanelProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const IdentityPanel = ({ activeSection, onNavigate }: IdentityPanelProps) => {
  const [imgError, setImgError] = useState(false);
  const profileImage = "/profile.jpg"; // place your uploaded photo here (public/profile.jpg)
  const fallbackImage =
    "https://images.unsplash.com/photo-1527443224154-dc2c8a52b8ea?auto=format&fit=crop&w=1200&q=80";

  return (
    <header className="hero-bento">
      <div className="hero-left">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-4xl font-bold tracking-tight text-heading sm:text-5xl mb-2"
        >
          <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
          Ali Saad Khan
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-lg font-medium tracking-tight text-primary sm:text-xl"
        >
          Full-Stack Solutions Architect
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 max-w-2xl leading-relaxed text-foreground text-base"
        >
          I don't just write code; I engineer solutions. I specialize in architecting secure, scalable systems that bridge complex backend logic with intuitive user experiences. With a foundation in Kali Linux and Low-Level Optimization, I build software where security and performance are priorities, not afterthoughts.
        </motion.p>

        {/* Contact Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-4 space-y-3"
        >
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:alisaad75878@gmail.com"
              className="text-foreground hover:text-primary transition-colors"
            >
              alisaad75878@gmail.com
            </a>
            <span className="hidden sm:inline-block text-muted-foreground">•</span>
            <a
              href="https://docs.google.com/document/d/1HDHDkSANIH_wL_5iHVOJanS65mlz8GZrSR5aSWjLdws/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-foreground transition hover:border-primary hover:text-primary"
            >
              Résumé
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary flex-shrink-0" />
            <a href="https://wa.me/923195652287" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
              +92 319 5652287
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="mt-5 flex flex-wrap items-center gap-3"
        >
          <SocialLinks />
        </motion.div>
      </div>

      <div className="hero-right">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="identity-card"
        >
          <div className="profile-image-container">
            {!imgError ? (
              <img
                src={profileImage}
                alt="Ali Saad Khan"
                className="profile-image"
                onError={() => setImgError(true)}
              />
            ) : (
              <img
                src={fallbackImage}
                alt="Ali Saad Khan"
                className="profile-image"
              />
            )}
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default IdentityPanel;
