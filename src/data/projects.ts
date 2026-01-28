export interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  skills: string[];
  githubUrl: string;
  liveUrl?: string;
  imageUrl: string;
  features?: string[];
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: "ai-chatbot",
    title: "Aizen AI Chatbot",
    description: "A premium desktop chatbot application featuring Sōsuke Aizen from Bleach as your AI assistant. Built with Electron, React, and Google's Gemini 2.5 Flash API. The application features a modern UI with glassmorphism effects, image support for AI analysis, and a frameless window design. The AI responds in character as the iconic villain, providing an immersive conversational experience.",
    shortDescription: "A premium desktop chatbot application featuring Sōsuke Aizen from Bleach as your AI assistant, powered by Google's Gemini 2.5 Flash API.",
    technologies: ["Electron", "React", "TypeScript", "Vite", "Gemini 2.5 Flash", "Tailwind CSS"],
    skills: ["Desktop App Development", "AI Integration", "Modern UI/UX", "API Integration", "State Management"],
    githubUrl: "https://github.com/alisaadkhan/AI-CHATBOT.git",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop&q=80",
    features: [
      "Sōsuke Aizen persona with character-accurate responses",
      "Modern dark-themed interface with glassmorphism effects",
      "Image support for AI analysis and processing",
      "Frameless window with custom controls",
      "Animated typing indicators and smooth interactions",
      "Cross-platform support (Windows, macOS, Linux)"
    ]
  },
  {
    id: "dynamic-digital-signage",
    title: "Enterprise Digital Signage System (DDS)",
    description: "A centralized content management network capable of distributing dynamic media to multiple endpoints in real-time. Features include a normalized database schema for high-frequency updates, role-based access control (RBAC), and a responsive dashboard for scheduling and monitoring display status. Built with PHP and MySQL, this system demonstrates expertise in enterprise-level architecture and real-time data synchronization.",
    shortDescription: "A centralized content management network for distributing dynamic media to multiple endpoints in real-time with normalized database schema and RBAC.",
    technologies: ["PHP", "MySQL", "Bootstrap", "JavaScript", "Security Headers", "Real-time CMS"],
    skills: ["Lead Architecture", "Database Design", "RBAC Implementation", "Real-time Systems", "Enterprise Solutions"],
    githubUrl: "https://github.com/alisaadkhan/Dynamic-Digital-Signage-DDS-.git",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&q=80",
    features: [
      "Centralized content management network",
      "Normalized database schema for high-frequency updates",
      "Role-based access control (RBAC)",
      "Responsive dashboard for scheduling and monitoring",
      "Real-time media distribution to multiple endpoints",
      "Sub-second latency for time-sensitive displays"
    ]
  },
  {
    id: "student-attendance-system",
    title: "Student Attendance Management System",
    description: "An automated tracking system designed to eliminate manual data entry errors. Built with a focus on data integrity, it features custom reporting algorithms, secure instructor authentication, and real-time attendance analytics. This full-stack solution demonstrates proficiency in PHP/MySQL architecture and automated workflow design.",
    shortDescription: "An automated tracking system with custom reporting algorithms, secure authentication, and real-time attendance analytics.",
    technologies: ["PHP", "MySQL", "JavaScript", "HTML5", "RBAC", "Reporting Algorithms"],
    skills: ["Full-Stack Development", "Data Integrity", "Automated Systems", "Custom Algorithms", "Secure Authentication"],
    githubUrl: "https://github.com",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop&q=80",
    features: [
      "Automated tracking to eliminate manual errors",
      "Custom reporting algorithms",
      "Secure instructor authentication",
      "Real-time attendance analytics",
      "Data integrity focus",
      "Role-based access control"
    ]
  },
  {
    id: "lexmemory-legal-compass",
    title: "LexMemory - Your Legal Compass",
    description: "An intelligent legal assistance platform designed to help users navigate complex legal information. The application provides comprehensive legal resources, case management, and guidance tools. Built with modern web technologies, it offers an intuitive interface for legal research and document management.",
    shortDescription: "An intelligent legal assistance platform providing comprehensive legal resources and case management tools.",
    technologies: ["React", "TypeScript", "Node.js", "Database", "API Integration", "Modern UI"],
    skills: ["Full Stack Development", "Legal Tech", "Data Management", "User Experience Design", "API Development"],
    githubUrl: "https://github.com/alisaadkhan/lexmemory-your-legal-compass.git",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=600&fit=crop&q=80",
    features: [
      "Comprehensive legal resource library",
      "Case management and tracking",
      "Intuitive search and navigation",
      "Document management system",
      "User-friendly interface",
      "Secure data handling"
    ]
  },
  {
    id: "copyright-sentinel-guard",
    title: "Copyright Sentinel Guard",
    description: "A robust copyright protection and monitoring system designed to safeguard intellectual property. The platform provides automated detection, monitoring, and protection mechanisms for digital content. It features advanced scanning algorithms, real-time alerts, and comprehensive reporting tools to help creators protect their work.",
    shortDescription: "A comprehensive copyright protection system with automated detection and monitoring capabilities.",
    technologies: ["Python", "Machine Learning", "Web Scraping", "API Development", "Database", "Security"],
    skills: ["AI/ML Development", "Web Scraping", "Security Systems", "Automation", "Data Analysis", "Intellectual Property"],
    githubUrl: "https://github.com/alisaadkhan/copyright-sentinel-guard.git",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=600&fit=crop&q=80",
    features: [
      "Automated copyright detection",
      "Real-time monitoring and alerts",
      "Advanced scanning algorithms",
      "Comprehensive reporting system",
      "Multi-platform support",
      "Secure content protection"
    ]
  }
];

export interface RegularProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

export const regularProjects: RegularProject[] = [
  {
    id: "ai-chatbot",
    title: "CPU Process Scheduling Simulator",
    description: "A complex algorithmic simulation modeling OS resource allocation (Round Robin, FCFS). This project demonstrates proficiency in low-level memory management, process synchronization, and performance optimization algorithms. Built with C++ and STL, showcasing systems engineering expertise.",
    technologies: ["C++", "STL", "Algorithms", "Linux", "Process Management", "Memory Management", "Git"],
    githubUrl: "https://github.com",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop&q=80"
  }
];
