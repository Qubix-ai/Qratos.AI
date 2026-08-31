import React from "react";
import { ArrowLeft, Newspaper, Lock, ChevronRight, Mail, ExternalLink, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import LightPillar from "./LightPillar";

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
            <Newspaper size={14} className="text-purple-400" />
            <span>Media & Press</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4 shadow-sm">
            <Lock size={13} className="text-purple-400" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-white font-bold">
              Qreato Labs Press Room
            </span>
          </div>

          <h1 
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-nohemi leading-tight mb-4"
            style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            MEDIA
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
              <span>Navigation</span>
              <span className="text-[10px] text-gray-400 font-normal">4 Sections</span>
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

          {/* Document Content Body */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-8 rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-black/80 backdrop-blur-3xl p-6 sm:p-10 lg:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2)] space-y-8 text-gray-200 text-sm sm:text-base leading-relaxed"
          >
            {/* Section 1: About Qreato Labs */}
            <section id="sec-about" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">1.</span>
                <span>About Qreato Labs</span>
              </h2>
              <div className="pl-2 sm:pl-4 text-gray-300">
                <p>
                  Qreato Labs is the studio behind Murgii AI and Qreato Bolt — a connected system helping creators and founders turn ideas into persuasive marketing copy and executable business growth. Murgii AI is a dedicated copywriting engine trained specifically for direct-response marketing; Qreato Bolt is a structured execution roadmap for building and scaling a digital product business.
                </p>
              </div>
            </section>

            {/* Section 2: Company Facts */}
            <section id="sec-facts" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">2.</span>
                <span>Company Facts</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <ul className="space-y-2 list-disc list-inside text-gray-300">
                  <li><strong className="text-white font-semibold">Founded:</strong> 2026</li>
                  <li><strong className="text-white font-semibold">Products:</strong> Murgii AI, Qreato Bolt</li>
                  <li><strong className="text-white font-semibold">Headquarters:</strong> Remote-first</li>
                  <li>
                    <strong className="text-white font-semibold">Website:</strong>{" "}
                    <a 
                      href="https://murgii.vercel.app" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-purple-300 underline hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      murgii.vercel.app
                      <ExternalLink size={12} className="inline opacity-70" />
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3: Brand Assets */}
            <section id="sec-assets" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">3.</span>
                <span>Brand Assets</span>
              </h2>
              <div className="pl-2 sm:pl-4 text-gray-300">
                <p>
                  For logo files, brand colors, and usage guidelines, contact us directly using the details below. We're happy to provide high-resolution assets for approved press or partnership use.
                </p>
              </div>
            </section>

            {/* Section 4: Media Inquiries */}
            <section id="sec-inquiries" className="space-y-4 scroll-mt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">4.</span>
                <span>Media Inquiries</span>
              </h2>
              <div className="pl-2 sm:pl-4 space-y-4 text-gray-300">
                <p>
                  For interview requests, press inquiries, or partnership coverage, reach out to:
                </p>
                
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
                  We aim to respond to media inquiries within 2-3 business days.
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
                <span>Contact Media Team</span>
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
