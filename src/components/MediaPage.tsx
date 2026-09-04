import React from "react";

interface MediaPageProps {
  onGoToHome?: () => void;
  onGoToChat?: () => void;
}

const TOC_SECTIONS = [
  { id: "sec-about", number: "1", title: "About Qreato Labs" },
  { id: "sec-facts", number: "2", title: "Company Facts" },
  { id: "sec-assets", number: "3", title: "Brand Assets" },
  { id: "sec-inquiries", number: "4", title: "Media Inquiries" },
];

export const MediaPage: React.FC<MediaPageProps> = ({ onGoToHome, onGoToChat }) => {
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
            Qreato Labs Press Room
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
            Media
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
          <section id="sec-about" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              1. About Qreato Labs
            </h2>
            <p>
              Qreato Labs is the studio behind Murgii AI and Qreato Bolt — a connected system helping creators and founders turn ideas into persuasive marketing copy and executable business growth. Murgii AI is a dedicated copywriting engine trained specifically for direct-response marketing; Qreato Bolt is a structured execution roadmap for building and scaling a digital product business.
            </p>
          </section>

          {/* Section 2 */}
          <section id="sec-facts" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              2. Company Facts
            </h2>
            <ul className="space-y-2 list-disc list-inside text-zinc-300">
              <li><strong className="text-white font-medium">Founded:</strong> 2026</li>
              <li><strong className="text-white font-medium">Products:</strong> Murgii AI, Qreato Bolt</li>
              <li><strong className="text-white font-medium">Headquarters:</strong> Remote-first</li>
              <li>
                <strong className="text-white font-medium">Website:</strong>{" "}
                <a 
                  href="https://murgii.vercel.app" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-zinc-200 underline hover:text-white transition-colors"
                >
                  murgii.vercel.app
                </a>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="sec-assets" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              3. Brand Assets
            </h2>
            <p>
              For logo files, brand colors, and usage guidelines, contact us directly using the details below. We're happy to provide high-resolution assets for approved press or partnership use.
            </p>
          </section>

          {/* Section 4 */}
          <section id="sec-inquiries" className="space-y-3 scroll-mt-8">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              4. Media Inquiries
            </h2>
            <p>
              For interview requests, press inquiries, or partnership coverage, reach out to:
            </p>
            
            <div className="py-2 space-y-2 font-mono text-xs sm:text-sm">
              <p>Email: <a href="mailto:salmanhossain75313@gmail.com" className="text-zinc-200 underline hover:text-white transition-colors">salmanhossain75313@gmail.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/8801975230313" target="_blank" rel="noreferrer" className="text-zinc-200 underline hover:text-white transition-colors">+880 1975-230313</a></p>
            </div>

            <p className="text-zinc-500 text-xs sm:text-sm">
              We aim to respond to media inquiries within 2-3 business days.
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
