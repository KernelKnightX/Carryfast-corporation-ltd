import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter, Instagram } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

const QUICK_LINKS = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Our Expertise", "/expertise"],
  ["Our Services", "/services"],
  ["Our Clients", "/clients"],
  ["Blog", "/blog"],
  ["Contact Us", "/contact"],
];

const SERVICES = [
  ["Customs Clearance", "/services"],
  ["Import Customs Clearance", "/services"],
  ["Export Customs Clearance", "/services"],
  ["Trade Compliance", "/services"],
  ["Documentation Support", "/services"],
];

export default function Footer() {
  const cfg = useSiteConfig();
  const c = cfg.contact || {};
  const social = cfg.social || {};

  const socials = [
    { url: social.linkedin, Icon: Linkedin, label: "LinkedIn" },
    { url: social.facebook, Icon: Facebook, label: "Facebook" },
    { url: social.twitter, Icon: Twitter, label: "Twitter" },
    { url: social.instagram, Icon: Instagram, label: "Instagram" },
  ].filter((s) => s.url);

  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-x py-16 md:py-20 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <Logo inverted size="lg" />
          <p className="mt-6 text-sm text-white/70 leading-relaxed max-w-sm">
            {cfg.footer?.tagline || "Customs clearance, trade compliance, and documentation support for manufacturers, traders, and industrial businesses across India."}
          </p>
          <p className="mt-4 text-xs text-gold-400 uppercase tracking-[0.18em] font-semibold">
            {cfg.footer?.since || "Serving Indian Trade Since 1995"}
          </p>
          {socials.length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                   className="w-9 h-9 border border-white/20 flex items-center justify-center hover:border-gold-500 hover:bg-gold-500 transition-colors">
                  <s.Icon size={15} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white mb-5">Quick Links</div>
          <ul className="space-y-3 text-sm text-white/75">
            {QUICK_LINKS.map(([l, p]) => (
              <li key={l}><Link to={p} className="hover:text-gold-400 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white mb-5">Services</div>
          <ul className="space-y-3 text-sm text-white/75">
            {SERVICES.map(([l, p]) => (
              <li key={l}><Link to={p} className="hover:text-gold-400 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white mb-5">Contact</div>
          <div className="space-y-3 text-sm text-white/80">
            <div className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 text-gold-500 shrink-0" />
              <span>{c.address_line_1}<br />{c.address_line_2}<br />{c.address_line_3}</span>
            </div>
            {c.phone_urgent && (
              <a href={`tel:${c.phone_urgent.replace(/\s+/g, "")}`} className="flex items-center gap-3 hover:text-gold-400">
                <Phone size={16} className="text-gold-500" /> {c.phone_urgent}
              </a>
            )}
            {c.email && (
              <a href={`mailto:${c.email}`} className="flex items-center gap-3 hover:text-gold-400">
                <Mail size={16} className="text-gold-500" /> {c.email}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/55">
          <span>© {new Date().getFullYear()} {cfg.company?.name || "Carry Fast Corporation"}. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-white/80">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-white/80">Terms & Conditions</Link>
            <Link to="/cookie-policy" className="hover:text-white/80">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
