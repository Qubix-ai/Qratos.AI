import React from "react";
import { ArrowLeft, BookOpen, Lock, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import LightPillar from "./LightPillar";

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
            <BookOpen size={14} className="text-purple-400" />
            <span>General Rules</span>
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
            GENERAL RULES
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
            className="lg:col-span-4 sticky top-6 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-3"
          >
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em] font-mono border-b border-white/10 pb-2.5 flex items-center justify-between">
              <span>Table of Contents</span>
              <span className="text-[10px] text-gray-400 font-normal">10 Sections</span>
            </h3>

            <nav className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
              {TOC_SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className="w-full text-left flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <span className="truncate pr-2">
                    <span className="font-mono text-purple-400 font-bold mr-2">{sec.number}.</span>
                    {sec.title}
                  </span>
                  <ChevronRight size={12} className="text-gray-500 group-hover:text-white shrink-0 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Legal Document Content Body */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-8 rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-black/80 backdrop-blur-3xl p-6 sm:p-10 lg:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2)] space-y-8 text-gray-200 text-sm sm:text-base leading-relaxed"
          >
            {/* Overview / Preamble */}
            <section id="sec-overview" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <div className="space-y-3.5 pl-2 sm:pl-4 text-gray-300">
                <p>
                  These General Rules describe the standards of conduct we expect from everyone who uses Murgii AI and Qreato Bolt (collectively, the "Service"). They apply alongside our Terms of Service, Privacy Policy, Platform Rules, and Refund Policy.
                </p>
              </div>
            </section>

            {/* Section 1: Act in Good Faith */}
            <section id="sec-1" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">1.</span>
                <span>Act in Good Faith</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  Use the Service for its intended purpose: creating persuasive, effective marketing copy and executing your creator or business goals. Do not use the Service to deceive, defraud, harass, or cause harm to any person or business.
                </p>
              </div>
            </section>

            {/* Section 2: Respect Intellectual Property */}
            <section id="sec-2" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">2.</span>
                <span>Respect Intellectual Property</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  Do not submit Inputs that infringe another person's or company's copyright, trademark, or other intellectual property rights. Do not use the Service to generate content that plagiarizes or closely imitates another creator's or brand's original, identifiable work without authorization.
                </p>
              </div>
            </section>

            {/* Section 3: No Impersonation */}
            <section id="sec-3" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">3.</span>
                <span>No Impersonation</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  Do not use the Service, your account, or any generated Output to impersonate Qreato Labs, Murgii AI, any Qreato Labs team member, or any other individual, brand, or organization in a misleading way.
                </p>
              </div>
            </section>

            {/* Section 4: No Abuse of Support Channels */}
            <section id="sec-4" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">4.</span>
                <span>No Abuse of Support Channels</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  Communicate with our support team (via email, WhatsApp, or Whop support chat) respectfully. Abusive, threatening, or harassing communication toward our team will not be tolerated and may result in account suspension.
                </p>
              </div>
            </section>

            {/* Section 5: No Circumvention */}
            <section id="sec-5" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">5.</span>
                <span>No Circumvention</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  Do not attempt to bypass, disable, or interfere with any security measure, usage limit, subscription gate, or other technical restriction built into the Service.
                </p>
              </div>
            </section>

            {/* Section 6: Honest Representation */}
            <section id="sec-6" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">6.</span>
                <span>Honest Representation</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  If you publicly share Outputs generated through the Service, including Copy Score Challenge results, you agree not to misrepresent the nature of the Service, falsely claim results are not AI-assisted where such disclosure is legally required, or present Outputs in a way designed to mislead others about the Service's capabilities.
                </p>
              </div>
            </section>

            {/* Section 7: Compliance With Law */}
            <section id="sec-7" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">7.</span>
                <span>Compliance With Law</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  You are responsible for ensuring your use of the Service, and any content you create or publish using Outputs, complies with all laws and regulations applicable to you, including advertising, consumer protection, and data privacy laws in your jurisdiction.
                </p>
              </div>
            </section>

            {/* Section 8: Our Right to Enforce */}
            <section id="sec-8" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">8.</span>
                <span>Our Right to Enforce</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  We reserve the right to investigate suspected violations of these General Rules and to take any action we deem appropriate, including warnings, content removal, feature restrictions, or account termination, consistent with our Terms of Service.
                </p>
              </div>
            </section>

            {/* Section 9: Updates to These Rules */}
            <section id="sec-9" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">9.</span>
                <span>Updates to These Rules</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  We may update these General Rules from time to time to reflect changes in the Service or applicable law. Continued use of the Service after an update constitutes acceptance of the revised rules.
                </p>
              </div>
            </section>

            {/* Section 10: Contact */}
            <section id="sec-10" className="space-y-4 scroll-mt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">10.</span>
                <span>Contact</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  Questions about these General Rules can be sent to <a href="mailto:salmanhossain75313@gmail.com" className="text-purple-300 underline hover:text-white transition-colors">salmanhossain75313@gmail.com</a>, via WhatsApp at <a href="https://wa.me/8801975230313" target="_blank" rel="noreferrer" className="text-purple-300 underline hover:text-white transition-colors">+880 1975-230313</a>, or through Whop's support chat.
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
