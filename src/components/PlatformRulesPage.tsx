import React from "react";

interface PlatformRulesPageProps {
  onGoToHome?: () => void;
  onGoToChat?: () => void;
}

const TOC_SECTIONS = [
  { id: "sec-overview", number: "•", title: "Overview" },
  { id: "sec-1", number: "1", title: "One Account Per Person" },
  { id: "sec-2", number: "2", title: "Fair Use of Daily Credits" },
  { id: "sec-3", number: "3", title: "Copy Score Challenge Conduct" },
  { id: "sec-4", number: "4", title: "Prompt Injection and System Manipulation" },
  { id: "sec-5", number: "5", title: "Content You Generate" },
  { id: "sec-6", number: "6", title: "Affiliate Program Conduct" },
  { id: "sec-7", number: "7", title: "Enforcement" },
  { id: "sec-8", number: "8", title: "Contact" },
];

export const PlatformRulesPage: React.FC<PlatformRulesPageProps> = ({ onGoToHome, onGoToChat }) => {
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
            Qreato Labs
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
            Platform Rules
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Last updated: August 31, 2026
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="mb-12 pb-8 border-b border-zinc-800">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4 font-semibold">
            Table of Contents
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
          {/* Overview */}
          <section id="sec-overview" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <p>
              These Platform Rules govern specific conduct on Murgii AI and Qreato Bolt (collectively, the "Service") and supplement, but do not replace, our Terms of Service. By using the Service, you agree to follow these rules.
            </p>
          </section>

          {/* Section 1 */}
          <section id="sec-1" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              1. One Account Per Person
            </h2>
            <p>
              Each individual may maintain only one account. Creating multiple accounts to obtain additional free-tier usage credits, circumvent a suspension, or otherwise gain an advantage not intended for a single user is prohibited and may result in suspension of all associated accounts.
            </p>
          </section>

          {/* Section 2 */}
          <section id="sec-2" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              2. Fair Use of Daily Credits
            </h2>
            <p>
              Daily generation credits are allocated per subscription tier for genuine, individual use. Automating requests to the Service through scripts, bots, or other non-interactive means, or reselling access to your account or its credits to third parties, is prohibited.
            </p>
          </section>

          {/* Section 3 */}
          <section id="sec-3" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              3. Copy Score Challenge Conduct
            </h2>
            <p>
              When using the Copy Score Challenge feature: (a) do not submit copy that is not your own or that you do not have the right to submit for evaluation; (b) do not submit content that is unlawful, hateful, sexually explicit, or otherwise inappropriate for public display, as shared results may be publicly viewable; (c) do not attempt to manipulate, exploit, or reverse-engineer the scoring mechanism; and (d) shared challenge links are intended for genuine comparison and community engagement, not for spam or misleading promotional purposes unrelated to the Service.
            </p>
          </section>

          {/* Section 4 */}
          <section id="sec-4" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              4. Prompt Injection and System Manipulation
            </h2>
            <p>
              You may not attempt to manipulate Murgii AI into ignoring its operating instructions, revealing its underlying system configuration, impersonating a different product or entity, or generating output designed to bypass the safeguards and behavior we have built into the Service.
            </p>
          </section>

          {/* Section 5 */}
          <section id="sec-5" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              5. Content You Generate
            </h2>
            <p>
              You are responsible for how you use any Output generated through the Service, including copy, scores, and diagnostic feedback. Do not use the Service to generate marketing content that is deceptive, makes false claims, impersonates a real business or person without authorization, or violates advertising laws applicable to your use case.
            </p>
          </section>

          {/* Section 6 */}
          <section id="sec-6" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              6. Affiliate Program Conduct
            </h2>
            <p>
              If you participate in the Qreato Partner Program, you agree not to engage in self-referral, incentivized or misleading referral practices, spam, or any promotional method that violates the terms of the affiliate platform (Whop) or misrepresents the Service to potential referrals.
            </p>
          </section>

          {/* Section 7 */}
          <section id="sec-7" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              7. Enforcement
            </h2>
            <p>
              Violation of these Platform Rules may result in warnings, temporary suspension, permanent termination of your account, forfeiture of unpaid affiliate commissions related to the violation, and, where applicable, removal of publicly shared content, at our sole discretion, in addition to any rights available to us under our Terms of Service.
            </p>
          </section>

          {/* Section 8 */}
          <section id="sec-8" className="space-y-3 scroll-mt-8">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              8. Contact
            </h2>
            <p>
              Questions about these Platform Rules can be sent to <a href="mailto:salmanhossain75313@gmail.com" className="text-zinc-200 underline hover:text-white transition-colors">salmanhossain75313@gmail.com</a>, via WhatsApp at <a href="https://wa.me/8801975230313" target="_blank" rel="noreferrer" className="text-zinc-200 underline hover:text-white transition-colors">+880 1975-230313</a>, or through Whop's support chat.
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
