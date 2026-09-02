import React from "react";
import { ArrowLeft, Shield, Lock, ChevronRight, Mail, MessageCircle, ExternalLink, CheckCircle2, FileText, Database, Server, Cpu, CreditCard } from "lucide-react";
import { motion } from "motion/react";
import LightPillar from "./LightPillar";

interface TrustCentrePageProps {
  onGoToHome?: () => void;
  onGoToChat?: () => void;
  onNavigatePolicy?: (policyKey: string) => void;
}

const TOC_SECTIONS = [
  { id: "sec-transparency", number: "1", title: "Transparency, by Design" },
  { id: "sec-subprocessors", number: "2", title: "Our Subprocessors" },
  { id: "sec-control", number: "3", title: "Data You Control" },
  { id: "sec-policies", number: "4", title: "Our Policies" },
  { id: "sec-status", number: "5", title: "Service Status" },
  { id: "sec-questions", number: "6", title: "Questions & Contact" },
];

const SUBPROCESSORS = [
  { provider: "Supabase", purpose: "Database, authentication, data storage", icon: Database },
  { provider: "Vercel", purpose: "Application hosting", icon: Server },
  { provider: "Google (Gemini API)", purpose: "AI-powered copy and content generation", icon: Cpu },
  { provider: "Whop, Inc.", purpose: "Payment processing and subscription billing", icon: CreditCard },
];

const POLICY_LINKS = [
  { name: "Terms of Service", path: "/terms", key: "terms" },
  { name: "Privacy Policy", path: "/privacy", key: "privacy" },
  { name: "Security", path: "/security", key: "security" },
  { name: "Refund Policy", path: "/refund-policy", key: "refund" },
  { name: "Platform Rules", path: "/platform-rules", key: "platform-rules" },
  { name: "General Rules", path: "/general-rules", key: "general-rules" },
];

export const TrustCentrePage: React.FC<TrustCentrePageProps> = ({ onGoToHome, onGoToChat, onNavigatePolicy }) => {
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

  const handlePolicyClick = (e: React.MouseEvent, path: string, key: string) => {
    e.preventDefault();
    if (onNavigatePolicy) {
      onNavigatePolicy(key);
    } else if (typeof window !== "undefined") {
      window.history.pushState({}, "", path);
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
            <Shield size={14} className="text-purple-400" />
            <span>Trust & Compliance Hub</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4 shadow-sm">
            <Lock size={13} className="text-purple-400" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-white font-bold">
              Qreato Labs Transparency
            </span>
          </div>

          <h1 
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-nohemi leading-tight mb-4"
            style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            TRUST CENTRE
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
                <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                Navigation
              </span>
              <span className="text-[10px] text-gray-400 font-normal">6 Sections</span>
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
            {/* Section 1: Transparency, by design */}
            <section id="sec-transparency" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">1.</span>
                <span>Transparency, by Design</span>
              </h2>
              <div className="pl-2 sm:pl-4 text-gray-300">
                <p>
                  This page is a central place to understand how Qreato Labs handles your data, who we work with to run the Service, and where to find our full policies.
                </p>
              </div>
            </section>

            {/* Section 2: Our Subprocessors */}
            <section id="sec-subprocessors" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">2.</span>
                <span>Our Subprocessors</span>
              </h2>
              <div className="pl-2 sm:pl-4 space-y-4 text-gray-300">
                <p>
                  We work with the following third-party providers to operate Murgii AI and Qreato Bolt:
                </p>

                {/* Subprocessors Table / Clean Cards */}
                <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.02] backdrop-blur-md">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.05] font-mono text-xs uppercase text-white font-bold">
                        <th className="py-3.5 px-4 sm:px-6">Provider</th>
                        <th className="py-3.5 px-4 sm:px-6">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                      {SUBPROCESSORS.map((item, idx) => {
                        const IconComp = item.icon;
                        return (
                          <tr key={idx} className="hover:bg-white/[0.04] transition-colors">
                            <td className="py-3.5 px-4 sm:px-6 font-semibold text-white flex items-center gap-2.5">
                              <IconComp size={15} className="text-purple-400 shrink-0" />
                              <span>{item.provider}</span>
                            </td>
                            <td className="py-3.5 px-4 sm:px-6 text-gray-300">{item.purpose}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs sm:text-sm text-gray-400 italic">
                  We do not sell your data to any of these providers or any other third party, and we do not use your Inputs or Outputs to train AI models beyond what's described in our Privacy Policy.
                </p>
              </div>
            </section>

            {/* Section 3: Data You Control */}
            <section id="sec-control" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">3.</span>
                <span>Data You Control</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-1" />
                    <span>You can delete your saved Memory & Personalization data at any time from your account settings.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-1" />
                    <span>You can request a copy or deletion of your account data by contacting us directly.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-1" />
                    <span>Copy Score Challenge results you generate are only made public if you choose to share them.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4: Our Policies */}
            <section id="sec-policies" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">4.</span>
                <span>Our Policies</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {POLICY_LINKS.map((policy) => (
                    <a
                      key={policy.key}
                      href={policy.path}
                      onClick={(e) => handlePolicyClick(e, policy.path, policy.key)}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-gray-200 hover:text-white transition-all group cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
                        <FileText size={15} className="text-purple-400 group-hover:scale-110 transition-transform" />
                        <span>{policy.name}</span>
                      </span>
                      <ExternalLink size={13} className="text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 5: Service Status */}
            <section id="sec-status" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">5.</span>
                <span>Service Status</span>
              </h2>
              <div className="pl-2 sm:pl-4 text-gray-300">
                <p>
                  We do not currently operate a public status/uptime monitoring page. If you're experiencing an issue with the Service, please contact us directly and we'll investigate promptly.
                </p>
              </div>
            </section>

            {/* Section 6: Questions */}
            <section id="sec-questions" className="space-y-4 scroll-mt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">6.</span>
                <span>Questions</span>
              </h2>
              <div className="pl-2 sm:pl-4 space-y-4 text-gray-300">
                <p>
                  If you have questions about how we handle data or operate the Service, reach out:
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
              </div>
            </section>

            {/* Contact Call-To-Action Button */}
            <div className="pt-4 text-center border-t border-white/10">
              <a
                href="mailto:salmanhossain75313@gmail.com"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-900/30 hover:shadow-purple-700/50 transition-all cursor-pointer group"
              >
                <Mail size={16} className="group-hover:scale-110 transition-transform" />
                <span>Contact Support</span>
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
