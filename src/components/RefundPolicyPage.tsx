import React from "react";

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
            Qreato Labs
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
            Refund Policy
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Last updated: August 31, 2026
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="mb-12 pb-8 border-b border-zinc-800">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4 font-semibold">
            Table of Contents
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
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
                {sec.title}
              </a>
            ))}
          </div>
        </nav>

        {/* Document Body */}
        <main className="space-y-10 text-sm sm:text-base leading-relaxed text-zinc-300">
          {/* Overview */}
          <section id="sec-overview" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <p>
              This Refund Policy applies to all subscription purchases made for Murgii AI, Qreato Bolt, and related services offered by Qreato Labs (collectively, the "Service"), and forms part of our Terms of Service.
            </p>
          </section>

          {/* Section 1 */}
          <section id="sec-1" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              1. No Refunds
            </h2>
            <p>
              All payments for Core and Max subscription plans, and any other paid feature or add-on of the Service, are final and non-refundable once processed. This applies regardless of whether you have used the Service during the billing period, and regardless of the reason for cancellation, including but not limited to change of mind, dissatisfaction with Outputs, or discontinued use.
            </p>
          </section>

          {/* Section 2 */}
          <section id="sec-2" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              2. Cancel Anytime, No Future Charges
            </h2>
            <p>
              You may cancel your subscription at any time through your account settings or through Whop's customer portal. Cancelling stops all future billing, but does not entitle you to a refund for the current or any prior billing period. Your access to paid features will continue until the end of your current billing period, after which your account will revert to the free Basic plan.
            </p>
          </section>

          {/* Section 3 */}
          <section id="sec-3" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              3. Billing Errors
            </h2>
            <p>
              If you believe you were charged in error — for example, a duplicate charge, an incorrect amount, or a charge after you properly cancelled before your renewal date — contact us within 14 days of the charge at the details in Section 5 below. We will investigate and, where a genuine billing error on our part is confirmed, issue a corrective refund or credit for that specific charge.
            </p>
          </section>

          {/* Section 4 */}
          <section id="sec-4" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              4. Legal Requirements
            </h2>
            <p>
              Where applicable law in your jurisdiction grants you a non-waivable right to a refund or cancellation period, this Policy does not limit those rights. Nothing in this Policy is intended to override any statutory consumer protection you may be legally entitled to.
            </p>
          </section>

          {/* Section 5 */}
          <section id="sec-5" className="space-y-3 scroll-mt-8">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              5. Contact
            </h2>
            <p>
              Questions about this Refund Policy, or a billing error to report, can be sent to <a href="mailto:salmanhossain75313@gmail.com" className="text-zinc-200 underline hover:text-white transition-colors">salmanhossain75313@gmail.com</a>, via WhatsApp at <a href="https://wa.me/8801975230313" target="_blank" rel="noreferrer" className="text-zinc-200 underline hover:text-white transition-colors">+880 1975-230313</a>, or through Whop's support chat.
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
