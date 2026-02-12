import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Github, Linkedin, Mail } from "lucide-react";

import emailjs from "@emailjs/browser";
import { toast } from "sonner";

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

interface FieldErrors {
  user_name?: string;
  user_email?: string;
  message?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FieldError = ({ message }: { message?: string }) => (
  <AnimatePresence>
    {message && (
      <motion.p
        initial={{ opacity: 0, y: -6, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -6, height: 0 }}
        transition={{ duration: 0.2 }}
        className="font-mono text-[10px] tracking-[0.15em] text-destructive/80 mt-1.5 flex items-center gap-1.5"
      >
        <span className="inline-block w-1 h-1 rounded-full bg-destructive/60 animate-pulse" />
        {message}
      </motion.p>
    )}
  </AnimatePresence>
);

const ContactSection = () => {
  const ref = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (fields?: Partial<Record<string, string>>): FieldErrors => {
    const form = formRef.current;
    if (!form) return {};
    const name = fields?.user_name ?? (form.elements.namedItem("user_name") as HTMLInputElement)?.value ?? "";
    const email = fields?.user_email ?? (form.elements.namedItem("user_email") as HTMLInputElement)?.value ?? "";
    const message = fields?.message ?? (form.elements.namedItem("message") as HTMLTextAreaElement)?.value ?? "";

    const errs: FieldErrors = {};
    if (!name.trim()) errs.user_name = "CALLSIGN REQUIRED — identify yourself";
    if (!email.trim()) errs.user_email = "FREQUENCY REQUIRED — provide a return channel";
    else if (!emailRegex.test(email)) errs.user_email = "INVALID FREQUENCY — check email format";
    if (!message.trim()) errs.message = "EMPTY TRANSMISSION — message cannot be blank";
    return errs;
  };

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const errs = validate();
    setErrors((prev) => ({ ...prev, [field]: errs[field as keyof FieldErrors] }));
  };

  const handleChange = (field: string) => {
    if (!touched[field]) return;
    const errs = validate();
    setErrors((prev) => ({ ...prev, [field]: errs[field as keyof FieldErrors] }));
  };

  const inputClass = (field: keyof FieldErrors) =>
    `w-full bg-input/50 border rounded-md px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 transition-all duration-300 ${errors[field]
      ? "border-destructive/50 focus:border-destructive/60 focus:ring-destructive/20"
      : "border-border/50 focus:border-primary/50 focus:ring-primary/20"
    }`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ user_name: true, user_email: true, message: true });

    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    emailjs
      .sendForm(serviceId, templateId, formRef.current!, publicKey)
      .then(
        () => {
          setLoading(false);
          setSent(true);
          toast.success("Transmission successful. Message received.");
          setTimeout(() => setSent(false), 5000);
          formRef.current?.reset();
          setErrors({});
          setTouched({});
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
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/30">
            <div className="w-2 h-2 rounded-full bg-primary animate-flicker" />
            <span className="font-mono text-xs text-primary/60 tracking-wider">
              SECURE TRANSMISSION — CHANNEL OPEN
            </span>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block font-mono text-xs text-muted-foreground tracking-wider mb-2">
                  CALLSIGN
                </label>
                <input
                  type="text"
                  name="user_name"
                  placeholder="Your name"
                  onBlur={() => handleBlur("user_name")}
                  onChange={() => handleChange("user_name")}
                  className={inputClass("user_name")}
                />
                <FieldError message={errors.user_name} />
              </div>
              <div>
                <label className="block font-mono text-xs text-muted-foreground tracking-wider mb-2">
                  FREQUENCY
                </label>
                <input
                  type="email"
                  name="user_email"
                  placeholder="your@email.com"
                  onBlur={() => handleBlur("user_email")}
                  onChange={() => handleChange("user_email")}
                  className={inputClass("user_email")}
                />
                <FieldError message={errors.user_email} />
              </div>
            </div>
            <div>
              <label className="block font-mono text-xs text-muted-foreground tracking-wider mb-2">
                MESSAGE
              </label>
              <textarea
                name="message"
                rows={5}
                placeholder="Transmit your message..."
                onBlur={() => handleBlur("message")}
                onChange={() => handleChange("message")}
                className={`${inputClass("message")} resize-none`}
              />
              <FieldError message={errors.message} />
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

