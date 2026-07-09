import { Facebook, Instagram, Linkedin } from "lucide-react";

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

export default function SocialLinks({ social = {}, showUnavailable = false, className = "" }) {
  const socials = [
    { url: social.linkedin, Icon: Linkedin, label: "LinkedIn", className: "bg-[#0A66C2] hover:bg-[#0C66D0]" },
    { url: social.facebook, Icon: Facebook, label: "Facebook", className: "bg-[#1877F2] hover:bg-[#3B82F6]" },
    { url: social.instagram, Icon: Instagram, label: "Instagram", className: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90" },
    { url: social.twitter, Icon: XIcon, label: "X", className: "bg-black hover:bg-slate-800" },
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socials.filter((item) => showUnavailable || item.url).map((item) => (
        <a
          key={item.label}
          href={item.url || "#"}
          target={item.url ? "_blank" : undefined}
          rel={item.url ? "noopener noreferrer" : undefined}
          aria-label={item.label}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${item.className} ${!item.url ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
        >
          <item.Icon size={16} />
        </a>
      ))}
    </div>
  );
}
