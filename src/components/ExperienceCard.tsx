import { motion } from "framer-motion";

interface ExperienceCardProps {
  dateRange: string;
  title: string;
  company: string;
  description: string;
  technologies: string[];
  isHovered: boolean;
  hasHoveredCard: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ExperienceCard = ({
  dateRange,
  title,
  company,
  description,
  technologies,
  isHovered,
  hasHoveredCard,
  onMouseEnter,
  onMouseLeave,
}: ExperienceCardProps) => {
  const opacity = hasHoveredCard ? (isHovered ? 1 : 0.5) : 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group relative grid gap-4 pb-1 transition-all duration-300 sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100"
      style={{ opacity }}
    >
      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-lg transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-secondary/50" />
      
      <header className="z-10 mb-2 mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:col-span-2">
        {dateRange}
      </header>
      
      <div className="z-10 sm:col-span-6">
        <h3 className="font-medium leading-snug text-heading">
          <span className="inline-flex items-baseline text-base font-medium leading-tight group-hover:text-primary transition-colors duration-200">
            {title}
            <span className="mx-2 text-muted-foreground">·</span>
            <span className="text-foreground">{company}</span>
          </span>
        </h3>
        
        <p className="mt-2 text-sm leading-normal text-foreground">
          {description}
        </p>
        
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Technologies used">
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

export default ExperienceCard;
