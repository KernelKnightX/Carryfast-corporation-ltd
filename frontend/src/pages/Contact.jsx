import { Phone, Mail, MapPin, Clock, MessageSquare, Globe, AlertCircle } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import SEO from "@/components/SEO";
import PageHero from "@/components/PageHero";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

const INFO_CARDS = [
  { icon: MessageSquare, t: "Response Time", d: "All enquiries received during working hours are responded to the same day. Messages received outside working hours are addressed the following business morning." },
  { icon: Globe, t: "Service Area", d: "We provide customs clearance services across all major ports, airports, ICDs, and CFS locations in India. Our head office is in Indore, and our operational reach covers pan-India customs clearance." },
  { icon: AlertCircle, t: "Special Requests", d: "For time-critical shipments, first-time imports of regulated products, or consignments requiring advance compliance review, contact us directly by phone before the cargo arrives. Early coordination prevents clearance delays." },
];

const OFFICE_MAP_QUERY = "22.717449,75.872055";

export default function Contact() {
  const cfg = useSiteConfig();
  const c = cfg.contact || {};
  const heroImage = cfg.page_heroes?.contact?.image || "/logos/contact us.jpg";
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(OFFICE_MAP_QUERY)}`;
  return (
    <>
      <SEO
        title="Contact Carry Fast Corporation | Customs Clearance Indore"
        description="Talk to our customs clearance team in Indore. Phone +91 731 2524079, +91 9300077018. Email info@carryfastcorp.com. We respond within one business day."
        keywords="contact customs broker Indore, customs clearance enquiry India, Carry Fast contact"
      />

      <PageHero
        label="Contact Us"
        title={<>Get in <span className="text-gold-500">touch.</span></>}
        subtitle="Talk to our customs clearance team directly. For general enquiries use the form below. For time-sensitive shipments, examinations or port queries — call us straight away."
        image={heroImage}
        breadcrumbs={[{ to: "/", label: "Home" }, { label: "Contact Us" }]}
      />

      {/* Contact Information + Map */}
      <section className="section-y bg-white">
        <div className="container-x grid md:grid-cols-2 gap-10">
          <div>
            <div className="text-overline mb-5">Contact Information</div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-navy-900 leading-tight">Reach our team directly.</h2>

            <div className="mt-10 space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-navy-900 flex items-center justify-center shrink-0"><Phone size={20} className="text-gold-500" /></div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500 mb-1">Phone</div>
                  <a href={`tel:${c.phone_primary.replace(/\s+/g, "")}`} className="block text-navy-900 font-semibold hover:text-gold-500">{c.phone_primary}</a>
                  <a href={`tel:${c.phone_secondary.replace(/\s+/g, "")}`} className="block text-navy-900 font-semibold hover:text-gold-500">{c.phone_secondary}</a>
                  <div className="text-xs text-slate-500 mt-1">General enquiries and shipment coordination</div>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 bg-navy-900 flex items-center justify-center shrink-0"><AlertCircle size={20} className="text-gold-500" /></div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500 mb-1">Direct Contact — Immediate Assistance</div>
                  <a href={`tel:${c.phone_direct.replace(/\s+/g, "")}`} className="block text-navy-900 font-semibold hover:text-gold-500">{c.phone_direct}</a>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 bg-navy-900 flex items-center justify-center shrink-0"><Mail size={20} className="text-gold-500" /></div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500 mb-1">Email</div>
                  <a href={`mailto:${c.email}`} className="text-navy-900 font-semibold hover:text-gold-500" data-testid="contact-email-link">{c.email}</a>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 bg-navy-900 flex items-center justify-center shrink-0"><MapPin size={20} className="text-gold-500" /></div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500 mb-1">Office Address</div>
                  <div className="text-navy-900 leading-relaxed">{c.address_line_1}<br />{c.address_line_2}<br />{c.address_line_3}</div>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 bg-navy-900 flex items-center justify-center shrink-0"><Clock size={20} className="text-gold-500" /></div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500 mb-1">Working Hours</div>
                  <div className="text-navy-900">{c.working_hours}</div>
                </div>
              </div>
              {cfg.social && (cfg.social.instagram || cfg.social.facebook || cfg.social.linkedin) && (
                <div className="flex flex-wrap gap-3 mt-8">
                  {cfg.social.instagram && (
                    <a href={cfg.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:text-gold-500">
                      Instagram
                    </a>
                  )}
                  {cfg.social.facebook && (
                    <a href={cfg.social.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:text-gold-500">
                      Facebook
                    </a>
                  )}
                  {cfg.social.linkedin && (
                    <a href={cfg.social.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:text-gold-500">
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="h-[560px] border border-slate-200">
            <iframe
              title="Carry Fast Corporation Office Location — Indore"
              src={`https://www.google.com/maps?q=${encodeURIComponent(OFFICE_MAP_QUERY)}&z=17&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              data-testid="contact-map"
            />
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sr-only"
            >
              Open Carry Fast Corporation on Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-y bg-slate-50">
        <div className="container-x grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="text-overline mb-5">General Enquiries</div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-navy-900 leading-tight">Send Us a Message</h2>
            <p className="mt-6 text-slate-600 leading-relaxed">
              Use this form for general enquiries, new client queries, or documentation questions. Our team responds within one business day.
            </p>
          </div>
          <div className="md:col-span-7 bg-white p-8 md:p-10 border border-slate-200">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mb-12">
            <div className="text-overline mb-5">What to Expect</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-navy-900">Get In Touch</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {INFO_CARDS.map((c, i) => (
              <div key={i} data-testid={`expect-${i}`} className="bg-white border border-slate-200 p-8 hover:border-gold-500 transition-colors">
                <c.icon size={28} className="text-gold-500" strokeWidth={1.6} />
                <h3 className="mt-6 font-display font-bold text-xl text-navy-900">{c.t}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Immediate Assistance */}
      <section className="bg-navy-900 text-white py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container-x relative text-center max-w-3xl">
          <div className="text-overline mb-5">Need Immediate Assistance?</div>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">For urgent customs matters,</h2>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-gold-500">call us directly.</h2>
          <p className="mt-6 text-white/75 leading-relaxed">
            For examinations, holds, port queries, or time-sensitive clearances, please reach out by phone — the team handling your shipment will respond immediately.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a href={`tel:${c.phone_urgent.replace(/\s+/g, "")}`} className="inline-flex items-center gap-3 bg-gold-500 text-white px-7 py-4 text-sm font-semibold hover:bg-gold-600 transition-colors" data-testid="urgent-call-btn">
              <Phone size={16} /> {c.phone_urgent}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
