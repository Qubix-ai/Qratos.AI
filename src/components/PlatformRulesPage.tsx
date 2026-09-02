import React from "react";
import { ArrowLeft, ShieldCheck, Lock, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import LightPillar from "./LightPillar";

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
    <div className="min-h-screen bg-[#07050E] text-gray-200 overflow-y-auto custom-scrollbar relative selection:bg-purple-500/30">
      {/* Background Shader LightPillar */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <LightPillar
          topColor="#3410c5"
          bottomColor="#84CC16"
          intensity={0.4}
          rotationSpeed={1.5}
          glowAmount={0.01}
          pillarWidth={4}
          pillarHeight={0.3}
          noiseIntensity={1.5}
          pillarRotation={150}
          interactive={false}
          mixBlendMode="normal"
          quality="low"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,5,14,0.4)_0%,rgba(7,5,14,0.92)_100%)] pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-14 relative z-10">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-white/90 hover:text-white transition-all cursor-pointer bg-white/[0.06] hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 backdrop-blur-md shadow-lg group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to App</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-white/60 bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
            <ShieldCheck size={14} className="text-purple-400" />
            <span>Platform Rules</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4 shadow-sm">
            <Lock size={13} className="text-purple-400" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-white font-bold">
              Qreato Labs Legal
            </span>
          </div>

          <h1 
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-nohemi leading-tight mb-4"
            style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            PLATFORM RULES
          </h1>

          <p className="text-xs sm:text-sm font-mono text-gray-400 bg-white/[0.03] inline-block px-4 py-1.5 rounded-full border border-white/10">
            Last updated: August 31, 2026
          </p>
        </div>

        {/* Layout Grid: Table of Contents + Document Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Table of Contents Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 sticky top-6 rounded-3xl border border-white/30 bg-gradient-to-b from-white/[0.12] via-white/[0.05] to-white/[0.02] backdrop-blur-3xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.45),0_0_35px_rgba(255,255,255,0.08)] space-y-4"
          >
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em] font-mono border-b border-white/15 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                Table of Contents
              </span>
              <span className="text-[10px] text-gray-400 font-normal">8 Sections</span>
            </h3>

            <nav className="space-y-1.5 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
              {TOC_SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className="w-full text-left flex items-center justify-between py-2 px-3 rounded-xl text-xs font-medium text-gray-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.15] border border-white/15 hover:border-white/40 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all group cursor-pointer"
                >
                  <span className="truncate pr-2">
                    <span className="font-mono text-purple-400 font-bold mr-2">{sec.number}.</span>
                    {sec.title}
                  </span>
                  <ChevronRight size={12} className="text-gray-400 group-hover:text-white shrink-0 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Legal Document Content Body */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-8 rounded-[32px] border border-white/30 bg-gradient-to-br from-white/[0.12] via-white/[0.04] to-black/95 backdrop-blur-3xl p-6 sm:p-10 lg:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.45),0_0_50px_rgba(255,255,255,0.06)] space-y-8 text-gray-200 text-sm sm:text-base leading-relaxed relative overflow-hidden"
          >
            {/* Specular White Glow Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none blur-[60px]" />
            {/* Overview / Preamble */}
            <section id="sec-overview" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <div className="space-y-3.5 pl-2 sm:pl-4 text-gray-300">
                <p>
                  These Platform Rules govern specific conduct on Murgii AI and Qreato Bolt (collectively, the "Service") and supplement, but do not replace, our Terms of Service. By using the Service, you agree to follow these rules.
                </p>
              </div>
            </section>

            {/* Section 1: One Account Per Person */}
            <section id="sec-1" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">1.</span>
                <span>One Account Per Person</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  Each individual may maintain only one account. Creating multiple accounts to obtain additional free-tier usage credits, circumvent a suspension, or otherwise gain an advantage not intended for a single user is prohibited and may result in suspension of all associated accounts.
                </p>
              </div>
            </section>

            {/* Section 2: Fair Use of Daily Credits */}
            <section id="sec-2" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">2.</span>
                <span>Fair Use of Daily Credits</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  Daily generation credits are allocated per subscription tier for genuine, individual use. Automating requests to the Service through scripts, bots, or other non-interactive means, or reselling access to your account or its credits to third parties, is prohibited.
                </p>
              </div>
            </section>

            {/* Section 3: Copy Score Challenge Conduct */}
            <section id="sec-3" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">3.</span>
                <span>Copy Score Challenge Conduct</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  When using the Copy Score Challenge feature: (a) do not submit copy that is not your own or that you do not have the right to submit for evaluation; (b) do not submit content that is unlawful, hateful, sexually explicit, or otherwise inappropriate for public display, as shared results may be publicly viewable; (c) do not attempt to manipulate, exploit, or reverse-engineer the scoring mechanism; and (d) shared challenge links are intended for genuine comparison and community engagement, not for spam or misleading promotional purposes unrelated to the Service.
                </p>
              </div>
            </section>

            {/* Section 4: Prompt Injection and System Manipulation */}
            <section id="sec-4" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">4.</span>
                <span>Prompt Injection and System Manipulation</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  You may not attempt to manipulate Murgii AI into ignoring its operating instructions, revealing its underlying system configuration, impersonating a different product or entity, or generating output designed to bypass the safeguards and behavior we have built into the Service.
                </p>
              </div>
            </section>

            {/* Section 5: Content You Generate */}
            <section id="sec-5" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">5.</span>
                <span>Content You Generate</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  You are responsible for how you use any Output generated through the Service, including copy, scores, and diagnostic feedback. Do not use the Service to generate marketing content that is deceptive, makes false claims, impersonates a real business or person without authorization, or violates advertising laws applicable to your use case.
                </p>
              </div>
            </section>

            {/* Section 6: Affiliate Program Conduct */}
            <section id="sec-6" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">6.</span>
                <span>Affiliate Program Conduct</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  If you participate in the Qreato Partner Program, you agree not to engage in self-referral, incentivized or misleading referral practices, spam, or any promotional method that violates the terms of the affiliate platform (Whop) or misrepresents the Service to potential referrals.
                </p>
              </div>
            </section>

            {/* Section 7: Enforcement */}
            <section id="sec-7" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">7.</span>
                <span>Enforcement</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  Violation of these Platform Rules may result in warnings, temporary suspension, permanent termination of your account, forfeiture of unpaid affiliate commissions related to the violation, and, where applicable, removal of publicly shared content, at our sole discretion, in addition to any rights available to us under our Terms of Service.
                </p>
              </div>
            </section>

            {/* Section 8: Contact */}
            <section id="sec-8" className="space-y-4 scroll-mt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">8.</span>
                <span>Contact</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  Questions about these Platform Rules can be sent to <a href="mailto:salmanhossain75313@gmail.com" className="text-purple-300 underline hover:text-white transition-colors">salmanhossain75313@gmail.com</a>, via WhatsApp at <a href="https://wa.me/8801975230313" target="_blank" rel="noreferrer" className="text-purple-300 underline hover:text-white transition-colors">+880 1975-230313</a>, or through Whop's support chat.
                </p>
              </div>
            </section>

          </motion.div>
        </div>

        {/* Footer Back Button */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-gray-200 transition-all cursor-pointer bg-white/10 hover:bg-white/15 px-6 py-3 rounded-xl border border-white/20 backdrop-blur-md shadow-lg"
          >
            <ArrowLeft size={14} />
            <span>Return to Murgii AI</span>
          </button>
        </div>

      </div>
    </div>
  );
};
