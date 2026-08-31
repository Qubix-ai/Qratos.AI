import React from "react";
import { ArrowLeft, RefreshCw, Lock, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import LightPillar from "./LightPillar";

interface RefundPolicyPageProps {
  onGoToHome?: () => void;
  onGoToChat?: () => void;
}

const TOC_SECTIONS = [
  { id: "sec-overview", number: "•", title: "Overview" },
  { id: "sec-1", number: "1", title: "No Refunds" },
  { id: "sec-2", number: "2", title: "Cancel Anytime, No Future Charges" },
  { id: "sec-3", number: "3", title: "Billing Errors" },
  { id: "sec-4", number: "4", title: "Legal Requirements" },
  { id: "sec-5", number: "5", title: "Contact" },
];

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onGoToHome, onGoToChat }) => {
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
            <RefreshCw size={14} className="text-purple-400" />
            <span>Refund Policy</span>
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
            REFUND POLICY
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
              <span className="text-[10px] text-gray-400 font-normal">5 Sections</span>
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
                  This Refund Policy applies to all subscription purchases made for Murgii AI, Qreato Bolt, and related services offered by Qreato Labs (collectively, the "Service"), and forms part of our Terms of Service.
                </p>
              </div>
            </section>

            {/* Section 1: No Refunds */}
            <section id="sec-1" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">1.</span>
                <span>No Refunds</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  All payments for Core and Max subscription plans, and any other paid feature or add-on of the Service, are final and non-refundable once processed. This applies regardless of whether you have used the Service during the billing period, and regardless of the reason for cancellation, including but not limited to change of mind, dissatisfaction with Outputs, or discontinued use.
                </p>
              </div>
            </section>

            {/* Section 2: Cancel Anytime, No Future Charges */}
            <section id="sec-2" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">2.</span>
                <span>Cancel Anytime, No Future Charges</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  You may cancel your subscription at any time through your account settings or through Whop's customer portal. Cancelling stops all future billing, but does not entitle you to a refund for the current or any prior billing period. Your access to paid features will continue until the end of your current billing period, after which your account will revert to the free Basic plan.
                </p>
              </div>
            </section>

            {/* Section 3: Billing Errors */}
            <section id="sec-3" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">3.</span>
                <span>Billing Errors</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  If you believe you were charged in error — for example, a duplicate charge, an incorrect amount, or a charge after you properly cancelled before your renewal date — contact us within 14 days of the charge at the details in Section 5 below. We will investigate and, where a genuine billing error on our part is confirmed, issue a corrective refund or credit for that specific charge.
                </p>
              </div>
            </section>

            {/* Section 4: Legal Requirements */}
            <section id="sec-4" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">4.</span>
                <span>Legal Requirements</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  Where applicable law in your jurisdiction grants you a non-waivable right to a refund or cancellation period, this Policy does not limit those rights. Nothing in this Policy is intended to override any statutory consumer protection you may be legally entitled to.
                </p>
              </div>
            </section>

            {/* Section 5: Contact */}
            <section id="sec-5" className="space-y-4 scroll-mt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">5.</span>
                <span>Contact</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  Questions about this Refund Policy, or a billing error to report, can be sent to <a href="mailto:salmanhossain75313@gmail.com" className="text-purple-300 underline hover:text-white transition-colors">salmanhossain75313@gmail.com</a>, via WhatsApp at <a href="https://wa.me/8801975230313" target="_blank" rel="noreferrer" className="text-purple-300 underline hover:text-white transition-colors">+880 1975-230313</a>, or through Whop's support chat.
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
