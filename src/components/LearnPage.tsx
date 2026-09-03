import React from "react";

interface LearnPageProps {
  onGoToHome?: () => void;
  onGoToChat?: () => void;
  onNavigate?: (tab: string) => void;
}

const TOC_SECTIONS = [
  { id: "sec-memory", number: "1", title: "Memory & Personalization" },
  { id: "sec-modes", number: "2", title: "Pick Your Mode" },
  { id: "sec-challenge", number: "3", title: "Copy Score Challenge" },
  { id: "sec-credits", number: "4", title: "Daily Credits" },
  { id: "sec-prompts", number: "5", title: "Prompt Builder (Core & Max)" },
];

export const LearnPage: React.FC<LearnPageProps> = ({ onGoToHome, onGoToChat, onNavigate }) => {
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

  const handleNav = (tab: string, path: string) => {
    if (onNavigate) {
      onNavigate(tab);
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
            LEARN
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
            Getting Started with Murgii AI
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Welcome to Murgii AI. Here is your step-by-step walkthrough to get the highest ROI and most persuasive output from your very first generation.
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="mb-12 pb-8 border-b border-zinc-800">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4 font-semibold">
            Table of Contents
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs mb-4">
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
                {sec.number}. {sec.title}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => handleNav("guides", "/guides")}
            className="text-xs text-zinc-400 hover:text-white transition-colors underline cursor-pointer"
          >
            Deep Feature Walkthroughs →
          </button>
        </nav>

        {/* Document Body */}
        <main className="space-y-12 text-sm sm:text-base leading-relaxed text-zinc-300">
          {/* STEP 1 */}
          <section id="sec-memory" className="space-y-4 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              1. Set up your Memory & Personalization
            </h2>
            <p>
              Before you generate anything, go to <strong className="text-white font-medium">Memory & Personalization</strong> and fill in your name, business/niche, and preferred tone. Murgii automatically applies this context to every generation, so you don't have to re-explain your business every time you write.
            </p>

            <div className="py-2 space-y-2 text-xs sm:text-sm">
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-medium">What Memory Stores</p>
              <ul className="list-disc list-inside space-y-1 text-zinc-300">
                <li><strong className="text-white font-medium">User Identity:</strong> Your name or operator moniker</li>
                <li><strong className="text-white font-medium">Business Context:</strong> Product description, offer details, and core target audience</li>
                <li><strong className="text-white font-medium">Brand Voice:</strong> Primary tone parameters (e.g., direct, witty, high-converting, authoritative)</li>
              </ul>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleNav("memory", "/memory")}
                className="text-xs text-zinc-200 hover:text-white transition-colors underline cursor-pointer"
              >
                Configure Memory Now →
              </button>
            </div>
          </section>

          {/* STEP 2 */}
          <section id="sec-modes" className="space-y-4 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              2. Pick a mode for what you're writing
            </h2>
            <p>
              Murgii has 5 dedicated modes, each trained for a specific type of copy:
            </p>

            <ul className="space-y-2 text-xs sm:text-sm list-disc list-inside">
              <li><strong className="text-white font-medium">Emails:</strong> sequences, launches, cart recovery</li>
              <li><strong className="text-white font-medium">Ads:</strong> hooks and scroll-stopping ad copy</li>
              <li><strong className="text-white font-medium">Pages:</strong> landing pages and sales pages</li>
              <li><strong className="text-white font-medium">Persuasion:</strong> applies psychological triggers directly into your copy</li>
              <li><strong className="text-white font-medium">Content:</strong> social posts, Reels/TikTok scripts, captions</li>
            </ul>

            <p>
              Select the mode that matches what you're writing, then describe your brief in the message box — the more specific you are about your product, audience, and goal, the better the output.
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleNav("chat", "/")}
                className="text-xs text-zinc-200 hover:text-white transition-colors underline cursor-pointer"
              >
                Open Workspace →
              </button>
            </div>
          </section>

          {/* STEP 3 */}
          <section id="sec-challenge" className="space-y-4 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              3. Try Copy Score Challenge
            </h2>
            <p>
              Paste any piece of copy — your own or a draft you're unsure about — into Challenge mode to get a real 0-100 persuasion score across 5 dimensions (Attention, Clarity, Desire, Persuasion, Action), a diagnosis of your biggest weak point, and a specific fix. You can share your score with a public link and challenge others to beat it.
            </p>

            <div className="py-2 space-y-2 text-xs sm:text-sm">
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-medium">The 5 Scoring Dimensions</p>
              <p className="text-zinc-300">Attention • Clarity • Desire • Persuasion • Action</p>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleNav("challenge", "/challenge")}
                className="text-xs text-zinc-200 hover:text-white transition-colors underline cursor-pointer"
              >
                Try Challenge Mode →
              </button>
            </div>
          </section>

          {/* STEP 4 */}
          <section id="sec-credits" className="space-y-4 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              4. Understand your daily credits
            </h2>
            <p>
              Every plan includes a daily credit allowance that resets every 24 hours: <strong className="text-white font-medium">Basic gets 3/day</strong>, <strong className="text-white font-medium">Core gets 20/day</strong>, <strong className="text-white font-medium">Max gets 60/day</strong>. Every generation across every mode, including Challenge, uses 1 credit.
            </p>

            <ul className="space-y-1 text-xs sm:text-sm list-disc list-inside text-zinc-300">
              <li><strong className="text-white font-medium">Basic:</strong> 3 / day (Resets every 24 hours)</li>
              <li><strong className="text-white font-medium">Core:</strong> 20 / day (Resets every 24 hours)</li>
              <li><strong className="text-white font-medium">Max:</strong> 60 / day (Resets every 24 hours)</li>
            </ul>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleNav("pricing", "/pricing")}
                className="text-xs text-zinc-200 hover:text-white transition-colors underline cursor-pointer"
              >
                View Plan Options →
              </button>
            </div>
          </section>

          {/* STEP 5 */}
          <section id="sec-prompts" className="space-y-4 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              5. Build custom prompts (Core & Max)
            </h2>
            <p>
              If you're on Core or Max, use the <strong className="text-white font-medium">Prompt Builder</strong> to turn a rough idea into a structured, role-framed master prompt — answer a few guided questions about your niche, goal, and tone, and Murgii assembles a ready-to-use prompt for you.
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleNav("prompt-builder", "/prompt-builder")}
                className="text-xs text-zinc-200 hover:text-white transition-colors underline cursor-pointer"
              >
                Open Prompt Builder →
              </button>
            </div>
          </section>

          {/* Footer Guide Note */}
          <section className="pt-4 space-y-2">
            <h3 className="text-sm font-semibold text-white">Need more detail on a specific feature?</h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Visit our{" "}
              <a
                href="/guides"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav("guides", "/guides");
                }}
                className="text-zinc-200 underline hover:text-white transition-colors cursor-pointer"
              >
                Guides
              </a>{" "}
              page for deeper walkthroughs.
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
