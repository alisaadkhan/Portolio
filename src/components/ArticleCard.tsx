import { motion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";

interface ArticleCardProps {
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  url: string;
  isHovered: boolean;
  hasHoveredCard: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ArticleCard = ({
  title,
  description,
  date,
  readTime,
  tags,
  url,
  isHovered,
  hasHoveredCard,
  onMouseEnter,
  onMouseLeave,
}: ArticleCardProps) => {
  const opacity = hasHoveredCard ? (isHovered ? 1 : 0.5) : 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group relative"
      style={{ opacity }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 group"
      >
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            {date}
          </span>
          <span>·</span>
          <span>{readTime}</span>
        </div>

        <h3 className="mt-3 font-medium text-heading group-hover:text-primary transition-colors duration-200 flex items-center gap-2">
          {title}
          <ArrowUpRight className="h-4 w-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-foreground line-clamp-2">
          {description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Article tags">
          {tags.map((tag) => (
            <li key={tag} className="tech-pill">
              {tag}
            </li>
          ))}
        </ul>
      </a>
    </motion.article>
  );
};

export default ArticleCard;
