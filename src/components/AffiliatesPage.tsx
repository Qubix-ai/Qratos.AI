import React from "react";

interface AffiliatesPageProps {
  onGoToHome?: () => void;
  onGoToChat?: () => void;
  onNavigate?: (tab: string) => void;
}

const TOC_SECTIONS = [
  { id: "sec-how-it-works", title: "How it works" },
  { id: "sec-whats-included", title: "What's included" },
  { id: "sec-recurring", title: "A note on recurring subscriptions" },
  { id: "sec-getting-started", title: "Getting started" },
  { id: "sec-questions", title: "Questions" },
];

export const AffiliatesPage: React.FC<AffiliatesPageProps> = ({ onGoToHome, onGoToChat }) => {
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
            AFFILIATES
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
            Turn your audience into income
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Recommend Murgii to people who can genuinely benefit from it, and earn 50% of their first month's payment when they become a paying customer.
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="mb-12 pb-8 border-b border-zinc-800">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4 font-semibold">
            Navigation
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
            {TOC_SECTIONS.map((sec, idx) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(sec.id);
                }}
                className="text-zinc-400 hover:text-white transition-colors hover:underline"
              >
                {idx + 1}. {sec.title}
              </a>
            ))}
          </div>
        </nav>

        {/* Document Body */}
        <main className="space-y-10 text-sm sm:text-base leading-relaxed text-zinc-300">
          {/* Section 1 */}
          <section id="sec-how-it-works" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              1. How it works
            </h2>
            <p>
              You get one unique referral link. Share it anywhere — your content, your community, your audience. When someone subscribes to Core or Max using your link, you earn 50% of their first monthly payment.
            </p>
          </section>

          {/* Section 2 */}
          <section id="sec-whats-included" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              2. What's included
            </h2>
            <ul className="space-y-2.5 list-disc list-inside text-zinc-300">
              <li>
                <strong className="text-white font-semibold">50% commission</strong> on your referral's first month, for both Core and Max plans
              </li>
              <li>
                <strong className="text-white font-semibold">One link</strong> — no complicated tracking to set up yourself
              </li>
              <li>
                <strong className="text-white font-semibold">Everything tracked automatically</strong> — clicks, signups, and earnings, all visible directly in your Whop dashboard, no separate login or spreadsheet needed
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="sec-recurring" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              3. A note on recurring subscriptions
            </h2>
            <p>
              Because Core and Max are recurring monthly subscriptions, your 50% commission applies to your referral's first payment only, not to their ongoing monthly renewals.
            </p>
          </section>

          {/* Section 4 */}
          <section id="sec-getting-started" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              4. Getting started
            </h2>
            <p>
              Join the program through Whop, where your link, dashboard, and payouts are all managed.
            </p>
            <div className="pt-2">
              <a
                href="https://whop.com/qreato/ai-leverage"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 px-4 py-2.5 rounded-lg border border-zinc-700 transition-colors"
              >
                Become a Murgii Affiliate →
              </a>
            </div>
          </section>

          {/* Section 5 */}
          <section id="sec-questions" className="space-y-3 scroll-mt-8">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              5. Questions
            </h2>
            <p>
              Reach out at{" "}
              <a
                href="mailto:salmanhossain75313@gmail.com"
                className="text-zinc-200 underline hover:text-white transition-colors font-mono"
              >
                salmanhossain75313@gmail.com
              </a>{" "}
              or via WhatsApp at{" "}
              <a
                href="https://wa.me/8801975230313"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-200 underline hover:text-white transition-colors font-mono"
              >
                +880 1975-230313
              </a>
              .
            </p>
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
