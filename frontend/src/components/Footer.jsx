import { Link } from "react-router-dom";
import { Mail, MapPin, Linkedin, Facebook, Instagram } from "lucide-react";
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
  ["Customs Expertise", "/services#customs-expertise"],
  ["Customs Clearance", "/services#customs-clearance"],
  ["Import Customs Clearance", "/services#import-customs-clearance"],
  ["Export Customs Clearance", "/services#export-customs-clearance"],
  ["Trade Compliance", "/services#trade-compliance"],
  ["Documentation Support", "/services#documentation-support"],
];

const XIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.7l-5.2-6.9L5.6 22H2.3l7.7-8.8L1.9 2h6.8l4.7 6.3L18.9 2Zm-1.2 17.9h1.8L7.7 4H5.8l11.9 15.9Z" />
  </svg>
);

export default function Footer() {
  const cfg = useSiteConfig();
  const c = cfg.contact || {};
  const social = cfg.social || {};

  const socials = [
    { url: social.linkedin, Icon: Linkedin, label: "LinkedIn", className: "bg-[#0A66C2] hover:bg-[#0C66D0]" },
    { url: social.facebook, Icon: Facebook, label: "Facebook", className: "bg-[#1877F2] hover:bg-[#3B82F6]" },
    { url: social.instagram, Icon: Instagram, label: "Instagram", className: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90" },
    { url: social.twitter, Icon: XIcon, label: "X", className: "bg-black hover:bg-slate-800" },
  ];

  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-x py-12 md:py-20 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <Logo inverted size="lg" showText />
          <p className="mt-6 text-sm text-white/70 leading-relaxed max-w-sm">
            {cfg.footer?.tagline || "Customs clearance, trade compliance, and documentation support for manufacturers, traders, and industrial businesses across India."}
          </p>
          <p className="mt-4 text-xs text-gold-400 uppercase tracking-[0.18em] font-semibold">
            {cfg.footer?.since || "Serving Indian Trade Since 1995"}
          </p>
          <div className="mt-6 flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url || "#"}
                target={s.url ? "_blank" : undefined}
                rel={s.url ? "noopener noreferrer" : undefined}
                aria-label={s.label}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${s.className} ${!s.url ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
              >
                <s.Icon size={16} />
              </a>
            ))}
          </div>
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
