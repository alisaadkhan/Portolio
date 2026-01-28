import { Github, Linkedin, Briefcase, Globe } from "lucide-react";

// Upwork Icon - White/Slate monochrome
const UpworkIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c2.539 0 4.51 1.649 5.31 4.366 1.22-1.834 2.148-4.036 2.687-5.892h2.536v7.112c0 .956.777 1.733 1.733 1.733h1.364V4.647H24v5.412h-3.967c-.956 0-1.733.777-1.733 1.733v7.823h-3.966v-8.477c0-1.023-.084-2.046-.425-2.833-.564-1.803-2.009-3.969-4.393-3.969-2.7 0-4.515 2.111-4.515 4.952 0 2.841 1.815 4.952 4.515 4.952h1.199c1.037 0 1.877.84 1.877 1.877v5.98H4.064v-6.723c0-3.855 2.209-6.44 5.842-6.44z"/>
  </svg>
);

// Fiverr Icon - White/Slate monochrome
const FiverrIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-2.707-4.495h-5.268V9.702c0-.402.252-.737.584-.737h3.35c.332 0 .584.335.584.737v.579h2.75V9.702c0-1.89-1.487-3.421-3.317-3.421h-3.317c-1.83 0-3.317 1.531-3.317 3.421v1.391H9.631V9.702c0-.402.252-.737.584-.737h3.349c.332 0 .584.335.584.737v.579h2.75V9.702c0-1.89-1.487-3.421-3.316-3.421H10.265c-1.83 0-3.317 1.531-3.317 3.421v1.391H4.234c-1.83 0-3.317 1.531-3.317 3.421v3.158c0 1.89 1.487 3.421 3.317 3.421h3.317c1.83 0 3.317-1.531 3.317-3.421v-3.158c0-.402.252-.737.584-.737h2.182v6.316h2.75v-6.316h2.182c.332 0 .584.335.584.737v3.158c0 1.89 1.487 3.421 3.317 3.421h3.317c1.83 0 3.317-1.531 3.317-3.421v-3.158c0-1.89-1.487-3.421-3.317-3.421zM7.551 17.272c0 .402-.252.737-.584.737H4.234c-.332 0-.584-.335-.584-.737v-3.158c0-.402.252-.737.584-.737h2.733c.332 0 .584.335.584.737v3.158zm13.166 0c0 .402-.252.737-.584.737h-2.733c-.332 0-.584-.335-.584-.737v-3.158c0-.402.252-.737.584-.737h2.733c.332 0 .584.335.584.737v3.158z"/>
  </svg>
);

const Footer = () => {
  const socialLinks = [
    { icon: Github, href: "https://github.com/alisaadkhan", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/ali-saad-khan-6a2a0b394", label: "LinkedIn" },
    { icon: UpworkIcon, href: "https://www.upwork.com/freelancers/~0145ade69cd488f664", label: "Upwork" },
    { icon: FiverrIcon, href: "https://www.fiverr.com/s/P2AlEep", label: "Fiverr" },
  ];

  return (
    <footer className="mt-12 border-t border-border/30 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-heading">
            Ali Saad <span className="text-primary">Khan</span>
          </h3>
          <p className="text-muted-foreground">Full-Stack Solutions Architect</p>
        </div>
        <div className="flex items-center gap-5">
          {socialLinks.map((social) => {
            const IconComponent = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground transition-colors duration-200 hover:text-primary"
                aria-label={social.label}
              >
                <IconComponent className="h-5 w-5" />
              </a>
            );
          })}
        </div>
      </div>
      <div className="mt-6 border-t border-border/20 pt-4 text-center text-sm text-muted-foreground">
        © 2026 Ali Saad Khan. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;