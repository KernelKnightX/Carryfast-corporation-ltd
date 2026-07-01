import { useEffect, useState } from "react";
import { ArrowRight, FileCheck, ShieldCheck, BookOpen, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

const SERVICE_CARDS = [
  { icon: FileCheck, t: "Customs Clearance", d: "Full Bill of Entry & Shipping Bill cycle — filed, assessed, examined, released on time." },
  { icon: ShieldCheck, t: "Customs Services", d: "AEO-certified intermediary handling classification, valuation, duty calc & compliance." },
  { icon: BookOpen, t: "Trade Compliance", d: "We track CBIC, DGFT and BIS changes and apply them before filing — not after." },
  { icon: FileText, t: "Documentation", d: "Bill of Entry, Shipping Bill, COO and supporting paperwork — prepared and verified." },
];

export default function HeroSlider() {
  const cfg = useSiteConfig();
  const slides = (cfg.hero_slides && cfg.hero_slides.length) ? cfg.hero_slides : [];
  const stats = cfg.stats || [];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  if (slides.length === 0) {
    return <section className="bg-navy-900 text-white h-[640px] flex items-center justify-center">Loading hero…</section>;
  }

  const next = () => setI((p) => (p + 1) % slides.length);
  const prev = () => setI((p) => (p - 1 + slides.length) % slides.length);
  const s = slides[i];

  const kpiStrip = [
    ...stats.slice(0, 3).map((st) => ({ v: `${formatStat(st.value)}${st.suffix || ""}`, l: (st.label || "").split(" ").slice(0, 2).join(" ") })),
    { v: "AEO", l: "Certified" },
  ].slice(0, 4);

  return (
    <section
      className="relative w-full overflow-hidden bg-navy-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((sl, idx) => (
        <div key={idx} className="absolute inset-0 transition-opacity [transition-duration:1400ms]" style={{ opacity: idx === i ? 1 : 0 }}>
          {typeof sl.image === "string" && sl.image.startsWith("/logos/") ? (
            (() => {
              const path = sl.image.replace(/^\//, ""); // logos/logistic1.jpg
              const name = path.split("/").pop().replace(/\.[^.]+$/, "");
              const base = `/logos/${name}`;
              const isJpg = path.toLowerCase().endsWith(".jpg") || path.toLowerCase().endsWith(".jpeg");

              if (isJpg) {
                return (
                  <picture>
                    <source type="image/avif" srcSet={`${base}-lg.avif 1920w, ${base}-md.avif 1280w, ${base}-sm.avif 800w`} />
                    <source type="image/webp" srcSet={`${base}-lg.webp 1920w, ${base}-md.webp 1280w, ${base}-sm.webp 800w`} />
                    <img
                      src={sl.image}
                      alt={sl.overline || ""}
                      className="w-full h-full object-cover"
                      loading={idx === i ? "eager" : "lazy"}
                      fetchPriority={idx === i ? "high" : "auto"}
                      width={1920}
                      height={1280}
                      srcSet={`${base}-lg.webp 1920w, ${base}-md.webp 1280w, ${base}-sm.webp 800w`}
                      sizes="(min-width:1024px) 50vw, 100vw"
                    />
                  </picture>
                );
              }

              return (
                <img
                  src={sl.image}
                  alt={sl.overline || ""}
                  className="w-full h-full object-cover"
                  loading={idx === i ? "eager" : "lazy"}
                  fetchPriority={idx === i ? "high" : "auto"}
                  width={1920}
                  height={1280}
                />
              );
            })()
          ) : (
            <img
              src={sl.image}
              alt={sl.overline || ""}
              className="w-full h-full object-cover"
              loading={idx === i ? "eager" : "lazy"}
              fetchPriority={idx === i ? "high" : "auto"}
              width={1920}
              height={1280}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-navy-900/65 via-navy-900/35 to-navy-900/0 lg:to-transparent" />
        </div>
      ))}

      <div className="relative z-10 container-x pt-16 sm:pt-20 lg:pt-24 pb-32 lg:pb-28 grid lg:grid-cols-12 gap-8 lg:gap-10 items-start lg:items-center min-h-[640px] sm:min-h-[680px] lg:min-h-[720px]">
        <div className="lg:col-span-7">
          <div key={i} className="animate-fade-up">
            <div className="inline-flex items-center gap-2 border border-gold-500/45 px-3 py-1.5 text-[10.5px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-400 mb-6 bg-navy-900/30 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-gold-500" /> {s.overline}
            </div>
            <h1 className="font-display font-extrabold text-white text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.05]">
              {(s.title_lines || []).map((line, idx) => (
                <span key={idx}>{line}<br /></span>
              ))}
              <span className="text-gold-500">{s.title_span}</span>
            </h1>
            <p className="mt-6 text-sm sm:text-base lg:text-lg text-white/75 max-w-xl leading-relaxed">{s.subtitle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/contact" data-testid="hero-cta-contact" className="inline-flex items-center gap-2 bg-gold-500 text-white px-6 py-3.5 text-sm font-semibold tracking-wide hover:bg-gold-600 transition-colors">
                Contact Us <ArrowRight size={16} />
              </Link>
              <Link to="/services" data-testid="hero-cta-services" className="inline-flex items-center gap-2 border-2 border-white/70 text-white px-6 py-3.5 text-sm font-semibold tracking-wide hover:bg-white hover:text-navy-900 transition-colors">
                Our Services
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 w-full">
          <div className="hidden sm:grid grid-cols-2 gap-3">
            {SERVICE_CARDS.map((c, idx) => (
              <div key={idx} data-testid={`hero-service-${idx}`} className="bg-white/[0.07] border border-white/15 backdrop-blur-md p-5 hover:bg-white/12 hover:border-gold-500/40 transition-all group">
                <c.icon size={22} strokeWidth={1.6} className="text-gold-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-semibold text-white text-sm leading-tight">{c.t}</h3>
                <p className="mt-1.5 text-[11.5px] text-white/65 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="container-x pb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2" data-testid="hero-slider-dots">
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} data-testid={`hero-dot-${idx}`}
                className={`h-1 transition-all ${idx === i ? "w-10 bg-gold-500" : "w-4 bg-white/30 hover:bg-white/60"}`} />
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={prev} aria-label="Previous" data-testid="hero-prev" className="w-9 h-9 border border-white/25 text-white hover:bg-gold-500 hover:border-gold-500 transition-colors flex items-center justify-center"><ChevronLeft size={16} /></button>
            <button onClick={next} aria-label="Next" data-testid="hero-next" className="w-9 h-9 border border-white/25 text-white hover:bg-gold-500 hover:border-gold-500 transition-colors flex items-center justify-center"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div className="bg-navy-950/85 backdrop-blur border-t border-white/10">
          <div className="container-x grid grid-cols-4">
            {kpiStrip.map((k, idx) => (
              <div key={idx} className="py-4 px-3 text-center sm:text-left border-r border-white/10 last:border-r-0" data-testid={`hero-kpi-${idx}`}>
                <div className="font-display font-extrabold text-base sm:text-xl lg:text-2xl text-gold-500 tracking-tight">{k.v}</div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-white/55 mt-0.5">{k.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function formatStat(v) {
  if (typeof v !== "number") return v;
  if (v >= 1000) return v.toLocaleString();
  return v % 1 === 0 ? v : v.toFixed(1);
}
