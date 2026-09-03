import React from "react";

interface EnterprisePageProps {
  onGoToHome?: () => void;
  onGoToChat?: () => void;
}

const TOC_SECTIONS = [
  { id: "sec-scaling", number: "1", title: "Scaling Across Teams" },
  { id: "sec-discuss", number: "2", title: "What We Can Discuss" },
  { id: "sec-works", number: "3", title: "How It Works" },
  { id: "sec-contact", number: "4", title: "Get In Touch" },
];

export const EnterprisePage: React.FC<EnterprisePageProps> = ({ onGoToHome, onGoToChat }) => {
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
            Qreato Labs Solutions
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
            Enterprise & Teams
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Custom Team & Agency Inquiries
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
          <section id="sec-scaling" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              1. Scaling Copy and Execution Across Your Organization
            </h2>
            <p>
              If you're an agency, marketing team, or growing company that needs Murgii AI and Qreato Bolt across multiple people, we'd like to talk. We work directly with teams to figure out what setup actually fits — rather than forcing you into a rigid, one-size-fits-all plan.
            </p>
          </section>

          {/* Section 2 */}
          <section id="sec-discuss" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              2. What We Can Discuss
            </h2>
            <ul className="space-y-2 list-disc list-inside text-zinc-300">
              <li>Multi-seat access for your team</li>
              <li>Custom daily generation volume based on your needs</li>
              <li>Onboarding support to get your brand voice and workflows set up correctly</li>
              <li>Priority support access</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="sec-works" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              3. How It Works
            </h2>
            <p>
              There's no separate self-serve enterprise plan today — every team engagement starts with a conversation so we can understand your actual usage and needs, and quote something fair for your situation.
            </p>
          </section>

          {/* Section 4 */}
          <section id="sec-contact" className="space-y-3 scroll-mt-8">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              4. Get In Touch
            </h2>
            <div className="py-2 space-y-2 font-mono text-xs sm:text-sm">
              <p>Email: <a href="mailto:salmanhossain75313@gmail.com" className="text-zinc-200 underline hover:text-white transition-colors">salmanhossain75313@gmail.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/8801975230313" target="_blank" rel="noreferrer" className="text-zinc-200 underline hover:text-white transition-colors">+880 1975-230313</a></p>
            </div>
            <p className="text-zinc-500 text-xs sm:text-sm">
              We typically respond within 1-2 business days.
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
