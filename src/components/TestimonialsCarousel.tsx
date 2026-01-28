import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Ali Saad Khan delivers code that works. No fluff, just solid architecture and reliable security. A rare find on Upwork.",
    author: "Previous Client",
    role: "Upwork",
    company: "Client",
  },
  {
    quote: "Exceptional technical depth combined with a pragmatic approach. Ali doesn't just solve problems; he anticipates architectural challenges and builds scalable solutions from day one.",
    author: "Tech Lead",
    role: "Enterprise Client",
    company: "Fortune 500",
  },
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  const current = testimonials[currentIndex];

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg border border-border bg-card p-8 min-h-[280px]">
        <Quote className="h-8 w-8 text-primary/40 mb-4" />
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <blockquote className="text-lg leading-relaxed text-foreground mb-6">
              "{current.quote}"
            </blockquote>
            
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {current.author.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
              <div>
                <p className="font-medium text-heading">{current.author}</p>
                <p className="text-sm text-muted-foreground">
                  {current.role} · {current.company}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full border border-border text-foreground hover:text-heading hover:border-primary/50 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full border border-border text-foreground hover:text-heading hover:border-primary/50 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
