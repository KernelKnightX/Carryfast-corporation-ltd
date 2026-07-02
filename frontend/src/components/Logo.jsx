import { useState } from "react";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

export const Logo = ({ inverted = false, size = "default", showText = false, height, width, className = "" }) => {
  const cfg = useSiteConfig();
  const [failed, setFailed] = useState(false);
  const defaultSizeClass = !height && !width ? (size === "lg" ? "h-14" : size === "sm" ? "h-9" : "h-11") : "";
  const defaultLogo = "/logos/MAIN LOGO.png";
  const invertedLogo = "/logos/CFC Logo Reverse (1).png";
  const configuredUrl = inverted
    ? cfg.company?.logo_url_inverted || invertedLogo
    : cfg.company?.logo_url || defaultLogo;
  const fallbackUrl = inverted ? invertedLogo : defaultLogo;
  const url = failed ? fallbackUrl : configuredUrl;
  const style = {
    ...(height ? { height } : {}),
    ...(width ? { width } : {}),
  };

  return (
    <a href="/" data-testid="brand-logo" className={`flex items-center gap-3 group ${className}`}>
      {url ? (
        <img
          src={url}
          alt={`${cfg.company?.name || "Carry Fast"} — ${cfg.company?.tagline || ""}`}
          className={`${defaultSizeClass} ${width ? "" : "w-auto"} object-contain`}
          style={style}
          loading="eager"
          onError={() => {
            if (url !== fallbackUrl) setFailed(true);
          }}
        />
      ) : (
        <div
          style={style}
          className={`${defaultSizeClass} aspect-square border-2 ${inverted ? "border-white text-white" : "border-navy-900 text-navy-900"} flex items-center justify-center font-display font-extrabold tracking-tighter`}
        >
          CFC
        </div>
      )}
      {showText && (
        <span className={`inline text-sm font-semibold ${inverted ? "text-white" : "text-navy-900"}`}>
          {cfg.company?.name || "Carry Fast Corporation"}
        </span>
      )}
    </a>
  );
};
