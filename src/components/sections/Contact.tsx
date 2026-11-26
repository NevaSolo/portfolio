"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Mail, Phone, MapPin, Linkedin, ArrowRight, Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import MagneticButton from "@/components/ui/MagneticButton";
import { CONTACT } from "@/data/contact";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

type FormState = {
  name: string;
  email: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const validate = (values: FormState): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Le nom est requis.";
    if (!values.email.trim()) {
      next.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Format d'email invalide.";
    }
    if (!values.message.trim() || values.message.trim().length < 10) {
      next.message = "Le message doit contenir au moins 10 caractères.";
    }
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus("sent");
      setForm(initialState);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Get In Touch" title="Let's Build Something" />

        <p className="mt-8 max-w-xl text-lg text-fg-dim">
          Vous avez un projet web, une idée SaaS ou un projet utilisant
          l&apos;intelligence artificielle ? Parlons-en.
        </p>

        <div className="mt-16 grid gap-16 lg:grid-cols-2">
          <div className="space-y-8">
            <ContactRow icon={<Mail size={18} />} label="Email" value={CONTACT.email} href={`mailto:${CONTACT.email}`} />
            <ContactRow icon={<Phone size={18} />} label="Téléphone" value={CONTACT.phone} href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} />
            <ContactRow icon={<MapPin size={18} />} label="Localisation" value={CONTACT.location} />
            <ContactRow icon={<Linkedin size={18} />} label="LinkedIn" value="faneva-solomampionona" href={CONTACT.linkedin} external />
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
          >
            <Field
              label="Nom"
              name="name"
              value={form.name}
              error={errors.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              error={errors.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            />
            <Field
              label="Message"
              name="message"
              textarea
              value={form.message}
              error={errors.message}
              onChange={(v) => setForm((f) => ({ ...f, message: v }))}
            />

            <MagneticButton type="submit" disabled={status === "sending"}>
              {status === "sending" ? (
                <>
                  Envoi en cours <Loader2 size={16} className="animate-spin" />
                </>
              ) : (
                <>
                  Send Message <ArrowRight size={16} />
                </>
              )}
            </MagneticButton>

            {status === "sent" && (
              <p className="text-sm text-accent" role="status">
                Merci, votre message a bien été envoyé. Je vous répondrai rapidement.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-400" role="alert">
                Une erreur est survenue lors de l&apos;envoi. Réessayez ou contactez-moi
                directement par email.
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <div className="flex items-center gap-4">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-accent">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-fg-mute">{label}</p>
        <p className="mt-0.5 text-fg">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        data-cursor="hover"
        className="block w-fit transition-opacity hover:opacity-70"
      >
        {content}
      </a>
    );
  }

  return content;
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  textarea = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  textarea?: boolean;
}) {
  const baseClasses =
    "w-full rounded-xl border bg-bg-soft px-4 py-3.5 text-fg placeholder:text-fg-mute focus:outline-none transition-colors duration-300";
  const borderClass = error ? "border-red-400/60" : "border-line focus:border-accent";

  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-xs uppercase tracking-[0.2em] text-fg-mute">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={5}
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClasses} ${borderClass} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClasses} ${borderClass}`}
        />
      )}
      {error && (
        <p id={`${name}-error`} className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
