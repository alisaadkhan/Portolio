import { useState } from "react";
import { motion } from "framer-motion";
import ExperienceCard from "./ExperienceCard";
import ProjectCard from "./ProjectCard";
import FeaturedProjectCard from "./FeaturedProjectCard";
import TestimonialsCarousel from "./TestimonialsCarousel";
import TechArsenal from "./TechArsenal";
import CoreCompetencies from "./CoreCompetencies";
import TechStackMarquee from "./TechStackGrid";
import { featuredProjects, regularProjects } from "@/data/projects";
import Footer from "./Footer";

const experiences = [
  {
    dateRange: "2024 — Present",
    title: "Senior Freelance Developer",
    company: "Upwork",
    description:
      "Delivering full-stack solutions for international clients. Specializing in PHP automation and secure database architecture, with an emphasis on hardened authentication and efficient data flows.",
    technologies: ["PHP", "MySQL", "Security", "REST API", "Authentication"],
  },
  {
    dateRange: "2023 — 2024",
    title: "Lead Developer",
    company: "Academic Projects",
    description:
      "Architected the Dynamic Digital Signage system and a high-fidelity CPU Scheduler. Led the QA testing suite to enforce enterprise-grade reliability, integrating performance profiling and fault injection.",
    technologies: ["C++", "PHP", "MySQL", "Linux", "System Design"],
  },
];



const ContentPanel = () => {
  const [hoveredExpIndex, setHoveredExpIndex] = useState<number | null>(null);
  const [hoveredProjIndex, setHoveredProjIndex] = useState<number | null>(null);
  const [hoveredFeaturedIndex, setHoveredFeaturedIndex] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${contactForm.name || "Visitor"}`);
    const body = encodeURIComponent(
      `Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\n${contactForm.message}`
    );
    window.location.href = `mailto:alisaad75878@gmail.dom?subject=${subject}&body=${body}`;
  };

  return (
    <main className="pt-24 lg:pt-0">
      {/* About Section */}
      <section
        id="about"
        className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
        aria-label="About me"
      >
        <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
          <h2 className="text-sm font-bold uppercase tracking-widest text-heading lg:sr-only">
            About
          </h2>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 text-foreground leading-relaxed">
            Ali Saad Khan is a Solutions Architect and Full-Stack Engineer specializing in building robust, data-driven applications. With a strong foundation in <strong>C++ memory management</strong> and <strong>PHP/MySQL architecture</strong>, Ali bridges the gap between complex backend logic and user-centric frontend experiences. His work focuses on minimizing technical debt and delivering secure, automated solutions for enterprise environments.
          </p>
          <p className="mb-4 text-foreground leading-relaxed">
            <strong>Name:</strong> Ali Saad Khan · <strong>Location:</strong> Remote Worldwide · <strong>Status:</strong> Student & Senior Freelancer
          </p>
          <p className="text-foreground leading-relaxed">
            <strong>Core Stack:</strong> C++, Python, PHP (Modern), MySQL (Relational Design), React.js, Next.js, Object-Oriented Design (OOP), RESTful APIs, Linux (Kali), Git.
          </p>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
        aria-label="Skills and technologies"
      >
        <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
          <h2 className="text-sm font-bold uppercase tracking-widest text-heading lg:sr-only">
            Skills
          </h2>
        </div>

        {/* Tech Stack Marquee */}
        <div className="mt-6">
          <TechStackMarquee />
        </div>

        {/* Tech Arsenal Grid */}
        <div className="mt-12">
          <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
            Tech Stack
          </h3>
          <TechArsenal />
        </div>

        {/* Core Competencies */}
        <div className="mt-8">
          <CoreCompetencies />
        </div>
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
        aria-label="Work experience"
      >
        <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
          <h2 className="text-sm font-bold uppercase tracking-widest text-heading lg:sr-only">
            Experience
          </h2>
        </div>
        
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={`${exp.company}-${exp.title}`}
              {...exp}
              isHovered={hoveredExpIndex === index}
              hasHoveredCard={hoveredExpIndex !== null}
              onMouseEnter={() => setHoveredExpIndex(index)}
              onMouseLeave={() => setHoveredExpIndex(null)}
            />
          ))}
        </div>
        
        {/* Résumé link removed as requested */}
      </section>

      {/* Featured Projects Section */}
      <section
        id="featured-projects"
        className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
        aria-label="Featured projects"
      >
        <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
          <h2 className="text-sm font-bold uppercase tracking-widest text-heading lg:sr-only">
            Featured Projects
          </h2>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-heading mb-2">Featured Projects</h2>
          <p className="text-foreground">Showcasing my best work with detailed insights into technologies, skills, and features.</p>
        </motion.div>
        
        <div className="grid gap-5 sm:grid-cols-2 max-w-5xl mx-auto">
          {featuredProjects.map((project, index) => (
            <FeaturedProjectCard
              key={project.id}
              {...project}
              isHovered={hoveredFeaturedIndex === index}
              hasHoveredCard={hoveredFeaturedIndex !== null}
              onMouseEnter={() => setHoveredFeaturedIndex(index)}
              onMouseLeave={() => setHoveredFeaturedIndex(null)}
            />
          ))}
        </div>
      </section>

      {/* Archive Projects Section */}
      <section
        id="archive"
        className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
        aria-label="Archive projects"
      >
        <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
          <h2 className="text-sm font-bold uppercase tracking-widest text-heading lg:sr-only">
            Archive
          </h2>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-heading mb-2">Archive</h2>
          <p className="text-sm text-muted-foreground">Additional projects and experiments.</p>
        </motion.div>
        
        <div className="grid gap-4 sm:grid-cols-2 max-w-5xl mx-auto">
          {regularProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              {...project}
              imageUrl={project.imageUrl}
              isHovered={hoveredProjIndex === index}
              hasHoveredCard={hoveredProjIndex !== null}
              onMouseEnter={() => setHoveredProjIndex(index)}
              onMouseLeave={() => setHoveredProjIndex(null)}
            />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
        aria-label="Testimonials"
      >
        <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
          <h2 className="text-sm font-bold uppercase tracking-widest text-heading lg:sr-only">
            Testimonials
          </h2>
        </div>
        
        <TestimonialsCarousel />
      </section>

      {/* Footer */}
      <section
        id="contact"
        className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
        aria-label="Contact"
      >
        <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
          <h2 className="text-sm font-bold uppercase tracking-widest text-heading lg:sr-only">
            Contact
          </h2>
        </div>

        <div className="max-w-xl space-y-4">
          <h3 className="text-2xl font-bold text-heading">Let's talk</h3>
          <p className="text-muted-foreground">
            Send me a note and I'll respond from my inbox at <span className="text-primary">alisaad75878@gmail.dom</span>.
          </p>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-heading">Name</label>
              <input
                type="text"
                name="name"
                value={contactForm.name}
                onChange={handleContactChange}
                className="rounded-md border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-heading">Email</label>
              <input
                type="email"
                name="email"
                value={contactForm.email}
                onChange={handleContactChange}
                className="rounded-md border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-heading">Message</label>
              <textarea
                name="message"
                value={contactForm.message}
                onChange={handleContactChange}
                className="rounded-md border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                placeholder="How can I help?"
                required
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 transition"
            >
              Send to inbox
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ContentPanel;
