import React from "react";

interface ReviewsPageProps {
  onGoToHome?: () => void;
  onGoToChat?: () => void;
  onNavigate?: (tab: string) => void;
}

const REVIEWS = [
  {
    author: "Alex V.",
    role: "Founder, Growth Scale Agency",
    text: "Murgii AI completely transformed our client email flows. The persuasion frameworks actually feel human and deeply psychological rather than generic AI output."
  },
  {
    author: "Elena R.",
    role: "E-commerce Operator",
    text: "Generated our entire product launch sales page in 15 minutes. Our click-to-convert rate jumped by 28% compared to our old copy."
  },
  {
    author: "David K.",
    role: "SaaS Content Lead",
    text: "The Max model's voice retention is unprecedented. It remembers our brand tone across all channels without constant re-prompting."
  },
  {
    author: "Marcus T.",
    role: "Performance Marketer",
    text: "We tested Murgii ad variations against hand-written agency copy. Murgii's hook variations outperformed the agency script on Facebook Ads."
  }
];

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onGoToHome, onGoToChat }) => {
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
            OPERATOR REVIEWS & TESTIMONIALS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
            Built for results
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Here is how founders, performance marketers, and copywriters use Murgii AI to scale revenue and conversion copy.
          </p>
        </header>

        {/* Document Body */}
        <main className="space-y-10 text-sm sm:text-base leading-relaxed text-zinc-300">
          {/* Section 1: Reviews List */}
          <section className="space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight pb-2 border-b border-zinc-800">
              Verified Operator Experiences
            </h2>

            <div className="space-y-4">
              {REVIEWS.map((rev, idx) => (
                <div key={idx} className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-3">
                  <p className="text-sm sm:text-base text-zinc-200 italic font-sans leading-relaxed">
                    "{rev.text}"
                  </p>
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{rev.author}</span>
                    <span className="text-zinc-500">{rev.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Submit a Review */}
          <section className="space-y-3 pt-6 border-t border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              Share Your Results
            </h2>
            <p>
              Are you building with Murgii AI? Share your campaign performance or feedback directly with our team at{" "}
              <a href="mailto:salmanhossain75313@gmail.com" className="text-zinc-200 underline hover:text-white transition-colors font-mono">
                salmanhossain75313@gmail.com
              </a>.
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
