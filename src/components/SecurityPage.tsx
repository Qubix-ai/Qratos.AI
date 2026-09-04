import React from "react";

interface SecurityPageProps {
  onGoToHome?: () => void;
  onGoToChat?: () => void;
}

const TOC_SECTIONS = [
  { id: "sec-protection", number: "1", title: "How We Protect Your Data" },
  { id: "sec-infra", number: "2", title: "Infrastructure" },
  { id: "sec-payments", number: "3", title: "Payment Security" },
  { id: "sec-access", number: "4", title: "Access Controls" },
  { id: "sec-stage", number: "5", title: "Where We Are Today" },
  { id: "sec-report", number: "6", title: "Report a Security Issue" },
];

export const SecurityPage: React.FC<SecurityPageProps> = ({ onGoToHome, onGoToChat }) => {
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

  return (
    <div className="min-h-screen relative z-10 text-zinc-300 selection:bg-zinc-800 selection:text-white py-12 md:py-20 px-4 sm:px-6">
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
            Qreato Labs Security Commitment
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
            Security
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
          <section id="sec-protection" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              1. How We Protect Your Data
            </h2>
            <p>
              We rely on established, reputable infrastructure providers to host and secure Murgii AI and Qreato Bolt, and we follow standard practices appropriate for our current stage as a growing company.
            </p>
          </section>

          {/* Section 2 */}
          <section id="sec-infra" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              2. Infrastructure
            </h2>
            <p>
              Our application is hosted on Vercel and our database and authentication are managed by Supabase, both of which provide encryption in transit (HTTPS/TLS) for all data sent between your device and our servers, and encryption at rest for stored data.
            </p>
          </section>

          {/* Section 3 */}
          <section id="sec-payments" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              3. Payment Security
            </h2>
            <p>
              We do not directly collect, process, or store your full payment card details. All payments are handled by Whop, Inc., our third-party payment processor, which manages card data in accordance with its own security and compliance standards.
            </p>
          </section>

          {/* Section 4 */}
          <section id="sec-access" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              4. Access Controls
            </h2>
            <p>
              Our database uses row-level security policies to help ensure users can only access their own account data. Access to production systems is limited to the founding team.
            </p>
          </section>

          {/* Section 5 */}
          <section id="sec-stage" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              5. Where We Are Today
            </h2>
            <p>
              We are a small, early-stage company. We have not yet obtained formal third-party security certifications or completed a formal independent security audit. We are committed to improving our security practices as we grow, and we take any reported vulnerability seriously.
            </p>
          </section>

          {/* Section 6 */}
          <section id="sec-report" className="space-y-3 scroll-mt-8">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              6. Report a Security Issue
            </h2>
            <p>
              If you believe you've found a security vulnerability in our Service, please contact us directly rather than disclosing it publicly, so we can investigate and address it responsibly:
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
