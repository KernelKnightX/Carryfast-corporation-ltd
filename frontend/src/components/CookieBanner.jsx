import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, X, ShieldCheck, BarChart3, Megaphone } from "lucide-react";
import { getConsent, setConsent } from "@/lib/consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: true, marketing: true });

  useEffect(() => {
    const c = getConsent();
    if (!c) setVisible(true);
  }, []);

  const acceptAll = () => {
    setConsent({ analytics: true, marketing: true });
    setVisible(false);
  };

  const rejectAll = () => {
    setConsent({ analytics: false, marketing: false });
    setVisible(false);
  };

  const savePrefs = () => {
    setConsent(prefs);
    setVisible(false);
    setShowPrefs(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Main banner */}
      {!showPrefs && (
        <div
          data-testid="cookie-banner"
          className="fixed bottom-0 left-0 right-0 z-[60] bg-navy-900 text-white border-t-2 border-gold-500 shadow-2xl animate-fade-up"
        >
          <div className="container-x py-5 md:py-6 grid md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 flex gap-4 items-start">
              <div className="w-10 h-10 bg-gold-500 flex items-center justify-center shrink-0">
                <Cookie size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base md:text-lg leading-tight">We value your privacy</h3>
                <p className="mt-1.5 text-xs md:text-sm text-white/75 leading-relaxed">
                  We use cookies to keep the site working, understand how it is used, and improve your experience. You can accept all, reject non-essential, or manage your preferences. See our{" "}
                  <Link to="/cookie-policy" className="underline hover:text-gold-400">Cookie Policy</Link> and{" "}
                  <Link to="/privacy-policy" className="underline hover:text-gold-400">Privacy Policy</Link>.
                </p>
              </div>
            </div>
            <div className="md:col-span-5 flex flex-col sm:flex-row gap-2 md:justify-end">
              <button
                onClick={() => setShowPrefs(true)}
                data-testid="cookie-manage-btn"
                className="px-4 py-2.5 text-xs font-semibold border border-white/30 text-white hover:border-white hover:bg-white/5 transition-colors"
              >
                Manage Preferences
              </button>
              <button
                onClick={rejectAll}
                data-testid="cookie-reject-btn"
                className="px-4 py-2.5 text-xs font-semibold border border-white/30 text-white hover:border-white hover:bg-white/5 transition-colors"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={acceptAll}
                data-testid="cookie-accept-btn"
                className="px-5 py-2.5 text-xs font-bold bg-gold-500 text-white hover:bg-gold-600 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences modal */}
      {showPrefs && (
        <div
          data-testid="cookie-prefs-modal"
          className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-navy-900/70 backdrop-blur-sm p-0 md:p-4"
        >
          <div className="bg-white text-navy-900 w-full md:max-w-2xl max-h-[90vh] overflow-y-auto md:rounded-sm shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <div className="text-overline mb-1">Cookie Settings</div>
                <h3 className="font-display font-bold text-lg">Manage your preferences</h3>
              </div>
              <button onClick={() => setShowPrefs(false)} aria-label="Close" data-testid="cookie-prefs-close" className="text-slate-400 hover:text-navy-900">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                We use three categories of cookies on this website. Essential cookies are always on. Choose which optional categories you allow.
              </p>

              <PrefRow
                icon={ShieldCheck}
                title="Essential"
                desc="Required for the site to function — page navigation, form submission and security. Cannot be disabled."
                checked
                disabled
              />

              <PrefRow
                icon={BarChart3}
                title="Analytics"
                desc="Helps us understand how visitors use the site (Google Analytics 4). Data is anonymised. No personally identifiable information is collected."
                checked={prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
                testId="pref-analytics"
              />

              <PrefRow
                icon={Megaphone}
                title="Marketing"
                desc="Used to measure ad performance and improve campaign relevance (e.g. Meta Pixel). Disabled by default if your jurisdiction requires opt-in."
                checked={prefs.marketing}
                onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
                testId="pref-marketing"
              />
            </div>

            <div className="border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={() => { setPrefs({ analytics: false, marketing: false }); savePrefs(); }}
                className="px-4 py-2.5 text-xs font-semibold border border-slate-300 hover:bg-slate-100 transition-colors"
                data-testid="cookie-prefs-reject"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={savePrefs}
                className="px-5 py-2.5 text-xs font-bold bg-gold-500 text-white hover:bg-gold-600 transition-colors"
                data-testid="cookie-prefs-save"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PrefRow({ icon: Icon, title, desc, checked, onChange, disabled, testId }) {
  return (
    <div className="flex gap-4 items-start border border-slate-200 p-4">
      <Icon size={22} className="text-gold-500 shrink-0 mt-1" strokeWidth={1.6} />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-display font-semibold text-navy-900 text-sm">{title}</h4>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={(e) => onChange && onChange(e.target.checked)}
              className="sr-only peer"
              data-testid={testId}
            />
            <div
              className={`w-10 h-5 rounded-full transition-colors relative ${
                disabled ? "bg-emerald-500" : checked ? "bg-gold-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  checked ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </label>
        </div>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
