import { motion } from "framer-motion";

const ContactTerminal = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="contact-terminal">
        {/* Header */}
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="terminal-title">ready to connect</span>
        </div>

        {/* Body */}
        <div className="terminal-body">
          {/* Headline */}
          <h3 className="terminal-headline">
            Let's Build Something Great
          </h3>

          {/* Email Command */}
          <div className="terminal-command-block">
            <div className="terminal-command">
              <span className="command-text">contact</span>
              <span className="command-flag">--email=</span>
              <a
                href="mailto:hello@alexchen.dev"
                className="command-value"
              >
                "hello@alexchen.dev"
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="terminal-links">
            <a
              href="https://github.com/alexchen"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-btn"
            >
              GitHub
            </a>
            <a
              href="https://upwork.com/freelancers/alexchen"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-btn"
            >
              Upwork
            </a>
            <a
              href="https://linkedin.com/in/alexchen"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-btn"
            >
              LinkedIn
            </a>
          </div>

          {/* Status */}
          <div className="terminal-status">
            <span className="status-indicator" />
            <span>Available for new projects</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactTerminal;
