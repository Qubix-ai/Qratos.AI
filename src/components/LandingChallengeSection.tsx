import React from "react";
import { ArrowRight } from "lucide-react";
import { QreatoLogo } from "./QreatoLogo";

interface LandingChallengeSectionProps {
  onStartChallenge?: (initialText?: string) => void;
  onNavigateToChallengeDemo?: () => void;
}

export const LandingChallengeSection: React.FC<LandingChallengeSectionProps> = ({
  onStartChallenge,
}) => {
  return (
    <section id="challenge" className="py-24 sm:py-32 relative overflow-hidden bg-[#09090B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0E0E12] p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Clear Headline, One Explanatory Sentence, One CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-bold tracking-tight text-white font-['Geist',sans-serif] leading-[1.14] max-w-xl">
                Benchmark your copy against <br />direct response masters.
              </h2>

              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-normal max-w-xl">
                Paste any headline, ad, or email to get an instant 0–100 persuasion diagnostic across 5 core conversion metrics, complete with leverage fixes and a shareable challenge link.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onStartChallenge && onStartChallenge("")}
                  className="py-3 px-6 rounded-xl bg-white text-black hover:bg-neutral-200 text-sm font-semibold transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Test Your Copy Now</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Right Column: One Real Example of the Actual Score Card Output */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <div
                className="w-full max-w-sm rounded-2xl border border-white/[0.1] p-6 sm:p-7 flex flex-col items-center text-center shadow-2xl"
                style={{
                  backgroundColor: "#0A0A0A",
                  background: "radial-gradient(ellipse at 50% 40%, #141416 0%, #0A0A0A 80%)",
                }}
              >
                {/* Top Logo */}
                <div className="w-full flex items-center justify-start pb-4 mb-5 border-b border-white/10">
                  <QreatoLogo size={24} className="text-white" dotClassName="text-white fill-white" />
                </div>

                {/* Evaluated Copy Snippet */}
                <div className="w-full mb-5 text-center">
                  <span className="text-[10px] font-mono font-medium tracking-[0.2em] text-neutral-500 uppercase block mb-1.5">
                    EVALUATED COPY
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-300 font-normal italic leading-relaxed line-clamp-2">
                    "The all-in-one operating system for high-output growth teams."
                  </p>
                </div>

                {/* Dominant Real Score Output */}
                <div className="mb-5 flex items-baseline justify-center">
                  <span className="text-6xl sm:text-7xl font-bold font-['Geist',sans-serif] tracking-tight text-[#F59E0B] leading-none">
                    88
                  </span>
                  <span className="text-lg font-mono text-neutral-500 ml-1.5">
                    /100
                  </span>
                </div>

                {/* Thin Accent Rule */}
                <div className="w-12 h-[1px] bg-[#F59E0B]/60 mb-5" />

                {/* Strongest Element Callout */}
                <div className="w-full text-center">
                  <span className="text-[10px] font-mono font-medium tracking-[0.2em] text-neutral-500 uppercase block mb-1">
                    STRONGEST ELEMENT
                  </span>
                  <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#F59E0B] font-['Geist',sans-serif] block">
                    PERSUASION ARCHITECTURE
                  </span>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-1 font-sans">
                    Crisp problem-state contrast creates immediate urgency and clear differentiation.
                  </p>
                </div>

                {/* Challenge Callout Bar */}
                <div className="w-full mt-6 py-2.5 px-3 rounded-xl border border-white/10 bg-white/[0.03] text-center">
                  <span className="text-[11px] font-bold tracking-widest text-neutral-200 uppercase font-mono">
                    I GOT 88. CAN YOU BEAT ME?
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
