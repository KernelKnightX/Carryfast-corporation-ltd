import { useState } from "react";
import { useSiteConfig } from "@/contexts/SiteConfigContext";
import { resolveAssetUrl } from "@/lib/assets";

export const Logo = ({
  inverted = false,
  size = "default",
  showText = true,
  height,
  width,
  className = "",
  logoClassName = "",
  textClassName = "",
  gapClassName = "gap-2",
}) => {
  const cfg = useSiteConfig();
  const [failed, setFailed] = useState(false);

  const defaultLogo = "/logos/CFC Logo Only-Photoroom.png";
  const invertedLogo = "/logos/CFC Logo Reverse (1).png";

  const configuredUrl = inverted
    ? cfg.company?.logo_url_inverted || invertedLogo
    : cfg.company?.logo_url || defaultLogo;

  const fallbackUrl = inverted ? invertedLogo : defaultLogo;
  const url = failed ? fallbackUrl : resolveAssetUrl(configuredUrl);

  const defaultSizeClass =
    !height && !width
      ? size === "lg"
        ? "h-14"
        : size === "sm"
        ? "h-9"
        : "h-11"
      : "";

  const textSizeClass =
    size === "lg"
      ? "text-lg sm:text-xl"
      : size === "sm"
      ? "text-xs sm:text-sm"
      : "text-sm sm:text-base";

  const style = {
    ...(height ? { height } : {}),
    ...(width ? { width } : {}),
  };

  return (
    <a
      href="/"
      data-testid="brand-logo"
      className={`flex items-center ${gapClassName} ${className}`}
    >
      {url ? (
        <img
          src={url}
          alt={cfg.company?.name || "Company Logo"}
          style={style}
          loading="eager"
          className={`${defaultSizeClass} ${
            !width ? "w-auto" : ""
          } object-contain ${logoClassName}`}
          onError={() => {
            if (url !== fallbackUrl) setFailed(true);
          }}
        />
      ) : (
        <div
          style={style}
          className={`${defaultSizeClass} aspect-square border-2 flex items-center justify-center font-bold ${
            inverted
              ? "border-white text-white"
              : "border-navy-900 text-navy-900"
          }`}
        >
          CFC
        </div>
      )}

      {showText && (
        <span
          className={`whitespace-nowrap font-semibold ${
            inverted ? "text-white" : "text-navy-900"
          } ${textSizeClass} ${textClassName}`}
        >
          {cfg.company?.name || "Carry Fast Corporation"}
        </span>
      )}
    </a>
  );
};