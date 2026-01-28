import { useState } from "react";
import { motion } from "framer-motion";

const SimpleContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // You can integrate with a service like Formspree, EmailJS, or your own backend
      // For now, we'll use mailto as a fallback
      const mailtoLink = `mailto:alisaad75878@gmail.com?subject=Contact from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message + "\n\nFrom: " + formData.email)}`;
      window.location.href = mailtoLink;
      
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-16"
    >
      <div className="simple-contact-form">
        <form onSubmit={handleSubmit} className="contact-form">
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="form-input"
              required
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="form-input"
              required
            />
          </div>

          {/* Message Field */}
          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message..."
              className="form-textarea"
              rows={5}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="form-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "SEND MESSAGE"}
          </button>

          {/* Status Message */}
          {submitStatus === "success" && (
            <div className="form-status form-status-success">
              Message sent successfully!
            </div>
          )}
          {submitStatus === "error" && (
            <div className="form-status form-status-error">
              Failed to send message. Please try again.
            </div>
          )}
        </form>
      </div>
    </motion.section>
  );
};

export default SimpleContactForm;
