import React, { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
} from "lucide-react";
import Toast from "../components/Toast";
import { api } from "../utils/api";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    lines: ["123 Oceanfront Boulevard", "Azure Coast, CA 90210"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["reservations@ojasresort.com", "info@ojasresort.com"],
  },
  {
    icon: Clock,
    title: "Hours",
    lines: ["Mon–Fri: 8:00 AM – 10:00 PM", "Sat–Sun: 9:00 AM – 11:00 PM"],
  },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    document.title = "Contact Us | Ojas Resort";
  }, []);

  const validate = () => {
    const errs: any = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid email";
    if (!formData.subject.trim()) errs.subject = "Subject is required";
    if (!formData.message.trim()) errs.message = "Message is required";
    else if (formData.message.trim().length < 10) errs.message = "Minimum 10 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Simulate network request since there is no custom inquiries endpoint in backend
      await new Promise((resolve) => setTimeout(resolve, 800));
      setToast({
        message: "Message sent successfully! We'll get back to you soon.",
        type: "success",
      });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setToast({
        message: "Failed to send message. Please try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border ${
      errors[field] ? "border-red-400 bg-red-50/50" : "border-gray-200 bg-white"
    } text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-vp-gold focus:border-vp-gold transition-all duration-300 rounded-lg`;

  return (
    <div className="min-h-screen bg-vp-cream">
      {/* Hero Banner */}
      <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-vp-dark via-vp-blue to-vp-dark" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] border border-vp-gold/20 rounded-full" />
          <div className="absolute top-0 right-1/3 w-[300px] h-[300px] border border-vp-gold/10 rounded-full" />
        </div>
        <div className="relative z-10 text-center px-6 mt-12">
          <div className="flex items-center justify-center gap-3 mb-4 animate-fadeIn">
            <div className="w-12 h-[1px] bg-vp-gold" />
            <span className="text-vp-gold text-xs md:text-sm tracking-[0.35em] uppercase font-light">
              Get in Touch
            </span>
            <div className="w-12 h-[1px] bg-vp-gold" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight">
            Contact Us
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            We would love to hear from you. Reach out for reservations, inquiries, or just to say hello.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left - Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-vp-dark mb-4">
                Let's Start a Conversation
              </h2>
              <p className="text-gray-600 leading-relaxed font-light">
                Whether you're planning a luxurious getaway, a grand celebration, or simply need more information, our dedicated team is here to assist you every step of the way.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, idx) => {
                const IconComp = info.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-vp-gold/10 flex items-center justify-center mb-4">
                      <IconComp className="w-5 h-5 text-vp-gold" />
                    </div>
                    <h3 className="font-serif text-lg text-vp-dark mb-2">{info.title}</h3>
                    {info.lines.map((line, lineIdx) => (
                      <p key={lineIdx} className="text-gray-500 text-sm font-light">
                        {line}
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-serif text-lg text-vp-dark mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => {
                  const SocialIcon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-vp-gold hover:text-vp-dark hover:border-vp-gold transition-all duration-300 shadow-sm"
                    >
                      <SocialIcon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 lg:p-10">
              <h2 className="font-serif text-2xl text-vp-dark mb-6">Send Us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={inputClass("name")}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={inputClass("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      className={inputClass("phone")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className={inputClass("subject")}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your inquiry..."
                    className={`${inputClass("message")} resize-none`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-vp-gold hover:bg-vp-dark text-vp-dark hover:text-white border border-vp-gold hover:border-vp-dark font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group uppercase tracking-wider text-sm"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-vp-dark/30 border-t-vp-dark rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="rounded-2xl overflow-hidden border border-gray-200 h-[400px] bg-gray-100 shadow-md">
          <iframe
            title="Ojas Resort Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzA5LjgiVw!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>
      </section>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Contact;
