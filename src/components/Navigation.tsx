import { motion } from "framer-motion";

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "featured-projects", label: "Projects" },
  { id: "testimonials", label: "Testimonials" },
];

const Navigation = ({ activeSection, onNavigate }: NavigationProps) => {
  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-3">
      {navItems.map((item, index) => (
        <motion.button
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          onClick={() => onNavigate(item.id)}
          className={`group flex items-center gap-4 text-base font-semibold uppercase tracking-widest transition-all duration-300 ${
            activeSection === item.id
              ? "text-heading"
              : "text-foreground hover:text-heading"
          }`}
        >
          <span
            className={`h-px transition-all duration-300 ${
              activeSection === item.id
                ? "w-16 bg-primary"
                : "w-8 bg-foreground group-hover:w-16 group-hover:bg-primary"
            }`}
          />
          {item.label}
        </motion.button>
      ))}
    </nav>
  );
};

export default Navigation;
