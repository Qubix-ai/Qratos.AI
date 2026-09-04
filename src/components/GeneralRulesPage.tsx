import React from "react";

interface GeneralRulesPageProps {
  onGoToHome?: () => void;
  onGoToChat?: () => void;
}

const TOC_SECTIONS = [
  { id: "sec-overview", number: "•", title: "Overview" },
  { id: "sec-1", number: "1", title: "Act in Good Faith" },
  { id: "sec-2", number: "2", title: "Respect Intellectual Property" },
  { id: "sec-3", number: "3", title: "No Impersonation" },
  { id: "sec-4", number: "4", title: "No Abuse of Support Channels" },
  { id: "sec-5", number: "5", title: "No Circumvention" },
  { id: "sec-6", number: "6", title: "Honest Representation" },
  { id: "sec-7", number: "7", title: "Compliance With Law" },
  { id: "sec-8", number: "8", title: "Our Right to Enforce" },
  { id: "sec-9", number: "9", title: "Updates to These Rules" },
  { id: "sec-10", number: "10", title: "Contact" },
];

export const GeneralRulesPage: React.FC<GeneralRulesPageProps> = ({ onGoToHome, onGoToChat }) => {
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
            Qreato Labs
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
            General Rules
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
              These General Rules describe the standards of conduct we expect from everyone who uses Murgii AI and Qreato Bolt (collectively, the "Service"). They apply alongside our Terms of Service, Privacy Policy, Platform Rules, and Refund Policy.
            </p>
          </section>

          {/* Section 1 */}
          <section id="sec-1" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              1. Act in Good Faith
            </h2>
            <p>
              Use the Service for its intended purpose: creating persuasive, effective marketing copy and executing your creator or business goals. Do not use the Service to deceive, defraud, harass, or cause harm to any person or business.
            </p>
          </section>

          {/* Section 2 */}
          <section id="sec-2" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              2. Respect Intellectual Property
            </h2>
            <p>
              Do not submit Inputs that infringe another person's or company's copyright, trademark, or other intellectual property rights. Do not use the Service to generate content that plagiarizes or closely imitates another creator's or brand's original, identifiable work without authorization.
            </p>
          </section>

          {/* Section 3 */}
          <section id="sec-3" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              3. No Impersonation
            </h2>
            <p>
              Do not use the Service, your account, or any generated Output to impersonate Qreato Labs, Murgii AI, any Qreato Labs team member, or any other individual, brand, or organization in a misleading way.
            </p>
          </section>

          {/* Section 4 */}
          <section id="sec-4" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              4. No Abuse of Support Channels
            </h2>
            <p>
              Communicate with our support team (via email, WhatsApp, or Whop support chat) respectfully. Abusive, threatening, or harassing communication toward our team will not be tolerated and may result in account suspension.
            </p>
          </section>

          {/* Section 5 */}
          <section id="sec-5" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              5. No Circumvention
            </h2>
            <p>
              Do not attempt to bypass, disable, or interfere with any security measure, usage limit, subscription gate, or other technical restriction built into the Service.
            </p>
          </section>

          {/* Section 6 */}
          <section id="sec-6" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              6. Honest Representation
            </h2>
            <p>
              If you publicly share Outputs generated through the Service, including Copy Score Challenge results, you agree not to misrepresent the nature of the Service, falsely claim results are not AI-assisted where such disclosure is legally required, or present Outputs in a way designed to mislead others about the Service's capabilities.
            </p>
          </section>

          {/* Section 7 */}
          <section id="sec-7" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              7. Compliance With Law
            </h2>
            <p>
              You are responsible for ensuring your use of the Service, and any content you create or publish using Outputs, complies with all laws and regulations applicable to you, including advertising, consumer protection, and data privacy laws in your jurisdiction.
            </p>
          </section>

          {/* Section 8 */}
          <section id="sec-8" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              8. Our Right to Enforce
            </h2>
            <p>
              We reserve the right to investigate suspected violations of these General Rules and to take any action we deem appropriate, including warnings, content removal, feature restrictions, or account termination, consistent with our Terms of Service.
            </p>
          </section>

          {/* Section 9 */}
          <section id="sec-9" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              9. Updates to These Rules
            </h2>
            <p>
              We may update these General Rules from time to time to reflect changes in the Service or applicable law. Continued use of the Service after an update constitutes acceptance of the revised rules.
            </p>
          </section>

          {/* Section 10 */}
          <section id="sec-10" className="space-y-3 scroll-mt-8">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              10. Contact
            </h2>
            <p>
              Questions about these General Rules can be sent to <a href="mailto:salmanhossain75313@gmail.com" className="text-zinc-200 underline hover:text-white transition-colors">salmanhossain75313@gmail.com</a>, via WhatsApp at <a href="https://wa.me/8801975230313" target="_blank" rel="noreferrer" className="text-zinc-200 underline hover:text-white transition-colors">+880 1975-230313</a>, or through Whop's support chat.
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
