import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Cookie, FileText, Mail, ShieldCheck } from "lucide-react";
import SEO from "@/components/SEO";
import PageHero from "@/components/PageHero";
import { useSiteConfig } from "@/contexts/SiteConfigContext";
import { DEFAULT_POLICIES, POLICY_TITLES } from "@/lib/defaultPolicies";

const POLICY_ICONS = {
  "privacy-policy": ShieldCheck,
  "terms-conditions": FileText,
  "cookie-policy": Cookie,
};

function PolicyText({ text }) {
  const blocks = text.split("\n\n");

  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-700">
      {blocks.map((block, index) => {
        const lines = block.split("\n");
        const intro = lines[0];
        const bullets = lines.slice(1).filter((line) => line.trim().startsWith("•"));

        if (bullets.length) {
          return (
            <div key={index}>
              <p>{intro}</p>
              <ul className="mt-2 grid gap-1.5 pl-0">
                {bullets.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-gold-500" />
                    <span>{line.replace(/^•\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        return <p key={index} className="whitespace-pre-line">{block}</p>;
      })}
    </div>
  );
}

export default function LegalPlaceholder({ slug }) {
  const cfg = useSiteConfig();
  const title = POLICY_TITLES[slug] || "Legal";
  const fallbackPolicy = DEFAULT_POLICIES[slug];
  const configuredPolicy = cfg.policies?.[slug] || {};
  const policy = fallbackPolicy ? { ...fallbackPolicy, ...configuredPolicy } : null;
  const Icon = POLICY_ICONS[slug];

  return (
    <>
      <SEO title={`${title} | Carry Fast Corporation`} description={`${title} for Carry Fast Corporation.`} />
      <PageHero
        label="Legal"
        title={title}
        subtitle={policy?.subtitle}
        image={policy?.image}
        breadcrumbs={[{ to: "/", label: "Home" }, { label: title }]}
      />
      {policy ? (
        <>
          <section className="bg-white border-b border-slate-200">
            <div className="container-x max-w-5xl py-8 md:py-10">
              <div className="grid md:grid-cols-12 gap-5 md:gap-8 items-start">
                <div className="md:col-span-4 flex items-center gap-4 border border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="h-11 w-11 shrink-0 bg-navy-900 text-gold-500 flex items-center justify-center">
                    {Icon ? <Icon size={21} strokeWidth={1.7} /> : <CalendarDays size={21} strokeWidth={1.7} />}
                  </div>
                  <div>
                    <div className="text-overline mb-1">Last Updated</div>
                    <p className="text-sm font-semibold text-navy-900">{policy.lastUpdated}</p>
                  </div>
                </div>
                <p className="md:col-span-8 text-base leading-relaxed text-slate-700">
                  {policy.intro}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="container-x max-w-5xl py-10 md:py-12">
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                <aside className="hidden lg:block lg:col-span-4 sticky top-28">
                  <div className="border border-slate-200 bg-slate-50 p-5">
                    <div className="text-overline mb-4">On This Page</div>
                    <nav className="grid gap-2">
                      {policy.content.map((section) => (
                        <a key={section.heading} href={`#${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="text-sm font-semibold text-slate-700 hover:text-gold-500 transition-colors">
                          {section.heading}
                        </a>
                      ))}
                    </nav>
                  </div>
                </aside>

                <div className="lg:col-span-8">
                  {policy.content.map((section, index) => (
                    <section
                      id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                      key={section.heading}
                      className={`${index !== policy.content.length - 1 ? "mb-6 pb-6 border-b border-slate-200" : ""} scroll-mt-28`}
                    >
                      <h2 className="font-display text-xl font-extrabold tracking-tight text-navy-900 mb-3">{section.heading}</h2>
                      <PolicyText text={section.text} />
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </>
      ) : (
        <section className="section-y bg-white">
          <div className="container-x max-w-4xl text-center">
            <h2 className="font-display font-bold text-2xl text-navy-900">Page not found</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              The requested legal page could not be found.
            </p>
            <Link to="/" className="mt-8 inline-block text-sm font-semibold text-navy-900 hover:text-gold-500">
              ← Back to home
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
