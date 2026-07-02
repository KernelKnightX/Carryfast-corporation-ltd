import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/expertise", label: "Our Expertise" },
  { to: "/services", label: "Our Services" },
  { to: "/clients", label: "Our Clients" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const cfg = useSiteConfig();
  const urgent = cfg.contact?.phone_urgent;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-slate-200/70 shadow-sm">
      <div className="container-x flex items-center justify-between h-16 md:h-20">
        <Logo size="lg" className="max-w-[170px] sm:max-w-[210px] overflow-hidden" />
        <nav className="hidden xl:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-${l.label.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
              className={({ isActive }) =>
                `px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                  isActive ? "text-gold-500" : "text-navy-900 hover:text-gold-500"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden xl:flex items-center gap-3">
          <Link
            to="/contact"
            data-testid="nav-cta-contact"
            className="inline-flex items-center gap-2 bg-gold-500 text-white px-5 py-3 text-sm font-semibold hover:bg-gold-600 transition-colors"
          >
            Contact Us
          </Link>
        </div>
        <button
          className="xl:hidden p-2 text-navy-900"
          aria-label="Menu"
          data-testid="nav-mobile-toggle"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="xl:hidden border-t border-slate-200 bg-white">
          <div className="container-x py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => { setOpen(false); window.scrollTo({ top: 0, left: 0, behavior: "smooth" }); }}
                data-testid={`mnav-${l.label.toLowerCase().replace(/ /g, "-")}`}
                className={({ isActive }) =>
                  `px-3 py-3 text-sm font-medium border-l-2 ${
                    isActive ? "border-gold-500 text-gold-500" : "border-transparent text-navy-900"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              data-testid="mnav-cta-contact"
              className="mt-3 inline-flex items-center justify-center gap-2 bg-gold-500 text-white px-5 py-3 text-sm font-semibold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
