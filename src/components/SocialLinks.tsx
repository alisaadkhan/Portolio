import { motion } from "framer-motion";
import { Github, Twitter } from "lucide-react";

const UpworkIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l-.228-1.076-.008-.042c-.207-1.143-.849-3.06-2.839-3.06-1.492 0-2.703 1.212-2.703 2.703.001 1.489 1.212 2.702 2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c0 .956-.777 1.733-1.733 1.733H4.701V4.647H0v5.412h3.967c.956 0 1.733.777 1.733 1.733v7.823h3.966v-8.477c0-1.023.084-2.046.425-2.833.564-1.803 2.009-3.969 4.393-3.969 2.7 0 4.515 2.111 4.515 4.952 0 2.841-1.815 4.952-4.515 4.952h-1.199c-1.037 0-1.877.84-1.877 1.877v5.98h7.527v-6.723c0-3.855-2.209-6.44-5.842-6.44z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const socialLinks = [
  { icon: Github, href: "https://github.com/alisaadkhan", label: "GitHub" },
  { icon: Twitter, href: "https://x.com/O2667138417259", label: "X (Twitter)" },
  { icon: UpworkIcon, href: "https://www.upwork.com/freelancers/~0145ade69cd488f664", label: "Upwork" },
  { icon: WhatsAppIcon, href: "https://wa.me/923195652287", label: "WhatsApp" },
];

const SocialLinks = () => {
  return (
    <div className="flex items-center gap-5">
      {socialLinks.map((social, index) => {
        const IconComponent = social.icon;
        return (
          <motion.a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="text-foreground transition-colors duration-200 hover:text-primary"
            aria-label={social.label}
          >
            <IconComponent className="h-5 w-5" />
          </motion.a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
