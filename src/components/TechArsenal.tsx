import { motion } from "framer-motion";

const techStack = [
  { name: "Kali Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kalilinux/kalilinux-original.svg" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
];

const TechArsenal = () => {
  // Duplicate the array for seamless infinite loop
  const duplicatedStack = [...techStack, ...techStack];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Marquee Container */}
      <div className="arsenal-marquee-container">
        {/* Fade edges */}
        <div className="arsenal-fade-left" />
        <div className="arsenal-fade-right" />
        
        {/* Scrolling Track */}
        <div className="arsenal-track">
          {duplicatedStack.map((tech, index) => (
            <div key={`${tech.name}-${index}`} className="arsenal-card">
              <img
                src={tech.icon}
                alt={tech.name}
                className="arsenal-icon"
                loading="lazy"
              />
              <span className="arsenal-label">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TechArsenal;
