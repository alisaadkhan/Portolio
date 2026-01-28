import { motion } from "framer-motion";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeaturedProjectCardProps {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  skills: string[];
  githubUrl: string;
  liveUrl?: string;
  imageUrl: string;
  isHovered: boolean;
  hasHoveredCard: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const FeaturedProjectCard = ({
  id,
  title,
  description,
  shortDescription,
  technologies,
  skills,
  githubUrl,
  liveUrl,
  imageUrl,
  isHovered,
  hasHoveredCard,
  onMouseEnter,
  onMouseLeave,
}: FeaturedProjectCardProps) => {
  const navigate = useNavigate();
  const opacity = hasHoveredCard ? (isHovered ? 1 : 0.5) : 1;

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on link or external elements
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a')) {
      return;
    }
    navigate(`/project/${id}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group relative overflow-hidden rounded-lg border border-primary/25 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:shadow-primary/15 cursor-pointer"
      style={{ opacity }}
      onClick={handleClick}
    >
      {/* Featured Badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1.5 bg-primary/15 backdrop-blur-sm border border-primary/35 rounded-full">
        <Sparkles className="h-3 w-3 text-primary" />
        <span className="text-[11px] font-semibold text-primary">Featured</span>
      </div>

      {/* Project Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageUrl}
          alt={`${title} preview`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent opacity-80" />
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2.5">
          <h3 className="text-lg font-bold text-heading group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          
          <div className="flex items-center gap-2.5">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground transition-colors hover:text-primary"
                aria-label={`View ${title} on GitHub`}
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground transition-colors hover:text-primary"
                aria-label={`View ${title} live`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
        
        <p className="text-sm leading-relaxed text-foreground mb-3">
          {shortDescription}
        </p>
        
        <div className="mb-3.5">
          <p className="text-[11px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Tech Stack</p>
          <ul className="flex flex-wrap gap-1.5" aria-label="Technologies used">
            {technologies.slice(0, 6).map((tech) => (
              <li key={tech} className="tech-pill">
                {tech}
              </li>
            ))}
            {technologies.length > 6 && (
              <li className="tech-pill opacity-60">
                +{technologies.length - 6} more
              </li>
            )}
          </ul>
        </div>

        <div className="pt-3 border-t border-border">
          <p className="text-[11px] text-muted-foreground mb-1.5">Click to view full details →</p>
        </div>
      </div>
    </motion.article>
  );
};

export default FeaturedProjectCard;
