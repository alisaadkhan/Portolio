import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  isHovered: boolean;
  hasHoveredCard: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ProjectCard = ({
  id,
  title,
  description,
  technologies,
  liveUrl,
  githubUrl,
  imageUrl = `https://placehold.co/600x400/0a0a0a/666666?text=${encodeURIComponent(title.replace(/\s+/g, '+'))}`,
  isHovered,
  hasHoveredCard,
  onMouseEnter,
  onMouseLeave,
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const opacity = hasHoveredCard ? (isHovered ? 1 : 0.5) : 1;

  const handleClick = () => {
    if (id) {
      navigate(`/project/${id}`);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/50 ${id ? 'cursor-pointer' : ''}`}
      style={{ opacity }}
      onClick={handleClick}
    >
      {/* Project Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageUrl}
          alt={`${title} preview`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-heading group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          
          <div className="flex items-center gap-3">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground transition-colors hover:text-primary"
                aria-label={`View ${title} on GitHub`}
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
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
        
        <p className="mt-3 text-sm leading-relaxed text-foreground">
          {description}
        </p>
        
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies used">
          {technologies.map((tech) => (
            <li key={tech} className="tech-pill">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
