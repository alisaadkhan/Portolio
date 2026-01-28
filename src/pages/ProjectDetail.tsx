import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Github, ExternalLink, Sparkles } from "lucide-react";
import { featuredProjects } from "@/data/projects";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = featuredProjects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-heading mb-4">Project Not Found</h1>
          <button
            onClick={() => navigate("/")}
            className="text-primary hover:underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-12 lg:px-24">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Portfolio</span>
        </motion.button>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Featured Project</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-heading mb-4">
            {project.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Github className="h-4 w-4" />
                <span>View on GitHub</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </motion.div>

        {/* Project Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 rounded-lg overflow-hidden border border-border"
        >
          <img
            src={project.imageUrl}
            alt={`${project.title} preview`}
            className="w-full h-auto object-cover"
          />
        </motion.div>

        {/* Project Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-heading mb-4">About This Project</h2>
          <p className="text-foreground leading-relaxed text-lg">
            {project.description}
          </p>
        </motion.div>

        {/* Technologies & Skills */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-heading mb-4">Technologies Used</h3>
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li key={tech} className="tech-pill">
                  {tech}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold text-heading mb-4">Skills Demonstrated</h3>
            <ul className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <li key={skill} className="tech-pill bg-primary/20 border-primary/40 text-primary">
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Key Features */}
        {project.features && project.features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-heading mb-4">Key Features</h3>
            <ul className="space-y-3">
              {project.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary mt-1">▹</span>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
