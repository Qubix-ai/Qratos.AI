import React from "react";
import { ArrowLeft, Building2, Lock, ChevronRight, Mail, MessageCircle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import LightPillar from "./LightPillar";

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
            <Building2 size={14} className="text-purple-400" />
            <span>Enterprise & Teams</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4 shadow-sm">
            <Lock size={13} className="text-purple-400" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-white font-bold">
              Qreato Labs Solutions
            </span>
          </div>

          <h1 
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-nohemi leading-tight mb-4"
            style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            ENTERPRISE & TEAMS
          </h1>

          <p className="text-xs sm:text-sm font-mono text-gray-400 bg-white/[0.03] inline-block px-4 py-1.5 rounded-full border border-white/10">
            Custom Team & Agency Inquiries
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
                <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                Navigation
              </span>
              <span className="text-[10px] text-gray-400 font-normal">4 Sections</span>
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

          {/* Document Content Body */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-8 rounded-[32px] border border-white/30 bg-gradient-to-br from-white/[0.12] via-white/[0.04] to-black/95 backdrop-blur-3xl p-6 sm:p-10 lg:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.45),0_0_50px_rgba(255,255,255,0.06)] space-y-8 text-gray-200 text-sm sm:text-base leading-relaxed relative overflow-hidden"
          >
            {/* Specular White Glow Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none blur-[60px]" />
            {/* Section 1: Scaling copy and execution across your organization */}
            <section id="sec-scaling" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">1.</span>
                <span>Scaling Copy and Execution Across Your Organization</span>
              </h2>
              <div className="pl-2 sm:pl-4 text-gray-300">
                <p>
                  If you're an agency, marketing team, or growing company that needs Murgii AI and Qreato Bolt across multiple people, we'd like to talk. We work directly with teams to figure out what setup actually fits — rather than forcing you into a rigid, one-size-fits-all plan.
                </p>
              </div>
            </section>

            {/* Section 2: What we can discuss */}
            <section id="sec-discuss" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">2.</span>
                <span>What We Can Discuss</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-1" />
                    <span>Multi-seat access for your team</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-1" />
                    <span>Custom daily generation volume based on your needs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-1" />
                    <span>Onboarding support to get your brand voice and workflows set up correctly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-1" />
                    <span>Priority support access</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3: How it works */}
            <section id="sec-works" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">3.</span>
                <span>How It Works</span>
              </h2>
              <div className="pl-2 sm:pl-4 text-gray-300">
                <p>
                  There's no separate self-serve enterprise plan today — every team engagement starts with a conversation so we can understand your actual usage and needs, and quote something fair for your situation.
                </p>
              </div>
            </section>

            {/* Section 4: Get in touch */}
            <section id="sec-contact" className="space-y-4 scroll-mt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">4.</span>
                <span>Get In Touch</span>
              </h2>
              <div className="pl-2 sm:pl-4 space-y-4 text-gray-300">
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 font-mono text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-purple-400 shrink-0" />
                    <span>Email: <a href="mailto:salmanhossain75313@gmail.com" className="text-purple-300 underline hover:text-white transition-colors">salmanhossain75313@gmail.com</a></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle size={16} className="text-purple-400 shrink-0" />
                    <span>WhatsApp: <a href="https://wa.me/8801975230313" target="_blank" rel="noreferrer" className="text-purple-300 underline hover:text-white transition-colors">+880 1975-230313</a></span>
                  </div>
                </div>

                <p className="text-gray-400 text-xs sm:text-sm italic">
                  We typically respond within 1-2 business days.
                </p>
              </div>
            </section>

            {/* Contact Call-To-Action Button */}
            <div className="pt-4 text-center border-t border-white/10">
              <a
                href="mailto:salmanhossain75313@gmail.com"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-900/30 hover:shadow-purple-700/50 transition-all cursor-pointer group"
              >
                <Mail size={16} className="group-hover:scale-110 transition-transform" />
                <span>Contact Team Sales</span>
              </a>
            </div>

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
