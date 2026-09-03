import React from "react";

interface TrustCentrePageProps {
  onGoToHome?: () => void;
  onGoToChat?: () => void;
  onNavigatePolicy?: (policyKey: string) => void;
}

const TOC_SECTIONS = [
  { id: "sec-transparency", number: "1", title: "Transparency, by Design" },
  { id: "sec-subprocessors", number: "2", title: "Our Subprocessors" },
  { id: "sec-control", number: "3", title: "Data You Control" },
  { id: "sec-policies", number: "4", title: "Our Policies" },
  { id: "sec-status", number: "5", title: "Service Status" },
  { id: "sec-questions", number: "6", title: "Questions & Contact" },
];

const SUBPROCESSORS = [
  { provider: "Supabase", purpose: "Database, authentication, data storage" },
  { provider: "Vercel", purpose: "Application hosting" },
  { provider: "Google (Gemini API)", purpose: "AI-powered copy and content generation" },
  { provider: "Whop, Inc.", purpose: "Payment processing and subscription billing" },
];

const POLICY_LINKS = [
  { name: "Terms of Service", path: "/terms", key: "terms" },
  { name: "Privacy Policy", path: "/privacy", key: "privacy" },
  { name: "Security", path: "/security", key: "security" },
  { name: "Refund Policy", path: "/refund-policy", key: "refund" },
  { name: "Platform Rules", path: "/platform-rules", key: "platform-rules" },
  { name: "General Rules", path: "/general-rules", key: "general-rules" },
];

export const TrustCentrePage: React.FC<TrustCentrePageProps> = ({ onGoToHome, onGoToChat, onNavigatePolicy }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBack = () => {
    if (onGoToHome) {
      onGoToHome();
    } else if (onGoToChat) {
      onGoToChat();
    } else if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new Event("popstate"));
    }
  };

  const handlePolicyClick = (e: React.MouseEvent, path: string, key: string) => {
    e.preventDefault();
    if (onNavigatePolicy) {
      onNavigatePolicy(key);
    } else if (typeof window !== "undefined") {
      window.history.pushState({}, "", path);
      window.dispatchEvent(new Event("popstate"));
    }
  };

  return (
    <div className="min-h-screen bg-[#07060B] text-zinc-300 selection:bg-zinc-800 selection:text-white py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-[720px] mx-auto">
        {/* Navigation */}
        <div className="mb-12">
          <button
            type="button"
            onClick={handleBack}
            className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Return to App
          </button>
        </div>

        {/* Header */}
        <header className="mb-12">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 block mb-2 font-medium">
            Qreato Labs Transparency
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
            Trust Centre
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Last updated: August 31, 2026
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="mb-12 pb-8 border-b border-zinc-800">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4 font-semibold">
            Navigation
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
            {TOC_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(sec.id);
                }}
                className="text-zinc-400 hover:text-white transition-colors hover:underline"
              >
                {sec.title}
              </a>
            ))}
          </div>
        </nav>

        {/* Document Body */}
        <main className="space-y-10 text-sm sm:text-base leading-relaxed text-zinc-300">
          {/* Section 1 */}
          <section id="sec-transparency" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              1. Transparency, by Design
            </h2>
            <p>
              This page is a central place to understand how Qreato Labs handles your data, who we work with to run the Service, and where to find our full policies.
            </p>
          </section>

          {/* Section 2 */}
          <section id="sec-subprocessors" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              2. Our Subprocessors
            </h2>
            <p>
              We work with the following third-party providers to operate Murgii AI and Qreato Bolt:
            </p>

            <div className="py-2 space-y-2 text-xs sm:text-sm">
              {SUBPROCESSORS.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-zinc-800/60">
                  <span className="font-medium text-white">{item.provider}</span>
                  <span className="text-zinc-400 text-xs sm:text-sm">{item.purpose}</span>
                </div>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-zinc-500 pt-2">
              We do not sell your data to any of these providers or any other third party, and we do not use your Inputs or Outputs to train AI models beyond what's described in our Privacy Policy.
            </p>
          </section>

          {/* Section 3 */}
          <section id="sec-control" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              3. Data You Control
            </h2>
            <ul className="space-y-2 list-disc list-inside text-zinc-300">
              <li>You can delete your saved Memory & Personalization data at any time from your account settings.</li>
              <li>You can request a copy or deletion of your account data by contacting us directly.</li>
              <li>Copy Score Challenge results you generate are only made public if you choose to share them.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="sec-policies" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              4. Our Policies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm pt-1">
              {POLICY_LINKS.map((policy) => (
                <a
                  key={policy.key}
                  href={policy.path}
                  onClick={(e) => handlePolicyClick(e, policy.path, policy.key)}
                  className="text-zinc-300 hover:text-white transition-colors underline"
                >
                  {policy.name}
                </a>
              ))}
            </div>
          </section>

          {/* Section 5 */}
          <section id="sec-status" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              5. Service Status
            </h2>
            <p>
              We do not currently operate a public status/uptime monitoring page. If you're experiencing an issue with the Service, please contact us directly and we'll investigate promptly.
            </p>
          </section>

          {/* Section 6 */}
          <section id="sec-questions" className="space-y-3 scroll-mt-8">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              6. Questions
            </h2>
            <p>
              If you have questions about how we handle data or operate the Service, reach out:
            </p>

            <div className="py-2 space-y-2 font-mono text-xs sm:text-sm">
              <p>Email: <a href="mailto:salmanhossain75313@gmail.com" className="text-zinc-200 underline hover:text-white transition-colors">salmanhossain75313@gmail.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/8801975230313" target="_blank" rel="noreferrer" className="text-zinc-200 underline hover:text-white transition-colors">+880 1975-230313</a></p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-zinc-800 text-center">
          <button
            type="button"
            onClick={handleBack}
            className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Return to Murgii AI
          </button>
        </footer>
      </div>
    </div>
  );
};
