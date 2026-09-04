import React from "react";

interface SupportPageProps {
  onGoToHome?: () => void;
  onGoToChat?: () => void;
  onNavigate?: (tab: string) => void;
}

const FAQ_ITEMS = [
  {
    q: "How do daily credits reset?",
    a: "Daily credits reset automatically every 24 hours from your first generation of the day. Basic plan gets 3/day, Core gets 20/day, and Max gets 60/day."
  },
  {
    q: "How do I upgrade or manage my subscription?",
    a: "You can manage or upgrade your plan anytime from the Pricing page or directly within your Whop dashboard."
  },
  {
    q: "Can I request custom features or custom integrations?",
    a: "Yes. For enterprise custom deployments or high-volume API requests, visit our Enterprise page or contact engineering support."
  },
  {
    q: "What if I experience an issue with copy generations?",
    a: "Contact our team directly via email or WhatsApp below with a screenshot or prompt context, and our engineering team will investigate immediately."
  }
];

export const SupportPage: React.FC<SupportPageProps> = ({ onGoToHome, onGoToChat }) => {
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
            SUPPORT & HELP DESK
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
            How can we help?
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Get direct, priority assistance from our core development team and copywriting specialists.
          </p>
        </header>

        {/* Document Body */}
        <main className="space-y-10 text-sm sm:text-base leading-relaxed text-zinc-300">
          {/* Section 1: Direct Channels */}
          <section className="space-y-4 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              1. Direct Support Channels
            </h2>
            <p>
              Whether you have technical questions, account inquiries, or need help crafting high-converting briefs, reach us directly:
            </p>

            <div className="py-2 space-y-3 font-mono text-xs sm:text-sm">
              <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-1 font-semibold">Email Support</span>
                <a href="mailto:salmanhossain75313@gmail.com" className="text-zinc-200 underline hover:text-white transition-colors">
                  salmanhossain75313@gmail.com
                </a>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-1 font-semibold">WhatsApp Direct</span>
                <a href="https://wa.me/8801975230313" target="_blank" rel="noreferrer" className="text-zinc-200 underline hover:text-white transition-colors">
                  +880 1975-230313
                </a>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-1 font-semibold">Community & Whop Desk</span>
                <a href="https://whop.com/qreato/ai-leverage" target="_blank" rel="noreferrer" className="text-zinc-200 underline hover:text-white transition-colors">
                  Whop Community Hub →
                </a>
              </div>
            </div>
          </section>

          {/* Section 2: Response SLAs */}
          <section className="space-y-3 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              2. Coverage & Response SLAs
            </h2>
            <p>
              Support is monitored 7 days a week. Core and Max plan members receive priority queue routing for all technical inquiries. Typical response times are under 2 hours during active working hours.
            </p>
          </section>

          {/* Section 3: Frequently Asked Questions */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              3. Frequently Asked Questions
            </h2>
            <div className="space-y-4 pt-2">
              {FAQ_ITEMS.map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/80 space-y-1.5">
                  <h3 className="text-sm font-semibold text-white">{item.q}</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
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
