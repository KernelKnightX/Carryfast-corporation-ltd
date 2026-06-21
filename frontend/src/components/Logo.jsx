import { useSiteConfig } from "@/contexts/SiteConfigContext";

export const Logo = ({ inverted = false, size = "default" }) => {
  const cfg = useSiteConfig();
  const h = size === "lg" ? "h-14" : size === "sm" ? "h-9" : "h-11";
  const url = cfg.company?.logo_url;
  return (
    <a href="/" data-testid="brand-logo" className="flex items-center gap-3 group">
      {url ? (
        <img
          src={url}
          alt={`${cfg.company?.name || "Carry Fast"} — ${cfg.company?.tagline || ""}`}
          className={`${h} w-auto object-contain ${inverted ? "brightness-0 invert" : ""}`}
          loading="eager"
        />
      ) : (
        <div className={`${h} aspect-square border-2 ${inverted ? "border-white text-white" : "border-navy-900 text-navy-900"} flex items-center justify-center font-display font-extrabold tracking-tighter`}>
          CFC
        </div>
      )}
    </a>
  );
};
