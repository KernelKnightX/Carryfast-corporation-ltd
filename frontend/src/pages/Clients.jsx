import { ShieldCheck, Brain, Headphones } from "lucide-react";
import SEO from "@/components/SEO";
import PageHero from "@/components/PageHero";

const CLIENTS = [
  "Bridgestone India Pvt Ltd", "LiuGong India Pvt Ltd", "HEG Ltd", "Tata International Ltd",
  "L&T", "Mahle India", "Siemens", "WOHR", "Mahindra Automobile", "Swara Baby Products Ltd",
  "CNH Industrial", "Kirloskar", "Force Trucks", "Awasa", "O2 Power",
  "Bharat Energy Pvt Ltd", "Solis Hygiene Pvt Ltd", "Shivani Detergents Pvt Ltd", "Ralson", "Caparo",
];

const INDUSTRIES = [
  "Industrial Equipment & Machinery", "Heavy-Duty Mining Equipment", "Automotive & Components",
  "Chemicals & Petrochemicals", "Energy & Renewables (Solar)", "Consumer & Hygiene Goods",
  "Electrical & Electronics", "Tyres & Rubber", "Food & Confectionery", "Leather & Apparel",
  "Paper Industry", "Graphite Electrodes", "Calcined Petroleum Coke", "Furniture", "Trading & General Cargo",
];

const TRUST = [
  { icon: ShieldCheck, t: "Reliability", d: "Clients do not need to monitor our work to be confident it is being done correctly. Documentation is filed on time, shipment status is communicated proactively, and the same standard of service applies to every consignment — whether it is a single container or a hundred. Long-term clients remain with us because the experience of working with Carry Fast is consistent and predictable." },
  { icon: Brain, t: "Expertise", d: "Thirty years of clearance work across 15 industries means our team has encountered most of the classification disputes, examination patterns, and compliance conditions that arise in Indian customs. We do not learn on the client's shipment. When a new import condition is notified or an anti-dumping investigation affects a product our clients import, we know before they do — and we inform them." },
  { icon: Headphones, t: "Support", d: "Customs problems do not always arise during business hours. When an examination is called at short notice, when a port query arrives on a Friday evening, or when a consignment is held pending a missing document, the client needs a team that responds immediately. Our clients have direct access to the people handling their clearances — not a call centre or a ticketing system." },
];

const LOGO_FILE_MAP = {
  "Bridgestone India Pvt Ltd": "Bridgestone India Pvt Ltd.png",
  "LiuGong India Pvt Ltd": "LiuGong India Pvt Ltd.png",
  "HEG Ltd": "HEG Ltd.png",
  "Tata International Ltd": "Tata International Ltd.png",
  "L&T": "L&T.png",
  "Mahle India": "Mahle India.png",
  "Siemens": "Siemens.png",
  "WOHR": "WOHR.png",
  "Mahindra Automobile": "Mahindra.png",
  "Swara Baby Products Ltd": "Swara Baby Products Ltd.png",
  "CNH Industrial": "CNH.png",
  "Kirloskar": "Kirloskar.png",
  "Force Trucks": "ForceTRUCK.png",
  "Awasa": "Awasa.png",
  "O2 Power": "O2 Power.png",
  "Bharat Energy Pvt Ltd": "Bharat Energy Pvt Ltd.png",
  "Solis Hygiene Pvt Ltd": "Solis Hygiene Pvt Ltd.png",
  "Shivani Detergents Pvt Ltd": "Shivani Detergents Pvt Ltd.png",
  "Ralson": "Ralson.png",
  "Caparo": "Caparo.png",
};

export default function Clients() {
  return (
    <>
      <SEO
        title="Our Clients — Trusted by Leading Indian Importers & Exporters | Carry Fast"
        description="Bridgestone, LiuGong, HEG, Tata International, L&T, Siemens, Mahindra, Kirloskar — leading Indian businesses trust Carry Fast Corporation for customs clearance."
        keywords="customs broker clients India, Bridgestone customs broker, Tata customs clearance, Siemens India customs, industrial customs broker Indore"
      />

      <PageHero
        label="Our Clients"
        title={<>In <span className="text-gold-500">good company.</span></>}
        subtitle="Carry Fast Corporation has worked with some of India's most demanding importers and exporters — from Bridgestone and Tata International to Siemens, Mahindra and Kirloskar — across manufacturing, energy, automotive and trading."
        image="https://images.pexels.com/photos/4487383/pexels-photo-4487383.jpeg"
        breadcrumbs={[{ to: "/", label: "Home" }, { label: "Our Clients" }]}
        badges={[
          { label: "20+", sub: "Marquee Clients" },
          { label: "15", sub: "Industries Represented" },
          { label: "7+ Years", sub: "Average Tenure" },
          { label: "B2B Only", sub: "Enterprise Focus" },
        ]}
      />

      {/* Companies */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mb-12 max-w-3xl">
            <div className="text-overline mb-5">Companies We Serve</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-navy-900 leading-tight">Companies We Serve</h2>
            <p className="mt-6 text-slate-600 leading-relaxed">
              Carry Fast Corporation has worked with some of India's most demanding importers and exporters across manufacturing, energy, automotive, and trading industries. The following companies have trusted us with their customs clearance operations.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px bg-slate-200 border border-slate-200">
            {CLIENTS.map((name, i) => {
              const logoFile = LOGO_FILE_MAP[name];
              const logoSrc = logoFile ? encodeURI(`/logos/${logoFile}`) : null;
              const initialsStyle = logoSrc ? { display: 'none' } : undefined;
              return (
                <div key={i} data-testid={`full-client-${i}`} className="bg-white p-8 flex flex-col items-center justify-center text-center min-h-[140px] hover:bg-slate-50 transition-colors group">
                  <div className="mb-3 min-h-[48px] flex items-center justify-center">
                    {logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={name}
                        className="max-h-12 max-w-full object-contain"
                        onLoad={(e) => {
                          const initials = e.currentTarget.nextElementSibling;
                          if (initials) initials.style.display = 'none';
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const initials = e.currentTarget.nextElementSibling;
                          if (initials) initials.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="w-12 h-12 border-2 border-gold-500 flex items-center justify-center text-center group-hover:bg-gold-500 transition-colors"
                      style={initialsStyle}
                    >
                      <span className="font-display font-extrabold text-gold-500 group-hover:text-white text-sm">
                        {name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                  </div>
                  <div className="font-semibold text-xs text-navy-900 leading-tight">{name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries Represented */}
      <section className="section-y bg-slate-50">
        <div className="container-x">
          <div className="mb-12 max-w-3xl">
            <div className="text-overline mb-5">Industries Represented</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-navy-900 leading-tight">Industries Represented</h2>
            <p className="mt-6 text-slate-600 leading-relaxed">
              Our client base spans 15 industries, each with distinct customs requirements, import conditions, and documentation standards.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INDUSTRIES.map((it, i) => (
              <div key={i} data-testid={`client-industry-${i}`} className="bg-white border border-slate-200 p-5 hover:border-gold-500 transition-colors flex items-center gap-4">
                <span className="font-mono text-xs text-gold-500">0{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                <span className="font-semibold text-sm text-navy-900">{it}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Trust */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mb-12">
            <div className="text-overline mb-5">Why Clients Trust Us</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-navy-900">Why Clients Trust Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TRUST.map((c, i) => (
              <div key={i} data-testid={`trust-${i}`} className="bg-white border border-slate-200 p-8 hover:border-gold-500 transition-colors">
                <c.icon size={30} className="text-gold-500" strokeWidth={1.6} />
                <h3 className="mt-6 font-display font-bold text-xl text-navy-900">{c.t}</h3>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
