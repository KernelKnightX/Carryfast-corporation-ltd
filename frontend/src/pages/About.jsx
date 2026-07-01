import { ShieldCheck, Zap, CircleCheckBig, Users } from "lucide-react";
import SEO from "@/components/SEO";
import PageHero from "@/components/PageHero";

const VALUES = [
  { icon: ShieldCheck, t: "Reliability", d: "Every shipment receives the same standard of attention, whether it is a routine consignment or a time-critical cargo. Clients should never need to follow up twice on the same issue." },
  { icon: Zap, t: "Speed", d: "Documentation is processed promptly, filings are made without lag, and examination requests are attended to immediately. A 99.5% on-time clearance rate is not a claim — it is the result of this discipline applied consistently." },
  { icon: CircleCheckBig, t: "Accountability", d: "When something goes wrong in a clearance — and occasionally it does — we identify the issue, communicate directly, and resolve it. Clients work with a team that takes responsibility." },
];

const LEADERS = [
  {
    name: "Anurag Vijayvargiya",
    role: "F Card Holder · Partner",
    image: "/logos/AnuragV.png",
    titles: ["President, ICBA (Indian Customs Brokers Association)", "Ex Vice Chairman, FFFAI (Federation of Freight Forwarders' Associations in India)"],
    bio: "Anurag Vijayvargiya is an F Card holder and one of the most recognised figures in India's customs clearance industry. He currently serves as President of the Indian Customs Brokers Association (ICBA) and previously served as Vice Chairman of the Federation of Freight Forwarders' Associations in India (FFFAI). His involvement in policy-level industry bodies gives Carry Fast access to regulatory developments ahead of formal notification.",
  },
  {
    name: "Abhay Nilosey",
    role: "F Card Holder · Partner",
    image: "/logos/Abhaynilose.png",
    titles: ["Operations Leadership · Founding Team"],
    bio: "Abhay Nilosey holds an F Card customs licence and has been a core part of Carry Fast Corporation's operations since its founding. He oversees day-to-day customs clearance operations and brings three decades of practical experience in handling complex import and export consignments across industries.",
  },
];

export default function About() {
  return (
    <>
      <SEO
        title="About Carry Fast Corporation | 30 Years of Customs Clearance in India"
        description="Established in Indore in 1995. AEO-certified customs intermediary handling 12,000+ shipments annually. Meet the leadership — Anurag Vijayvargiya (President ICBA) and Abhay Nilosey."
        keywords="Carry Fast Corporation Indore, customs broker Madhya Pradesh, ICBA, FFFAI, AEO certified, F card customs license"
      />

      <PageHero
        label="About Us"
        title={<>Three decades. <span className="text-gold-500">One trusted name in customs.</span></>}
        subtitle="Established in Indore in 1995, Carry Fast Corporation has grown into one of central India's most experienced customs clearance firms — handling more than 12,000 shipments every year across India's major ports, airports, ICDs and CFS locations."
        image="/logos/aboutus.jpg"
        breadcrumbs={[{ to: "/", label: "Home" }, { label: "About Us" }]}
      />

      {/* Who We Are */}
      <section className="section-y bg-white">
        <div className="container-x grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-7">
            <div className="text-overline mb-5">Who We Are</div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-tight text-navy-900 mb-6">Established in Indore. Trusted across India.</h2>
            <div className="space-y-5 text-slate-700 text-base leading-relaxed">
              <p>
                Carry Fast Corporation was established in Indore in 1995. For thirty years, we have provided customs clearance services to importers, exporters, manufacturers, and trading companies across India. What started as a small customs clearance operation has grown into one of central India's most established clearance firms, handling more than 12,000 containers and shipments every year across all major ports, airports, ICDs, and CFS locations in the country.
              </p>
              <p>
                We are AEO-certified by Indian Customs — MP's only AEO-certified customs intermediary — and have been recognised by CONCOR as <strong>Best Customs Broker every year since 1997</strong>.
              </p>
              <p>
                We have also been honoured with the Samman Patra Award by the Ministry of Finance, Government of India, and have been recognised by Container Corporation of India (CONCOR) as Best Customs Broker every year since 1997. These recognitions reflect the consistency, compliance standards, and operational discipline that have defined our work over the years.
              </p>
              <p>
                To support clients across the country, we also work with a network of trusted associate partners who are equally equipped with experienced teams and operational infrastructure, enabling us to provide customs clearance services across all major ports, airports, ICDs, and CFS locations in India.
              </p>
              <p>
                Our team of 40+ employees works across customs clearance, documentation, trade compliance, and client operations. The leadership team holds F Card licences and is actively involved in industry bodies, including the ICBA and FFFAI. Our clients include some of India's most demanding importers across machinery, automobiles, chemicals, energy, and consumer goods.
              </p>
            </div>
          </div>
          <div className="md:col-span-5">
            <img src="/logos/ABT.png" alt="Indian customs and logistics operations" className="w-full h-[460px] object-cover" />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-y bg-slate-50">
        <div className="container-x grid md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
          <div className="bg-white p-10 md:p-12" data-testid="mission-card">
            <div className="text-overline mb-5">Mission</div>
            <h3 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-navy-900 leading-tight">Accuracy. Speed. Full Compliance.</h3>
            <p className="mt-6 text-slate-700 leading-relaxed">
              To handle every customs clearance with accuracy, speed, and full regulatory compliance — so that our clients' cargo moves without unnecessary delay and their operations are never interrupted by avoidable customs issues.
            </p>
          </div>
          <div className="bg-white p-10 md:p-12" data-testid="vision-card">
            <div className="text-overline mb-5">Vision</div>
            <h3 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-navy-900 leading-tight">Most reliable customs clearance firm in central India.</h3>
            <p className="mt-6 text-slate-700 leading-relaxed">
              To be the most reliable customs clearance firm in central India — known for consistent service standards, deep regulatory knowledge, and a team that clients trust to handle their clearances without supervision.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mb-12">
            <div className="text-overline mb-5">Our Values</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-navy-900">Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} data-testid={`value-${i}`} className="border border-slate-200 p-8 hover:border-gold-500 transition-colors">
                <v.icon size={30} className="text-gold-500" strokeWidth={1.6} />
                <h3 className="mt-6 font-display font-bold text-xl text-navy-900">{v.t}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-y bg-slate-50">
        <div className="container-x">
          <div className="mb-12">
            <div className="text-overline mb-5">Our Leadership</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-navy-900">Leadership Team</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {LEADERS.map((l, i) => (
              <div key={i} data-testid={`leader-${i}`} className="bg-white border border-slate-200 p-10 hover:border-gold-500 transition-colors">
                <div className="w-20 h-20 bg-navy-900 text-gold-500 flex items-center justify-center font-display font-extrabold text-xl">
                  {l.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <h3 className="mt-6 font-display font-extrabold text-2xl tracking-tight text-navy-900">{l.name}</h3>
                <div className="mt-2 text-xs uppercase tracking-[0.18em] text-gold-500 font-semibold">{l.role}</div>
                <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
                  {l.titles.map((t) => <li key={t} className="flex gap-2"><span className="text-gold-500">→</span>{t}</li>)}
                </ul>
                <p className="mt-6 text-sm text-slate-600 leading-relaxed">{l.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workforce */}
      <section className="section-y bg-slate-50 text-navy-900 relative overflow-hidden">
        <div className="container-x relative grid md:grid-cols-12 gap-10 items-center border border-slate-200 rounded-3xl p-8 md:p-12 bg-white shadow-sm">
          <div className="md:col-span-5">
            <div className="font-display font-extrabold text-7xl md:text-8xl text-gold-500 leading-none">40+</div>
            <div className="text-overline mt-3 text-navy-900">Dedicated Employees</div>
            <div className="text-xs mt-2 text-slate-600">Plus a network of associate partners across India</div>
            <div className="mt-6 flex items-center gap-3 text-sm text-slate-600">
              <Users size={18} className="text-gold-500" />
              <span>Across customs, documentation, compliance & client service</span>
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="text-overline mb-5 text-navy-900">Our Workforce</div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-tight">Long-tenured. Industry-deep.</h2>
            <p className="mt-6 text-slate-700 text-base leading-relaxed">
              Carry Fast Corporation employs 40 people directly across customs clearance, documentation, trade compliance, and client service functions. The team operates across ICEGATE filings, examination coordination, delivery order management, and export documentation.
            </p>
            <p className="mt-4 text-slate-700 text-base leading-relaxed">
              Staff continuity is high — many team members have been with the firm for over a decade, which means clients deal with people who know their cargo history, their importers, and the specific requirements of their industries.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
