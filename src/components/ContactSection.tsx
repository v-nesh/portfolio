import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Github, Linkedin, Mail } from "lucide-react";

import emailjs from "@emailjs/browser";
import { toast } from "sonner";

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const ContactSection = () => {
  const ref = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        serviceId,
        templateId,
        formRef.current!,
        publicKey
      )
      .then(
        () => {
          setLoading(false);
          setSent(true);
          toast.success("Transmission successful. Message received.");
          setTimeout(() => setSent(false), 5000);
          formRef.current?.reset();
        },
        (error) => {
          setLoading(false);
          toast.error("Transmission failed. Please try again.");
          console.error("FAILED...", error.text);
        }
      );
  };

  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="container mx-auto max-w-3xl" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary/60 mb-3">// COMMS CHANNEL</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Establish <span className="text-gradient-primary">Contact</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-panel-strong p-8 hud-corner"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/30">
            <div className="w-2 h-2 rounded-full bg-primary animate-flicker" />
            <span className="font-mono text-xs text-primary/60 tracking-wider">
              SECURE TRANSMISSION — CHANNEL OPEN
            </span>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block font-mono text-xs text-muted-foreground tracking-wider mb-2">
                  CALLSIGN
                </label>
                <input
                  type="text"
                  name="user_name"
                  required
                  placeholder="Your name"
                  className="w-full bg-input/50 border border-border/50 rounded-md px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-muted-foreground tracking-wider mb-2">
                  FREQUENCY
                </label>
                <input
                  type="email"
                  name="user_email"
                  required
                  placeholder="your@email.com"
                  className="w-full bg-input/50 border border-border/50 rounded-md px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block font-mono text-xs text-muted-foreground tracking-wider mb-2">
                MESSAGE
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Transmit your message..."
                className="w-full bg-input/50 border border-border/50 rounded-md px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full glass-panel py-3 font-mono text-xs tracking-[0.15em] text-primary hover:bg-primary/10 border-primary/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse">TRANSMITTING...</span>
              ) : sent ? (
                <span className="text-sonar">✓ TRANSMISSION SENT</span>
              ) : (
                <>
                  <Send size={14} />
                  SEND TRANSMISSION
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-6 mt-12"
        >
          {[
            { icon: Github, label: "GitHub", href: "https://github.com/v-nesh" },
            { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/nesh-baskaran/" },
            { icon: Mail, label: "Email", href: "mailto:vignesh1.baskaran@gmail.com" },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <social.icon size={16} />
              <span className="font-mono text-xs tracking-wider">{social.label.toUpperCase()}</span>
            </a>
          ))}
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-20 pt-8 border-t border-border/20">
          <p className="font-mono text-xs text-muted-foreground/50 tracking-wider">
            © 2026 VIGNESH — ALL SYSTEMS OPERATIONAL
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
