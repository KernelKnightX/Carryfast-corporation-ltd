import { Link } from "react-router-dom";
import { FileCheck, Anchor, Plane, BookOpen, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import SEO from "@/components/SEO";
import PageHero from "@/components/PageHero";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

const SERVICES = [
  {
    key: "customs-expertise",
    icon: ShieldCheck,
    img: "/logos/Logistics-in-India.jpg",
    t: "Customs Expertise",
    paragraphs: [
      "Thirty years of customs operations across diverse industries has given Carry Fast Corporation practical knowledge that extends beyond routine customs clearance. Our team understands how industry-specific regulations, tariff classifications, licensing requirements, exemption notifications, and compliance obligations affect different categories of cargo before they become clearance issues.",
      "We advise clients on customs procedures before shipments arrive, helping them prepare documentation, evaluate regulatory requirements, and address potential compliance concerns early. This proactive approach reduces unnecessary delays and supports more predictable customs processing for both regular and first-time imports and exports.",
      "Our experience spans machinery, mining equipment, automotive components, chemicals, renewable energy equipment, consumer goods, food products, electrical goods, furniture, and other specialised cargo. Clients rely on our operational knowledge to support informed decisions throughout the customs process.",
    ],
  },
  {
    key: "customs-clearance",
    icon: FileCheck,
    img: "/logos/services.jpg",
    t: "Customs Clearance Services",
    paragraphs: [
      "A customs intermediary acts on behalf of an importer or exporter in dealings with Indian Customs. The role requires a valid F Card licence, working knowledge of the Customs Act, the Customs Tariff Act, DGFT policy, and the procedural requirements at each port and airport of entry. Carry Fast Corporation holds the F Card licence and has handled customs clearance under this licence since 1995. Both partners — Anurag Vijayvargiya and Abhay Nilosey — are F Card holders, which means the firm's compliance accountability sits at the highest level of its leadership.",
      "Our service covers the complete scope of customs representation — tariff classification of goods to the eight-digit HSN code, customs valuation in accordance with the Customs Valuation Rules, duty computation, filing of Bills of Entry and Shipping Bills on ICEGATE, and liaison with customs officers at the time of examination and assessment. We also manage import licensing conditions, advance authorisation compliance, EPCG licence obligations, and exemption notifications applicable to specific cargo categories. For each client, we maintain a shipment-level record of classification decisions, duty structures, and assessment outcomes — which reduces re-assessment disputes on repeat imports.",
      "As an AEO-certified customs intermediary — the only one in Madhya Pradesh — we carry additional credibility with customs authorities. AEO certification involves a detailed audit of financial soundness, compliance record, and operational controls. Our AEO is currently under the process of Renewal. It provides clients with the assurance that their cargo is handled by a firm whose practices have been independently verified. For clients who themselves hold or are seeking AEO status, working with an AEO-certified intermediary is a recognised compliance advantage.",
    ],
  },
  {
    key: "import-customs-clearance",
    icon: Anchor,
    img: "/logos/logistic1.jpg",
    t: "Import Customs Clearance",
    paragraphs: [
      "Import customs clearance in India involves multiple steps that must be completed in the correct sequence and within regulatory time limits. Once a shipment arrives at the port or airport, the Bill of Entry must be filed on ICEGATE, the goods must be assessed and examined where called for, applicable duties must be paid, and an out-of-charge order must be obtained before the cargo can be released. Delays at any stage result in demurrage, detention, and in some cases penal action under the Customs Act. Carry Fast has managed this process across all major ports, airports, ICDs, and CFS locations in India for three decades.",
      "Our import clearance process begins before the vessel or aircraft arrives. We obtain pre-arrival documentation from the client — commercial invoice, packing list, bill of lading or airway bill, country of origin certificate where applicable, and any import licences or exemption notifications — and initiate the Bill of Entry filing before the goods are physically present. This reduces the time between arrival and out-of-charge. Where goods are subject to BIS inspection, FSSAI sampling, or other agency-level clearances, we coordinate the process in parallel with customs to avoid sequential delays.",
      "We handle FCL and LCL sea shipments, air cargo, and ICD-based inland clearances. For industries where import conditions are complex — restricted items, anti-dumping duty applicability, end-use bond requirements, or conditional exemptions — we conduct a pre-clearance compliance review and advise the client on documentation gaps before filing. Post-clearance, we provide the complete set of customs documents — including the final assessed Bill of Entry, duty payment challans, and examination reports for the client's records.",
    ],
  },
  {
    key: "export-customs-clearance",
    icon: Plane,
    img: "/logos/logistic3.jpg",
    t: "Export Customs Clearance",
    paragraphs: [
      "Export clearance in India requires the filing of a Shipping Bill on ICEGATE, customs examination, the Let Export Order (LEO), and gate pass in that sequence. For exporters claiming drawback, RodTEP, or other export incentives, the Shipping Bill must be filed under the correct scheme code at the time of filing, as amendments after LEO are constrained. Carry Fast has managed export clearances for clients across manufacturing, trading, and processing industries, with specific experience in incentive scheme filings and Certificate of Origin facilitation. The shipping bill is prepared on the basis of the documents submitted by the shipper. The basic documents required for filing are commercial invoice, packing list and a copy of order, PI or LC.",
      "For exports under advance authorisation, we manage the obligation discharge documentation, including shipping bill endorsement and EODC preparation. For exporters claiming GSP or preferential tariff benefits in destination countries, we facilitate Certificate of Origin issuance through the designated issuing authority and verify that the origin criteria are met for each shipment.",
      "We handle container arrangement coordination for both domestic stuffing and port-of-loading operations, including FIATA documentation for international forwarding. Customs examination under the Risk Management System, physical examination, and sealing are managed directly by our team at the port. Post-shipment, we provide the complete export documentation set — LEO-endorsed Shipping Bill, Bill of Lading, Certificate of Origin, and any other documents required by the buyer or their bank for payment under LC terms.",
    ],
  },
  {
    key: "trade-compliance",
    icon: BookOpen,
    img: "/logos/logistic4.jpg",
    t: "Trade Compliance",
    paragraphs: [
      "Trade compliance in India is not a static exercise. The customs tariff is amended through Finance Act notifications and standalone CBIC circulars. DGFT policy for imports and exports is updated through Policy Circulars, Trade Notices, and Public Notices. The list of BIS-notified mandatory standards grows every year. Anti-dumping and safeguard duties are imposed, amended, and withdrawn on an ongoing basis. Import licensing requirements under the Foreign Trade Policy change at each policy review. A company that does not actively track these changes will encounter compliance failures — not because of intent, but because the rules shifted without notice reaching the operations team. Registration under SIMS/PIMS/CIMS/NFMIMS/etc. are mandatory for various products.",
      "Carry Fast monitors regulatory changes from CBIC, DGFT, the Directorate of Anti-Dumping, and BIS on an ongoing basis. We apply current requirements to each shipment before filing. For clients with regular imports in sectors where regulations move frequently — chemicals, electrical goods, solar equipment, food, and tyres — we provide advance advisory when a regulatory change affects their import conditions, so they can plan their procurement accordingly rather than discover the change at the time of clearance.",
      "For clients managing their own import compliance teams, we provide consultation on tariff classification disputes, customs valuation methodology, licensing obligations, and the procedural requirements for obtaining import exemptions. Where clients face show-cause notices or customs audit queries, we assist with the preparation of responses and representation before the adjudicating authority. Our trade compliance support is grounded in operational experience — not theoretical interpretation — because the issues that arise in clearance are practical, procedural, and time-sensitive.",
    ],
  },
  {
    key: "documentation-support",
    icon: FileText,
    img: "/logos/Logistics-in-India.jpg",
    t: "Documentation Support",
    paragraphs: [
      "Every customs clearance depends on its documentation. A mismatch between the commercial invoice and the Bill of Entry, an incorrect country of origin on the packing list, a missing import licence, or an undeclared product characteristic can trigger examination, re-assessment, or a show-cause notice — all of which delay cargo release and create costs. Carry Fast prepares, verifies, and files all customs documentation as part of its standard clearance service, and also provides documentation support to clients who handle their own clearance but need assistance with specific document categories.",
      "On the import side, we prepare and verify the Bill of Entry, coordinate delivery order documentation from the shipping line or airline, manage customs examination reports, and compile the complete assessed documentation set for client records. We also handle bond execution for provisional assessments, end-use bonds for conditional duty exemptions, and SVB (Special Valuation Branch) compliance documentation for related-party transactions. For multi-port or multi-shipment clients, we maintain a documentation register that tracks classification decisions, duty structures, and examination outcomes across shipments.",
      "On the export side, we prepare Shipping Bills, coordinate Certificate of Origin issuance, compile GSP documentation, and manage the export obligation documentation for advance authorisation and EPCG licence holders. We also prepare the complete post-shipment documentation set required for realisation of export proceeds and incentive scheme claims. For clients with LC-backed export transactions, we ensure the documentation set is consistent with the LC terms and meets the requirements of the presenting bank.",
    ],
  },
];

export default function Services() {
  const cfg = useSiteConfig();
  const heroImage = cfg.page_heroes?.services?.image || "/logos/contact.png";

  return (
    <>
      <SEO
        title="Our Services — Customs Clearance, Trade Compliance & Documentation | Carry Fast"
        description="End-to-end customs clearance, import/export documentation, trade compliance, and documentation support for businesses across India. F Card licensed. AEO certified."
        keywords="customs clearance services India, import customs clearance, export customs clearance, Bill of Entry filing, Shipping Bill ICEGATE, trade compliance India, customs documentation support"
      />

      <PageHero
        label="Our Services"
        title={<>Five services. <span className="text-gold-500">One trusted partner.</span></>}
        subtitle="A complete customs offering — clearance, import, export, compliance and documentation — delivered by an AEO-certified F-Card licensed firm with three decades of operational experience."
        image={heroImage}
        breadcrumbs={[{ to: "/", label: "Home" }, { label: "Our Services" }]}
      />

      {SERVICES.map((s, i) => (
        <section id={s.key} key={s.key} className={`section-y ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} border-b border-slate-200 scroll-mt-24`}>
          <div className="container-x grid md:grid-cols-12 gap-12 items-start">
            <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-2" : ""}`}>
              <div className="sticky top-28">
                <div className="w-14 h-14 bg-navy-900 flex items-center justify-center mb-5">
                  <s.icon size={24} className="text-gold-500" strokeWidth={1.6} />
                </div>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-tight text-navy-900">{s.t}</h2>
                <Link to="/contact" data-testid={`service-cta-${s.key}`} className="mt-8 inline-flex items-center gap-2 bg-gold-500 text-white px-6 py-3 text-sm font-semibold hover:bg-gold-600 transition-colors">
                  Discuss your requirements <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="md:col-span-7 space-y-5">
              {s.paragraphs.map((p, j) => (
                <p key={j} className="text-slate-700 leading-relaxed text-base">{p}</p>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
