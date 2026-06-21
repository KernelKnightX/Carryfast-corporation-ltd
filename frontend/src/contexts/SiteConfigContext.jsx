import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { DEFAULT_POLICIES } from "@/lib/defaultPolicies";

const SiteConfigContext = createContext(null);

// Fallback used only while the first fetch is in-flight; matches backend DEFAULT.
const FALLBACK = {
  company: {
    name: "Carry Fast Corporation",
    short: "Carry Fast",
    tagline: "Custom Broker · Est. 1995",
    logo_url: "/CFC_Logo-removebg-preview.png",
  },
  contact: {
    phone_primary: "+91 731 2524079",
    phone_secondary: "+91 731 4006969",
    phone_direct: "+91 9300077025",
    phone_urgent: "+91 9300077018",
    whatsapp_number: "919300077018",
    email: "info@carryfastcorp.com",
    address_line_1: "502, A Block, Corporate House",
    address_line_2: "169 R.N.T. Marg, Indore — 452 001",
    address_line_3: "Madhya Pradesh, India",
    working_hours: "Monday – Saturday · 10:30 AM – 6:30 PM",
    map_query: "Corporate House 169 RNT Marg Indore",
  },
  stats: [
    { value: 30, suffix: "+", label: "Years of Experience", sub: "Handling customs clearance across changing regulations, port procedures, and trade policy since 1995." },
    { value: 12000, suffix: "+", label: "Containers & Shipments Annually", sub: "High-volume capability across air and sea cargo, covering diverse industries and cargo categories." },
    { value: 99.5, suffix: "%", label: "On-Time Clearance Rate", sub: "Documentation accuracy and procedural knowledge translate directly to clearances that do not get held up." },
  ],
  hero_slides: [
    {
      image: "https://images.pexels.com/photos/9806482/pexels-photo-9806482.jpeg",
      overline: "Customs Clearance · Since 1995",
      title_lines: ["Customs Clearance.", "Backed by 30 Years"],
      title_span: "of Operations.",
      subtitle: "India's import and export procedures are detailed, time-sensitive, and constantly evolving. Carry Fast Corporation has managed this process for Indian businesses since 1995.",
    },
    {
      image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866",
      overline: "AEO Certified · Indian Customs",
      title_lines: ["The Only AEO-Certified", "Customs Intermediary"],
      title_span: "in Madhya Pradesh.",
      subtitle: "AEO certification by Indian Customs — audited for compliance, financial soundness and operational reliability. Our clients work with a partner whose standards are independently verified.",
    },
    {
      image: "https://images.unsplash.com/photo-1605745341112-85968b19335b",
      overline: "12,000+ Shipments · 99.5% On-Time",
      title_lines: ["Cargo clears.", "Operations"],
      title_span: "never wait.",
      subtitle: "Bill of Entry filed the same day. Examination handled at the port by our team. Documentation pre-validated before submission. A 99.5% on-time rate maintained year after year.",
    },
    {
      image: "https://images.pexels.com/photos/4487383/pexels-photo-4487383.jpeg",
      overline: "CONCOR Best Customs Broker · Since 1997",
      title_lines: ["Recognised by CONCOR", "every year"],
      title_span: "since 1997.",
      subtitle: "An unbroken record of recognition across nearly three decades — awarded annually by Container Corporation of India for consistent operational performance.",
    },
  ],
  testimonials: {
    heading: "What Our Clients Say",
    subtitle: "Client feedback from importers and exporters who trust Carry Fast for customs clearance and trade compliance.",
    items: [
      { quote: "We have worked with Carry Fast for several years across imports of machinery and industrial equipment. Their team understands customs requirements thoroughly and consistently delivers timely clearances.", author: "— Client Name", company: "Company" },
      { quote: "Carry Fast has been a dependable customs partner for our business. Documentation is handled accurately, communication is prompt, and shipment status is always clear.", author: "— Client Name", company: "Company" },
      { quote: "Their knowledge of customs procedures has helped us avoid unnecessary delays on multiple shipments. We value their practical approach and responsiveness.", author: "— Client Name", company: "Company" },
      { quote: "We handle regular imports through multiple ports, and Carry Fast has consistently maintained the same level of service and attention to detail across every shipment.", author: "— Client Name", company: "Company" },
      { quote: "The team understands the urgency of commercial cargo. Whenever issues arise, they work quickly to resolve them and keep the clearance process moving.", author: "— Client Name", company: "Company" },
      { quote: "Carry Fast combines experience with accountability. Their guidance on documentation and compliance has been valuable to our import operations.", author: "— Client Name", company: "Company" },
      { quote: "Professional, responsive, and reliable. Their team has supported our customs clearance requirements efficiently and continues to be a trusted logistics partner.", author: "— Client Name", company: "Company" },
    ],
  },
  footer: { tagline: "", since: "Serving Indian Trade Since 1995" },
  social: {},
  policies: DEFAULT_POLICIES,
};

export const SiteConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(FALLBACK);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/site-config");
      setConfig({
        ...FALLBACK,
        ...data,
        contact: { ...FALLBACK.contact, ...(data.contact || {}) },
        company: { ...FALLBACK.company, ...(data.company || {}) },
        testimonials: { ...FALLBACK.testimonials, ...(data.testimonials || {}) },
        policies: { ...FALLBACK.policies, ...(data.policies || {}) },
      });
    } catch {
      // keep fallback
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <SiteConfigContext.Provider value={{ config, loaded, refresh }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const ctx = useContext(SiteConfigContext);
  return ctx ? ctx.config : FALLBACK;
};

export const useSiteConfigCtx = () => useContext(SiteConfigContext);
