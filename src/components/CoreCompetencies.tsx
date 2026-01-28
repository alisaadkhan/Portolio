const competencies = [
  "System Architecture",
  "Penetration Testing",
  "API Development",
  "Database Optimization",
  "Network Security",
  "CI/CD Pipelines",
  "Algorithm Design",
  "Linux Administration",
];

const CoreCompetencies = () => {
  return (
    <div className="mt-4">
      <h4 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Core Competencies
      </h4>
      <div className="flex flex-wrap gap-3">
        {competencies.map((skill) => (
          <span
            key={skill}
            className="terminal-badge"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CoreCompetencies;
