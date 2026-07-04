import { Award, Zap, ShieldCheck, Eye, Users, FileText } from "lucide-react";
import SEO from "@/components/SEO";
import PageHero from "@/components/PageHero";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

const INDUSTRIES = [
  {
    t: "Machinery — New and Second-Hand",
    points: [
      "Import classification for capital goods, project machinery, and second-hand equipment under RodTEP and EPCG schemes",
      "End-of-life certifications and valuation requirements for used machinery",
      "Customs examination handling for oversized or high-value equipment",
      "Filing under advance authorisation and EPCG licence conditions where applicable",
    ],
  },
  {
    t: "Heavy-Duty Mining Equipment",
    points: [
      "Clearance of wheel loaders, excavators, drilling rigs, and allied mining machinery",
      "Multiple HSN codes across sub-assemblies — careful classification to avoid mis-declaration disputes",
      "Duty exemption verification for mining-sector imports",
      "Split consignment filings and out-of-gauge cargo handling with port authorities",
    ],
  },
  {
    t: "Automobile & Machinery Components",
    points: [
      "Over 6,000 individual item types handled across automotive and machinery components",
      "OEM parts, aftermarket components, and assembly line sub-assemblies",
      "Eight-digit HSN classification with maintained classification references",
      "Reduced re-assessment disputes and examination frequency for established clients",
    ],
  },
  {
    t: "Personal Care & Hygiene Products",
    points: [
      "Import clearance for detergent powder, diapers, wet wipes and personal care items",
      "BIS compliance coordination & registration management",
      "HSN classification under various raw material and product chapters",
      "Labelling and composition compliance for personal care and hygiene products entering the Indian market",
    ],
  },
  {
    t: "Food & Confectionery",
    points: [
      "Confectionery imports under FSSAI licensing and labelling requirements",
      "Regulatory coordination between customs clearance and FSSAI compliance",
      "Sampling, mandatory declarations & import condition verification",
      "Country-of-origin, health certificates & shelf-life declarations for customs release",
    ],
  },
  {
    t: "Leather & Apparel",
    points: [
      "Import and export clearance for finished leather goods, apparel, and raw leather",
      "Export filings under applicable export promotion schemes",
      "Certificate of Origin and GSP documentation for preferential duty claims",
      "Familiarity with examination patterns at Indian customs for textiles and leather",
    ],
  },
  {
    t: "Tyres & Tyre Raw Materials",
    points: [
      "Complete clearance for tyre imports — finished and raw materials",
      "Natural rubber, synthetic rubber, carbon black & chemical compounds",
      "Anti-dumping duty verification for specific tyre categories",
      "BIS compliance for finished tyre imports & chemical-chapter classification",
    ],
  },
  {
    t: "Chemical Industry",
    points: [
      "Industrial chemicals, specialty chemicals, and chemical intermediates",
      "Restricted-item status & licensing under the Hazardous Chemicals Rules",
      "Anti-dumping investigation tracking and applicability checks",
      "Pre-filing classification and duty-rate verification on chemical consignments",
    ],
  },
  {
    t: "Solar Panels & Modules",
    points: [
      "Import clearance for solar PV modules, panels, inverters, and BOS components",
      "ALMM requirements & Basic Customs Duty tracking on solar equipment",
      "Advisory on applicable exemptions and policy movement",
      "Classification for complete systems and component-level imports",
    ],
  },
  {
    t: "Calcined Petroleum Coke",
    points: [
      "Accurate Chapter 27 classification for CPC imports",
      "Documentation aligned with quality specifications",
      "Reduces mismatches that trigger examination and re-assessment",
      "Reduced examination frequency for repeat CPC importers",
    ],
  },
  {
    t: "Graphite Electrodes",
    points: [
      "Clearance of graphite electrodes and electrode nipples for steel & EAF industries",
      "Specific HSN codes with anti-dumping investigation tracking",
      "Verification of applicable ADD orders and exemptions",
      "Safeguard condition checks before filing — avoiding duty disputes",
    ],
  },
  {
    t: "Paper Industry",
    points: [
      "Paper, paperboard, newsprint, and specialty paper grades",
      "GSM specifications and end-use requirement compliance",
      "Eight-digit HSN classification of paper imports",
      "End-use bond execution and paper-grade examination coordination",
    ],
  },
  {
    t: "LED & Electrical Goods",
    points: [
      "LED fixtures, electrical components, wiring accessories & consumer electrical",
      "Mandatory BIS compliance for notified categories",
      "BIS registration status verification before filing",
      "Documentation for both registered and exempted electrical products",
    ],
  },
  {
    t: "Furniture",
    points: [
      "Wood, metal, and composite material furniture clearance",
      "Phytosanitary conditions and fumigation certificate management",
      "Classification across furniture chapters including knocked-down and garden furniture",
      "BIS registration handling — personal-use imports exempted",
    ],
  },
  {
    t: "Trading & General Cargo",
    points: [
      "Diverse trading items — consumer goods, industrial supplies, spare parts, general merchandise",
      "Multi-item consignments with mixed HSN codes in a single Bill of Entry",
      "First-time import condition management for new product categories",
      "Advisory on applicable duty structures before shipment arrival",
    ],
  },
];

const ACCRED = [
  { t: "AEO Certified", sub: "Authorised Economic Operator", d: "AEO certification from Indian Customs — MP's Only AEO-Certified Customs Intermediary confirming verified compliance standards, financial integrity, and operational reliability. Our AEO is currently under process of Renewal." },
  { t: "Samman Patra Award", sub: "Ministry of Finance, Govt. of India", d: "Awarded by the Ministry of Finance for outstanding contribution to the EXIM fraternity — a recognition of compliance, accuracy, and professional conduct maintained consistently over years." },
  { t: "CONCOR Best Customs Broker", sub: "Every Year Since 1997", d: "Container Corporation of India (CONCOR) has recognised Carry Fast Corporation as its Best Customs Broker annually since 1997 — an unbroken record of performance across nearly three decades." },
];

const WHY_EXPANDED = [
  { icon: FileText, t: "Customs Expertise", d: "Practical customs guidance built on three decades of operational experience. We help clients identify clearance issues early, prepare documentation correctly, and avoid avoidable customs delays." },
  { icon: Zap, t: "Speed", d: "Documentation is filed the same day in most cases. Our team knows the examination and assessment patterns at the ports and airports we work across regularly, which means we prepare for them rather than react to them. When customs raises a query or calls cargo for examination, we respond immediately. The 99.5% on-time clearance rate is a product of preparation, not luck. Clients who move time-sensitive cargo — machinery on project timelines, raw materials for production lines — choose us because delays cost them more than our fees." },
  { icon: ShieldCheck, t: "Compliance", d: "Customs regulations in India change frequently. CBIC notifications, DGFT policy updates, BIS requirement amendments, anti-dumping duty orders, and import licensing changes all affect clearance conditions. We track these changes actively and apply them before filing — not after a query is raised. Every Bill of Entry goes through a pre-filing check on classification, duty rates, and applicable import conditions. This discipline is why our clients rarely face post-clearance disputes or show-cause notices." },
  { icon: Eye, t: "Transparency", d: "Clients should not need to call us to find out where their shipment stands. We provide updates at each stage of the clearance process — document filing, customs query, examination, assessment, duty payment, and out-of-charge. The team handling your shipment is reachable directly, without going through layers of customer service. A responsible team member is assigned to a new client whose independent mobile number and email is shared for direct contact." },
  { icon: Users, t: "Trusted by Leading Businesses", d: "From manufacturers to multinational industrial groups, businesses across India rely on Carry Fast for customs clearance. Repeat clients, not one-off shipments, are what three decades in this business actually look like. Our professionalism and deep technical knowledge ensure predictable outcomes for our clients." },
];

export default function Expertise() {
  const cfg = useSiteConfig();
  const heroImage = cfg.page_heroes?.expertise?.image || "/logos/LOGISTIC1STimage.png";

  return (
    <>
      <SEO
        title="Our Expertise — 15 Industries · Customs Clearance Specialists | Carry Fast Corporation"
        description="Industry-specific customs clearance expertise across machinery, mining equipment, automotive components, chemicals, solar, tyres, food, LED and more. AEO-certified."
        keywords="customs clearance industries India, machinery customs broker, solar import clearance, chemical customs clearance, BIS compliance, FSSAI customs clearance, anti-dumping duty India"
      />

      <PageHero
        label="Our Expertise"
        title={<>Industry-deep <span className="text-gold-500">customs expertise.</span></>}
        subtitle="Each industry carries its own HSN code sensitivities, licensing requirements and examination patterns. Over 30 years, we have built working knowledge across major sectors — from heavy mining equipment to solar modules, pharma raw materials to confectionery."
        image={heroImage}
        breadcrumbs={[{ to: "/", label: "Home" }, { label: "Our Expertise" }]}
      />

      {/* Industries */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mb-12 max-w-3xl">
            <div className="text-overline mb-5">Industries We Serve</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-navy-900 leading-tight">Multiple major industries, 30 years of experience.</h2>
            <p className="mt-6 text-slate-600 leading-relaxed">
              Customs clearance is not generic work. Each industry carries its own HSN code sensitivities, licensing requirements, restricted-item conditions, and examination patterns. Over 30 years, Carry Fast has built working knowledge across the following sectors.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.map((it, i) => (
              <div key={i} data-testid={`expertise-${i}`} className="bg-white border border-slate-200 p-7 hover:border-gold-500 hover:shadow-lg hover:-translate-y-1 transition-all">
                <h3 className="font-display font-bold text-lg text-navy-900 leading-snug">{it.t}</h3>
                <ul className="mt-5 space-y-2.5">
                  {it.points.map((p, j) => (
                    <li key={j} className="flex gap-2.5 text-sm text-slate-600 leading-relaxed">
                      <span className="text-gold-500 shrink-0">→</span><span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="section-y bg-slate-50">
        <div className="container-x">
          <div className="mb-12 text-center">
            <div className="text-overline mb-5">Credentials</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-navy-900">Accreditations</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {ACCRED.map((a, i) => (
              <div key={i} data-testid={`exp-accred-${i}`} className="bg-white border border-slate-200 p-10 text-center hover:border-gold-500 hover:shadow-lg transition-all">
                <div className="w-24 h-24 mx-auto rounded-full border-4 border-gold-500 flex items-center justify-center mb-6">
                  <Award size={36} className="text-gold-500" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-bold text-xl text-navy-900">{a.t}</h3>
                <div className="text-xs uppercase tracking-[0.18em] text-gold-500 font-semibold mt-2">{a.sub}</div>
                <p className="mt-5 text-sm text-slate-600 leading-relaxed">{a.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mb-12">
            <div className="text-overline mb-5">Why Choose Carry Fast</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-navy-900">Why Clients Work With Us</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_EXPANDED.map((w, i) => (
              <div key={i} data-testid={`why-exp-${i}`} className="bg-white border border-slate-200 p-8 hover:border-gold-500 transition-colors">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-navy-900 flex items-center justify-center"><w.icon size={20} className="text-gold-500" strokeWidth={1.8} /></div>
                  <h3 className="font-display font-bold text-2xl text-navy-900">{w.t}</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
