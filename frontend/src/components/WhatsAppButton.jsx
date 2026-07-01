import { MessageCircle } from "lucide-react";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

export default function WhatsAppButton() {
  const cfg = useSiteConfig();
  const num = cfg.contact?.whatsapp_number;
  if (!num) return null;
  const url = `https://wa.me/${num}?text=${encodeURIComponent(`Hi ${cfg.company?.short || "Carry Fast"}, I'd like to know more about your services.`)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-float-btn"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-40 group flex items-center justify-center bg-[#25D366] text-white p-4 shadow-xl hover:shadow-2xl transition-all rounded-full hover:translate-y-[-2px]"
    >
      <MessageCircle size={22} strokeWidth={2.2} />
    </a>
  );
}
