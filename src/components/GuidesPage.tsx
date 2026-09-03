import React, { useState } from "react";

interface GuidesPageProps {
  onGoToHome?: () => void;
  onGoToChat?: () => void;
  onNavigate?: (tab: string) => void;
}

interface GuideTopic {
  id: string;
  title: string;
  content: React.ReactNode;
}

export const GuidesPage: React.FC<GuidesPageProps> = ({ onGoToHome, onGoToChat, onNavigate }) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "writing-briefs": true,
    "memory-personalization": true,
    "copy-score-effective": false,
    "sharing-copy-score": false,
    "managing-credits": false,
    "prompt-builder": false,
    "switching-plans": false,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    topics.forEach((t) => (allExpanded[t.id] = true));
    setOpenItems(allExpanded);
  };

  const collapseAll = () => {
    setOpenItems({});
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

  const topics: GuideTopic[] = [
    {
      id: "writing-briefs",
      title: "Writing better briefs",
      content: (
        <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
          The quality of your output depends heavily on your brief. Instead of &quot;write me an email,&quot; try: <span className="text-white font-mono text-xs sm:text-sm">&quot;Write a cart recovery email for a $49 online course, targeting busy professionals who abandoned checkout, tone: direct but warm.&quot;</span> Include your product, your audience, and what action you want the reader to take.
        </p>
      ),
    },
    {
      id: "memory-personalization",
      title: "Getting the most from Memory & Personalization",
      content: (
        <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
          Fill in your business description with what you actually sell and who you sell to — this gets automatically woven into every generation. If your niche or tone changes, update it any time; changes apply immediately to your next generation.
        </p>
      ),
    },
    {
      id: "copy-score-effective",
      title: "Using Copy Score Challenge effectively",
      content: (
        <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
          Copy Score works best on a finished piece of copy — a full email, a complete ad, a landing page headline and subhead — rather than a single fragment. Read the &quot;Biggest Leverage&quot; diagnosis carefully: it tells you exactly which of the 5 dimensions (Attention, Clarity, Desire, Persuasion, Action) is holding your copy back, and the Fix gives you a specific direction, not generic advice.
        </p>
      ),
    },
    {
      id: "sharing-copy-score",
      title: "Sharing your Copy Score",
      content: (
        <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
          After scoring your copy, you&apos;ll get a shareable card with a unique link. Use the Download button to save the card as an image for Instagram or other platforms, or use the direct share buttons to post straight to X or Facebook.
        </p>
      ),
    },
    {
      id: "managing-credits",
      title: "Managing your daily credits",
      content: (
        <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
          Credits reset every 24 hours from your first generation of the day, not at a fixed clock time. If you&apos;re consistently running out, consider upgrading — Core and Max both include significantly higher daily limits.
        </p>
      ),
    },
    {
      id: "prompt-builder",
      title: "Using the Prompt Builder (Core & Max)",
      content: (
        <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
          Select your format (Emails, Ads, Pages, Persuasion, Content), then answer the guided questions about your niche, goal, and tone. Murgii compiles this into a structured master prompt you can send straight into your workspace instead of writing a brief from scratch.
        </p>
      ),
    },
    {
      id: "switching-plans",
      title: "Switching between plans",
      content: (
        <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
          You can upgrade or downgrade your plan at any time from the Pricing page or your account settings. Changes take effect according to your billing cycle — see our{" "}
          <a
            href="/refund-policy"
            onClick={(e) => {
              e.preventDefault();
              handleNav("refund-policy", "/refund-policy");
            }}
            className="text-zinc-200 underline hover:text-white transition-colors cursor-pointer"
          >
            Refund Policy
          </a>{" "}
          for details on billing.
        </p>
      ),
    },
  ];

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
            GUIDES
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
            Murgii AI Feature Guides
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed mb-6">
            Deeper how-to walkthroughs for getting maximum conversion power out of every Murgii AI feature.
          </p>

          <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
            <button
              type="button"
              onClick={expandAll}
              className="hover:text-white transition-colors cursor-pointer underline"
            >
              Expand All
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={collapseAll}
              className="hover:text-white transition-colors cursor-pointer underline"
            >
              Collapse All
            </button>
          </div>
        </header>

        {/* Accordion List */}
        <div className="divide-y divide-zinc-800 border-t border-b border-zinc-800 mb-12">
          {topics.map((topic) => {
            const isOpen = !!openItems[topic.id];

            return (
              <div key={topic.id} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleItem(topic.id)}
                  className="w-full text-left flex items-center justify-between gap-4 cursor-pointer py-1 group"
                >
                  <h3 className="text-base sm:text-lg font-medium text-white tracking-tight group-hover:text-zinc-200 transition-colors">
                    {topic.title}
                  </h3>
                  <span className="text-zinc-500 font-mono text-lg font-light shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="pt-3 pb-1 text-zinc-300">
                    {topic.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Navigation Link */}
        <footer className="pt-4 space-y-2 border-t border-zinc-800">
          <h3 className="text-sm font-semibold text-white">Need a quick onboarding overview?</h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            Check out our step-by-step{" "}
            <button
              type="button"
              onClick={() => handleNav("learn", "/learn")}
              className="text-zinc-200 underline hover:text-white transition-colors cursor-pointer"
            >
              Getting Started guide
            </button>{" "}
            for Murgii AI.
          </p>
        </footer>
      </div>
    </div>
  );
};
