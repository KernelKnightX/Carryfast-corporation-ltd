import { Link } from "react-router-dom";
import { ArrowRight, Zap, ShieldCheck, Eye, Users, FileText, FileCheck, BookOpen, Award, Cog, Truck, FlaskConical, Sun, Lightbulb, ShoppingBag, Wrench } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import Counter from "@/components/Counter";
import SEO from "@/components/SEO";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

const WHY = [
  { icon: Zap, t: "Speed", d: "We process documentation and file with customs the same day in most cases. Familiarity with assessment procedures across cargo types and rapid response to queries — a 99.5% on-time clearance rate reflects this consistently." },
  { icon: ShieldCheck, t: "Compliance", d: "Every clearance goes through a documentation check before filing. Tariff classification, duty rates, import restrictions, and licensing requirements are verified against the current regulatory position — not assumed from prior shipments." },
  { icon: Eye, t: "Transparency", d: "Clients are updated at each stage — from document submission to assessment, examination, and final out-of-charge. You know where your shipment stands at all times, and the team handling it is directly reachable." },
  { icon: Users, t: "Trusted by Leading Businesses", d: "From manufacturers to multinational industrial groups, businesses across India rely on Carry Fast for customs clearance. Repeat clients, not one-off shipments, are what three decades in this business actually look like." },
];

const SERVICES_PREVIEW = [
  { icon: FileText, t: "Customs Documentation", d: "Complete preparation and filing of import and export documentation, including Bill of Entry, Shipping Bill, Certificate of Origin, and all supporting submissions required for clearance." },
  { icon: FileCheck, t: "Customs Clearance", d: "End-to-end customs clearance for air and sea shipments across all major ports, airports, ICDs, and CFS locations in India. We manage the entire process from document filing through to cargo release." },
  { icon: BookOpen, t: "Trade Compliance", d: "Ongoing monitoring of customs notifications, DGFT circulars, and import-export policy updates. We apply current regulatory requirements to your shipments and advise on licensing, restrictions, and compliance obligations." },
];

const STATS_FALLBACK = [
  { value: 30, suffix: "+", label: "Years of Experience", sub: "Handling customs clearance across changing regulations, port procedures, and trade policy since 1995." },
  { value: 12000, suffix: "+", label: "Containers & Shipments Annually", sub: "High-volume capability across air and sea cargo, covering diverse industries and cargo categories." },
  { value: 99.5, suffix: "%", label: "On-Time Clearance Rate", sub: "Documentation accuracy and procedural knowledge translate directly to clearances that do not get held up." },
];

const ACCREDITATIONS = [
  { t: "AEO Certified", sub: "Authorised Economic Operator", d: "AEO certification from Indian Customs — MP's Only AEO-Certified Customs Intermediary. Recognises verified compliance standards, financial soundness, and operational reliability." },
  { t: "Samman Patra Award", sub: "Ministry of Finance, Govt. of India", d: "Awarded for outstanding contribution to the EXIM fraternity. Conferred on firms that maintain high standards of compliance, accuracy, and professional conduct." },
  { t: "CONCOR Best Customs Broker", sub: "Recognised Every Year Since 1997", d: "Container Corporation of India (CONCOR) has recognised Carry Fast Corporation as its Best Customs Broker annually since 1997 — an unbroken record across nearly three decades." },
];

const INDUSTRY_TILES = [
  { icon: Cog, t: "Industrial Equipment & Machinery" },
  { icon: Truck, t: "Automotive & Components" },
  { icon: FlaskConical, t: "Chemicals & Petrochemicals" },
  { icon: Sun, t: "Energy & Renewables" },
  { icon: ShoppingBag, t: "Consumer & Hygiene Goods" },
  { icon: Lightbulb, t: "Electrical & Electronics" },
  { icon: Wrench, t: "Food & Confectionery" },
];

const CLIENT_TOP = ["Bridgestone India", "LiuGong India", "HEG Ltd", "Tata International", "L&T", "Mahle India", "Siemens"];

const CLIENT_LOGO_FILE_MAP = {
  "Bridgestone India": "Bridgestone India Pvt Ltd.png",
  "LiuGong India": "LiuGong India Pvt Ltd.png",
  "HEG Ltd": "HEG Ltd.png",
  "Tata International": "Tata International Ltd.png",
  "L&T": "L&T.png",
  "Mahle India": "Mahle India.png",
  "Siemens": "Siemens.png",
};

const TESTIMONIALS_FALLBACK = [
  { quote: "We have worked with Carry Fast for several years across imports of machinery and industrial equipment. Their team understands customs requirements thoroughly and consistently delivers timely clearances.", author: "— Client Name", company: "Company" },
  { quote: "Carry Fast has been a dependable customs partner for our business. Documentation is handled accurately, communication is prompt, and shipment status is always clear.", author: "— Client Name", company: "Company" },
  { quote: "Their knowledge of customs procedures has helped us avoid unnecessary delays on multiple shipments. We value their practical approach and responsiveness.", author: "— Client Name", company: "Company" },
  { quote: "We handle regular imports through multiple ports, and Carry Fast has consistently maintained the same level of service and attention to detail across every shipment.", author: "— Client Name", company: "Company" },
  { quote: "The team understands the urgency of commercial cargo. Whenever issues arise, they work quickly to resolve them and keep the clearance process moving.", author: "— Client Name", company: "Company" },
  { quote: "Carry Fast combines experience with accountability. Their guidance on documentation and compliance has been valuable to our import operations.", author: "— Client Name", company: "Company" },
  { quote: "Professional, responsive, and reliable. Their team has supported our customs clearance requirements efficiently and continues to be a trusted logistics partner.", author: "— Client Name", company: "Company" },
];

export default function Home() {
  const cfg = useSiteConfig();
  const stats = (cfg.stats && cfg.stats.length) ? cfg.stats : STATS_FALLBACK;
  const testimonials = (cfg.testimonials?.items && cfg.testimonials.items.length) ? cfg.testimonials.items : TESTIMONIALS_FALLBACK;
  const testimonialsHeading = cfg.testimonials?.heading || "What Our Clients Say";
  const testimonialsSubtitle = cfg.testimonials?.subtitle || "Feedback from clients who rely on our customs clearance, compliance, and documentation support.";
  return (
    <>
      <SEO
        title="Carry Fast Corporation | AEO-Certified Customs Broker in India Since 1995"
        description="AEO-certified customs clearance, import/export documentation and trade compliance across all major Indian ports, airports & ICDs. 30+ years. 99.5% on-time clearance rate."
        keywords="customs broker India, customs clearance Indore, AEO certified customs intermediary, import customs clearance, export customs clearance, trade compliance, Bill of Entry filing, Shipping Bill, DGFT, ICEGATE"
      />
      <HeroSlider />

      {/* Why Choose Carry Fast */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="grid md:grid-cols-12 gap-7 items-end mb-8">
            <div className="md:col-span-7">
              <div className="text-overline mb-5">Why Choose Carry Fast</div>
              <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[1.1] text-navy-900">What Sets Us Apart</h2>
            </div>
            <p className="md:col-span-5 text-slate-600 text-base leading-relaxed">
              Carry Fast has operated through three decades of policy changes, system migrations, and shifting trade regulations. What keeps clients working with us is straightforward: we clear shipments correctly, the first time, on time.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map((w, i) => (
              <div key={i} data-testid={`why-card-${i}`} className="group bg-white border border-slate-200 p-7 hover:border-gold-500 hover:-translate-y-1 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-navy-900 flex items-center justify-center mb-5 group-hover:bg-gold-500 transition-colors">
                  <w.icon size={20} className="text-white" strokeWidth={1.8} />
                </div>
                <h3 className="font-display font-bold text-lg text-navy-900">{w.t}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{w.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/expertise" data-testid="why-cta-expertise" className="inline-flex items-center gap-2 border-2 border-navy-900 text-navy-900 px-6 py-3 text-sm font-semibold hover:bg-navy-900 hover:text-white transition-colors">
              Learn More About Our Expertise <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-y bg-slate-50">
        <div className="container-x">
          <div className="mb-12">
            <div className="text-overline mb-5">Services Overview</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-navy-900">Our Services</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES_PREVIEW.map((s, i) => (
              <div key={i} data-testid={`service-preview-${i}`} className="bg-white border border-slate-200 p-8 hover:border-gold-500 hover:shadow-lg transition-all">
                <s.icon size={28} strokeWidth={1.6} className="text-gold-500" />
                <h3 className="mt-6 font-display font-bold text-xl text-navy-900">{s.t}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/services" data-testid="services-cta" className="inline-flex items-center gap-2 text-navy-900 font-semibold text-sm hover:text-gold-500">
              View All Services <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Experience by Numbers */}
      <section className="section-y bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container-x relative">
          <div className="text-overline mb-5">Experience by Numbers</div>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">Three Decades. Consistent Results.</h2>
          <div className="mt-16 grid md:grid-cols-3 gap-px bg-white/10">
            {stats.slice(0, 3).map((s, i) => (
              <div key={i} data-testid={`stat-${i}`} className="bg-navy-900 p-10">
                <div className="font-display font-extrabold text-6xl md:text-7xl tracking-tight text-gold-500">
                  <Counter end={s.value} suffix={s.suffix || ""} />
                </div>
                <div className="mt-4 font-display font-semibold text-lg">{s.label}</div>
                <p className="mt-3 text-sm text-white/65 leading-relaxed">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mb-12 text-center">
            <div className="text-overline mb-5">Accreditations</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-navy-900">Recognised. Accredited. Accountable.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {ACCREDITATIONS.map((a, i) => (
              <div key={i} data-testid={`accred-${i}`} className="border border-slate-200 p-8 text-center hover:border-gold-500 hover:shadow-lg transition-all">
                <div className="w-20 h-20 mx-auto rounded-full border-4 border-gold-500 flex items-center justify-center mb-6">
                  <Award size={32} className="text-gold-500" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-bold text-xl text-navy-900">{a.t}</h3>
                <div className="text-xs uppercase tracking-[0.18em] text-gold-500 font-semibold mt-2">{a.sub}</div>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">{a.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="section-y bg-slate-50">
        <div className="container-x">
          <div className="mb-12">
            <div className="text-overline mb-5">Industries We Serve</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-navy-900">Industries We Serve</h2>
            <p className="mt-5 text-slate-600 max-w-3xl leading-relaxed">
              We handle customs clearance across a broad range of industries, each with its own classification requirements, licensing conditions, and documentation standards.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-px bg-slate-200 border border-slate-200">
            {INDUSTRY_TILES.map((it, i) => (
              <div key={i} data-testid={`industry-tile-${i}`} className="bg-white p-6 text-center hover:bg-navy-900 hover:text-white transition-colors group">
                <it.icon size={26} className="mx-auto text-gold-500" strokeWidth={1.6} />
                <h4 className="mt-4 font-semibold text-xs leading-snug text-navy-900 group-hover:text-white transition-colors">{it.t}</h4>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/expertise" className="inline-flex items-center gap-2 text-navy-900 font-semibold text-sm hover:text-gold-500" data-testid="industries-cta">
              View All Industries <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Clients We Serve */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mb-12">
            <div className="text-overline mb-5">Clients We Serve</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-navy-900">Trusted By Leading Indian Businesses</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-slate-200 border border-slate-200">
            {CLIENT_TOP.map((c, i) => {
              const logoFile = CLIENT_LOGO_FILE_MAP[c];
              const logoSrc = logoFile ? encodeURI(`/logos/${logoFile}`) : null;
              return (
                <div key={i} data-testid={`client-${i}`} className="bg-white p-6 flex flex-col items-center justify-center text-center min-h-[140px] hover:bg-slate-50 transition-colors group">
                  {logoSrc ? (
                    <img src={logoSrc} alt={c} className="max-h-12 max-w-full object-contain mb-4" />
                  ) : (
                    <span className="font-display font-bold text-sm tracking-tight text-navy-900 mb-4">{c}</span>
                  )}
                  <div className="text-xs text-slate-500">{c}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-10">
            <Link to="/clients" className="inline-flex items-center gap-2 text-navy-900 font-semibold text-sm hover:text-gold-500" data-testid="clients-cta">
              View All Clients <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-y bg-slate-50">
        <div className="container-x">
          <div className="mb-12">
            <div className="text-overline mb-5">Client Testimonials</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-navy-900">{testimonialsHeading}</h2>
            <p className="mt-4 max-w-3xl text-slate-600 leading-relaxed">{testimonialsSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.slice(0, 6).map((item, i) => (
              <div key={i} data-testid={`testimonial-${i}`} className="bg-white border border-slate-200 p-7 relative">
                <div className="font-display font-extrabold text-5xl text-gold-500/30 leading-none mb-3">"</div>
                <p className="text-sm text-navy-900 leading-relaxed">{item.quote}</p>
                <div className="mt-6 pt-5 border-t border-slate-200 text-sm text-navy-900 font-semibold">{item.author}</div>
                {item.company ? <div className="text-xs text-slate-500">{item.company}</div> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-navy-900 text-white py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container-x relative text-center max-w-3xl">
          <div className="text-overline mb-5">Get in touch</div>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">Need Assistance with Customs Clearance?</h2>
          <p className="mt-6 text-white/75 text-base md:text-lg leading-relaxed">
            Our team handles customs clearance, compliance, and documentation for importers and exporters across India. Get in touch to discuss your requirements.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link to="/contact" data-testid="bottom-cta-contact" className="inline-flex items-center gap-2 bg-gold-500 text-white px-7 py-4 text-sm font-semibold hover:bg-gold-600 transition-colors">
              Contact Our Team Today <ArrowRight size={16} />
            </Link>
            <a href={`tel:${(cfg.contact?.phone_urgent || "").replace(/\s+/g, "")}`} className="inline-flex items-center gap-2 bg-gold-500 text-white px-7 py-4 text-sm font-semibold hover:bg-gold-600 transition-colors">
              {cfg.contact?.phone_urgent || "+91 9300077018"}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
