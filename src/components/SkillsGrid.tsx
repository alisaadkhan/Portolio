import { motion } from "framer-motion";

interface Skill {
  name: string;
  level: number;
  category: "languages" | "infrastructure" | "databases" | "tools";
}

const skills: Skill[] = [
  // Languages
  { name: "TypeScript", level: 95, category: "languages" },
  { name: "Go", level: 90, category: "languages" },
  { name: "Python", level: 85, category: "languages" },
  { name: "Rust", level: 75, category: "languages" },
  { name: "C++", level: 70, category: "languages" },
  
  // Infrastructure
  { name: "Kubernetes", level: 92, category: "infrastructure" },
  { name: "Docker", level: 95, category: "infrastructure" },
  { name: "AWS", level: 88, category: "infrastructure" },
  { name: "Terraform", level: 85, category: "infrastructure" },
  { name: "CI/CD", level: 90, category: "infrastructure" },
  
  // Databases
  { name: "PostgreSQL", level: 92, category: "databases" },
  { name: "Redis", level: 88, category: "databases" },
  { name: "MongoDB", level: 80, category: "databases" },
  { name: "ElasticSearch", level: 75, category: "databases" },
  
  // Tools
  { name: "React", level: 93, category: "tools" },
  { name: "Node.js", level: 90, category: "tools" },
  { name: "GraphQL", level: 85, category: "tools" },
  { name: "gRPC", level: 80, category: "tools" },
];

const categoryLabels = {
  languages: "Languages",
  infrastructure: "Infrastructure",
  databases: "Databases",
  tools: "Frameworks & Tools",
};

const SkillsGrid = () => {
  const categories = ["languages", "infrastructure", "databases", "tools"] as const;

  return (
    <div className="space-y-10">
      {categories.map((category, categoryIndex) => {
        const categorySkills = skills.filter((s) => s.category === category);
        
        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
          >
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
              {categoryLabels[category]}
            </h3>
            
            <div className="space-y-3">
              {categorySkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground group-hover:text-heading transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {skill.level}%
                    </span>
                  </div>
                  
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.05, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #a855f7, #3b82f6)" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SkillsGrid;
