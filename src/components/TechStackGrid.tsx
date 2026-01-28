import { motion } from "framer-motion";

interface TechItem {
  name: string;
  icon: string;
  color: string;
}

const techStack: TechItem[] = [
  // Languages
  { name: "C++", icon: "devicon-cplusplus-plain", color: "#00599C" },
  { name: "Python", icon: "devicon-python-plain", color: "#3776AB" },
  { name: "PHP", icon: "devicon-php-plain", color: "#777BB4" },
  { name: "TypeScript", icon: "devicon-typescript-plain", color: "#3178C6" },
  { name: "Go", icon: "devicon-go-plain", color: "#00ADD8" },
  { name: "Rust", icon: "devicon-rust-plain", color: "#DEA584" },
  // Infrastructure
  { name: "Linux (Kali)", icon: "devicon-linux-plain", color: "#FCC624" },
  { name: "Docker", icon: "devicon-docker-plain", color: "#2496ED" },
  { name: "Kubernetes", icon: "devicon-kubernetes-plain", color: "#326CE5" },
  { name: "AWS", icon: "devicon-amazonwebservices-original", color: "#FF9900" },
  { name: "Terraform", icon: "devicon-terraform-plain", color: "#7B42BC" },
  // Databases
  { name: "MySQL", icon: "devicon-mysql-plain", color: "#00758F" },
  { name: "PostgreSQL", icon: "devicon-postgresql-plain", color: "#336791" },
  { name: "MongoDB", icon: "devicon-mongodb-plain", color: "#47A248" },
  { name: "Redis", icon: "devicon-redis-plain", color: "#DC382D" },
  // Tools
  { name: "Git", icon: "devicon-git-plain", color: "#F1502F" },
  { name: "React", icon: "devicon-react-original", color: "#61DAFB" },
  { name: "Node.js", icon: "devicon-nodejs-plain", color: "#68A063" },
];

const TechStackMarquee = () => {
  const loopItems = [...techStack, ...techStack];

  return (
    <div className="marquee-container" aria-label="Technology marquee">
      <div className="marquee-track">
        {loopItems.map((tech, index) => (
          <motion.div
            key={`${tech.name}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className="marquee-item"
          >
            <i
              className={`${tech.icon} marquee-icon`}
              style={{ color: tech.color }}
              aria-hidden="true"
            />
            <span className="marquee-label">{tech.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TechStackMarquee;
