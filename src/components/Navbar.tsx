import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
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

const Navbar = ({ activeSection, onNavigate }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-background/60 backdrop-blur-xl border-b border-border/20"
    >
      {/* Left: Brand */}
      <span className="navbar-brand">Ali Saad Khan</span>

      {/* Desktop Navigation - Right */}
      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`text-sm font-semibold uppercase tracking-widest transition-colors duration-300 ${
              activeSection === item.id
                ? "text-primary"
                : "text-foreground/70 hover:text-heading"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-heading"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border/20 md:hidden"
        >
          <div className="flex flex-col gap-4 p-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left text-sm font-semibold uppercase tracking-widest transition-colors duration-300 ${
                  activeSection === item.id
                    ? "text-primary"
                    : "text-foreground/70 hover:text-heading"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
