import { useState } from "react";
import { motion } from "framer-motion";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

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
          <span className="terminal-title">alisaad@contact:~</span>
        </div>

        {/* Body */}
        <div className="terminal-body">
          <h3 className="terminal-headline">Initialize Connection</h3>

          <form onSubmit={handleSubmit} className="terminal-form">
            {/* Name Input */}
            <div className="terminal-input-group">
              <label className="terminal-label">
                <span className="terminal-prompt">user@alisaad:~$</span>
                <span className="terminal-field-name">enter_name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name..."
                className="terminal-input"
                required
              />
            </div>

            {/* Email Input */}
            <div className="terminal-input-group">
              <label className="terminal-label">
                <span className="terminal-prompt">user@alisaad:~$</span>
                <span className="terminal-field-name">enter_email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="terminal-input"
                required
              />
            </div>

            {/* Phone Input (Optional) */}
            <div className="terminal-input-group">
              <label className="terminal-label">
                <span className="terminal-prompt">user@alisaad:~$</span>
                <span className="terminal-field-name">enter_phone</span>
                <span className="terminal-optional">(optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="terminal-input"
              />
            </div>

            {/* Message Textarea */}
            <div className="terminal-input-group">
              <label className="terminal-label">
                <span className="terminal-prompt">user@alisaad:~$</span>
                <span className="terminal-field-name">compose_message</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here..."
                className="terminal-textarea"
                rows={4}
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="terminal-submit-btn">
              <span>send_message</span>
              <span className="submit-arrow">→</span>
            </button>
          </form>

          {/* Status */}
          <div className="terminal-status">
            <span className="status-indicator" />
            <span>Ready to receive transmissions</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactForm;
