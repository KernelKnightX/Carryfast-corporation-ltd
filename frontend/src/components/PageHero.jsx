import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getOptimizedLogoAsset, resolveAssetUrl } from "@/lib/assets";

/**
 * Compact, image-driven hero for inner pages. Not a giant solid box.
 * Props:
 *   label       — small overline (e.g. "About Us")
 *   title       — main heading (string or JSX)
 *   subtitle    — short paragraph under title
 *   image       — right-side image URL
 *   breadcrumbs — [{ to, label }] — final item is the current page
 *   badges      — optional [{ label, sub }] for a bottom strip
 */
export default function PageHero({ label, title, subtitle, image, breadcrumbs = [], badges = [] }) {
  const optimizedLogo = getOptimizedLogoAsset(image);

  return (
    <section className="relative bg-navy-900 text-white overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-25" />
      {image && (
        <div className="absolute inset-0 pointer-events-none">
          {optimizedLogo ? (
            <picture className="block w-full h-full">
              <source type="image/avif" srcSet={`${optimizedLogo.base}-lg.avif 1920w, ${optimizedLogo.base}-md.avif 1280w, ${optimizedLogo.base}-sm.avif 800w`} />
              <source type="image/webp" srcSet={`${optimizedLogo.base}-lg.webp 1920w, ${optimizedLogo.base}-md.webp 1280w, ${optimizedLogo.base}-sm.webp 800w`} />
              <img
                src={optimizedLogo.src}
                alt=""
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                width={1920}
                height={1280}
                srcSet={`${optimizedLogo.base}-lg.webp 1920w, ${optimizedLogo.base}-md.webp 1280w, ${optimizedLogo.base}-sm.webp 800w`}
                sizes="(min-width:1024px) 50vw, 100vw"
              />
            </picture>
          ) : (
            <img
              src={resolveAssetUrl(image)}
              alt=""
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              width={1920}
              height={1280}
            />
          )}
          {/* stronger black fade on left so text stays visible against the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/00 to-transparent" />
        </div>
      )}

      <div className="relative container-x py-14 md:py-20">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-white/60" data-testid="breadcrumb">
            {breadcrumbs.map((b, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <span key={i} className="flex items-center gap-2">
                  {b.to && !isLast ? (
                    <Link to={b.to} className="hover:text-gold-400 transition-colors">{b.label}</Link>
                  ) : (
                    <span className={isLast ? "text-gold-400" : ""}>{b.label}</span>
                  )}
                  {!isLast && <ChevronRight size={12} className="text-white/30" />}
                </span>
              );
            })}
          </nav>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            {label && <div className="text-overline mb-4">{label}</div>}
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-5 text-base md:text-lg text-white/75 max-w-2xl leading-relaxed">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Recognition strip — gives the hero texture so it doesn't read as empty */}
        {badges.length > 0 && (
          <div className="mt-10 md:mt-14 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border-t border-white/10">
            {badges.map((b, i) => (
              <div key={i} data-testid={`hero-badge-${i}`} className="bg-navy-900/80 backdrop-blur px-5 py-5">
                <div className="font-display font-extrabold text-2xl md:text-3xl text-gold-500 tracking-tight">{b.label}</div>
                <div className="text-[11px] uppercase tracking-[0.15em] text-white/60 mt-1.5">{b.sub}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* thin gold rule at the bottom — small visual hand-off into the page */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold-500 via-gold-400 to-transparent" />
    </section>
  );
}
