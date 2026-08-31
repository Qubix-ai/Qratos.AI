import React from "react";
import { ArrowLeft, ShieldCheck, FileText, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import LightPillar from "./LightPillar";

interface TermsPageProps {
  onGoToHome?: () => void;
  onGoToChat?: () => void;
}

const TOC_SECTIONS = [
  { id: "section-1", number: "1", title: "The Service" },
  { id: "section-2", number: "2", title: "Eligibility and Accounts" },
  { id: "section-3", number: "3", title: "Subscriptions, Billing, and Free Tier" },
  { id: "section-4", number: "4", title: "Copy Score Challenge and Public Sharing" },
  { id: "section-5", number: "5", title: "Acceptable Use" },
  { id: "section-6", number: "6", title: "Ownership and License" },
  { id: "section-7", number: "7", title: "Termination" },
  { id: "section-8", number: "8", title: "Disclaimer of Warranties" },
  { id: "section-9", number: "9", title: "Limitation of Liability" },
  { id: "section-10", number: "10", title: "Indemnification" },
  { id: "section-11", number: "11", title: "Governing Law and Disputes" },
  { id: "section-12", number: "12", title: "Changes to These Terms" },
  { id: "section-13", number: "13", title: "Contact" },
];

export const TermsPage: React.FC<TermsPageProps> = ({ onGoToHome, onGoToChat }) => {
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
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Legal Documentation</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4 shadow-sm">
            <FileText size={13} className="text-purple-400" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-white font-bold">
              Qreato Labs Legal
            </span>
          </div>

          <h1 
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-nohemi leading-tight mb-4"
            style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            TERMS OF SERVICE
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
              <span className="text-[10px] text-gray-400 font-normal">13 Sections</span>
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
            {/* Preamble */}
            <div className="space-y-4 pb-6 border-b border-white/10 text-gray-300">
              <p>
                Welcome to Murgii, a product of Qreato Labs ("Qreato Labs," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of Murgii AI, Qreato Bolt, and any related websites, applications, and services (collectively, the "Service"), including murgii.vercel.app and any successor domains. By creating an account or otherwise using the Service, you agree to be bound by these Terms and our Privacy Policy.
              </p>
              <p>
                If you are using the Service on behalf of a company or organization, you represent that you have the authority to bind that entity to these Terms.
              </p>
            </div>

            {/* Section 1 */}
            <section id="section-1" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">1.</span>
                <span>The Service</span>
              </h2>
              <div className="space-y-3.5 pl-2 sm:pl-4">
                <p>
                  <strong className="text-white font-semibold">1.1 Description.</strong> Qreato Labs operates a creator monetization studio consisting of two connected products: Qreato Bolt, an execution roadmap application, and Murgii AI, an AI-powered copywriting and content generation engine. Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable right to access and use the Service.
                </p>
                <p>
                  <strong className="text-white font-semibold">1.2 Content.</strong> You may submit prompts, briefs, copy, or other information to the Service ("Inputs") and receive AI-generated text, scores, diagnoses, or other output in response ("Outputs") (Inputs and Outputs are collectively "Content"). You represent and warrant that you have all rights necessary to submit your Inputs and that your Inputs do not violate any third party's rights.
                </p>
                <p>
                  <strong className="text-white font-semibold">1.3 AI-Generated Output Disclaimer.</strong> Murgii AI uses large language model technology to generate Outputs, including copy, scores, and diagnostic feedback (such as the Copy Score Challenge feature). You acknowledge and agree that: (a) Outputs are generated automatically and may contain errors, inaccuracies, or content that is not suitable for your intended use; (b) Copy Score results are diagnostic estimates based on persuasion-writing heuristics and are NOT a guarantee, prediction, or warranty of actual marketing performance, conversion rates, sales, or any real-world business outcome; (c) you are solely responsible for reviewing, editing, and verifying any Output before using it for any commercial, marketing, or public purpose; and (d) we do not warrant that Outputs are original, non-infringing, or free from similarity to content generated for other users.
                </p>
                <p>
                  <strong className="text-white font-semibold">1.4 Beta and Evolving Features.</strong> Certain features of the Service, including but not limited to the Copy Score Challenge, Prompt Builder, and Business Blueprint Studio, may be offered on an evolving, beta, or early-access basis. Such features are provided "as is" and may be modified, limited, or discontinued at any time without notice or liability to you.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">2.</span>
                <span>Eligibility and Accounts</span>
              </h2>
              <div className="space-y-3.5 pl-2 sm:pl-4">
                <p>
                  <strong className="text-white font-semibold">2.1</strong> You must be at least 18 years old, or the age of legal majority in your jurisdiction if higher, to use the Service.
                </p>
                <p>
                  <strong className="text-white font-semibold">2.2</strong> To access most features, you must register for an account using accurate, current information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at support@qreato.io (or via the contact methods listed in Section 13) if you suspect unauthorized use of your account.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">3.</span>
                <span>Subscriptions, Billing, and Free Tier</span>
              </h2>
              <div className="space-y-3.5 pl-2 sm:pl-4">
                <p>
                  <strong className="text-white font-semibold">3.1 Plans.</strong> The Service is offered under multiple tiers: a free Basic plan with limited daily usage credits, and paid Core and Max subscription plans with expanded daily usage credits and additional features, as described on our Pricing page.
                </p>
                <p>
                  <strong className="text-white font-semibold">3.2 Billing.</strong> Paid subscriptions are billed on a recurring monthly basis through our third-party payment processor, Whop, Inc. ("Whop"). By subscribing to a paid plan, you authorize Whop to charge your chosen payment method on a recurring basis until you cancel. Your use of Whop's payment services is subject to Whop's own terms and privacy policy. We are not responsible for Whop's handling of your payment information.
                </p>
                <p>
                  <strong className="text-white font-semibold">3.3 Cancellation.</strong> You may cancel your subscription at any time through your account settings or Whop's customer portal. Cancellation will take effect at the end of your current billing period. Except as required by law, fees already paid are non-refundable.
                </p>
                <p>
                  <strong className="text-white font-semibold">3.4 Daily Usage Credits.</strong> Each plan includes a daily allotment of generation credits that resets on a 24-hour cycle. Unused credits do not roll over. We may adjust credit limits, features included in each tier, or pricing at any time, with reasonable notice provided through the Service for material changes.
                </p>
                <p>
                  <strong className="text-white font-semibold">3.5 Affiliate/Partner Program.</strong> Users who participate in the Qreato Partner Program may earn a commission on referred subscription purchases, as described in the Service. Commission structure, eligibility, and payout terms are governed by the terms presented at the time of enrollment via our third-party affiliate platform (Whop) and may be modified or discontinued at our discretion.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">4.</span>
                <span>Copy Score Challenge and Public Sharing</span>
              </h2>
              <div className="space-y-3.5 pl-2 sm:pl-4">
                <p>
                  <strong className="text-white font-semibold">4.1</strong> If you use the Copy Score Challenge feature, you acknowledge that the copy you submit, your resulting score, and a shareable link to your results may be made publicly accessible via a unique URL, for the purpose of the feature's sharing and challenge mechanic. Do not submit copy containing confidential, proprietary, or sensitive information that you do not wish to be publicly viewable.
                </p>
                <p>
                  <strong className="text-white font-semibold">4.2</strong> We do not guarantee that publicly shared Copy Score results will remain available indefinitely and may remove or disable any shared result at our discretion, including for content that violates these Terms.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">5.</span>
                <span>Acceptable Use</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  You agree not to: (a) use the Service to generate content that is unlawful, defamatory, fraudulent, or infringes any third party's intellectual property or other rights; (b) reverse engineer, decompile, or attempt to extract the underlying models, prompts, or source code of the Service; (c) use the Service to build or train a competing product; (d) scrape, harvest, or programmatically extract data from the Service without our written permission; (e) circumvent or attempt to circumvent usage limits, credit restrictions, or access controls; (f) misrepresent your identity or affiliation, including impersonating Qreato Labs or Murgii AI; or (g) use the Service in any way that violates applicable law.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">6.</span>
                <span>Ownership and License</span>
              </h2>
              <div className="space-y-3.5 pl-2 sm:pl-4">
                <p>
                  <strong className="text-white font-semibold">6.1 Our IP.</strong> Qreato Labs owns and retains all right, title, and interest in the Service, including its underlying software, design, trademarks, and the Murgii AI brand, excluding your Content.
                </p>
                <p>
                  <strong className="text-white font-semibold">6.2 Your Content.</strong> As between you and us, you retain ownership of your Inputs. Subject to your compliance with these Terms, we assign to you our right, title, and interest, if any, in the Outputs generated specifically for you, except for Outputs made publicly available through features like Copy Score Challenge sharing.
                </p>
                <p>
                  <strong className="text-white font-semibold">6.3 License to Operate the Service.</strong> You grant us a limited license to process, store, and use your Content solely as necessary to provide, maintain, and improve the Service.
                </p>
                <p>
                  <strong className="text-white font-semibold">6.4 Feedback.</strong> If you provide us with suggestions, ideas, or feedback about the Service, you grant us the right to use that feedback without restriction or compensation to you.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">7.</span>
                <span>Termination</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  We may suspend or terminate your access to the Service at any time, with or without notice, for conduct that we believe violates these Terms, creates risk or legal exposure for us, or for any other reason at our discretion, including extended account inactivity. You may stop using the Service and close your account at any time. Sections 1.3, 4, 5, 6, 8, 9, 10, and 11 will survive termination of these Terms.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">8.</span>
                <span>Disclaimer of Warranties</span>
              </h2>
              <div className="pl-2 sm:pl-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <p className="text-xs sm:text-sm uppercase font-mono tracking-wide text-gray-300 leading-relaxed font-semibold">
                  THE SERVICE AND ALL OUTPUTS ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT ANY OUTPUT WILL ACHIEVE ANY PARTICULAR MARKETING, CONVERSION, OR BUSINESS RESULT.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">9.</span>
                <span>Limitation of Liability</span>
              </h2>
              <div className="pl-2 sm:pl-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <p className="text-xs sm:text-sm uppercase font-mono tracking-wide text-gray-300 leading-relaxed font-semibold">
                  TO THE FULLEST EXTENT PERMITTED BY LAW, QREATO LABS AND ITS OWNERS, EMPLOYEES, AND CONTRACTORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ANY CLAIM ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE THREE (3) MONTHS PRECEDING THE CLAIM, OR (B) FIFTY U.S. DOLLARS ($50).
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="section-10" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">10.</span>
                <span>Indemnification</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  You agree to defend, indemnify, and hold harmless Qreato Labs and its owners, employees, and contractors from any claims, damages, liabilities, and expenses (including reasonable legal fees) arising from: (a) your use or misuse of the Service; (b) your violation of these Terms; or (c) your Content, including any claim that your Inputs or your use of Outputs infringes a third party's rights.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section id="section-11" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">11.</span>
                <span>Governing Law and Disputes</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  These Terms are governed by the laws of the State of <strong className="text-white">Delaware</strong>, United States, without regard to conflict of law principles. Any dispute arising from these Terms or the Service will be resolved exclusively in the state or federal courts located in <strong className="text-white">[STATE — confirm]</strong>, and you consent to the personal jurisdiction of those courts.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section id="section-12" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">12.</span>
                <span>Changes to These Terms</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  We may update these Terms from time to time. Material changes will be indicated by updating the "Last updated" date above and, where appropriate, through notice within the Service. Your continued use of the Service after changes take effect constitutes acceptance of the revised Terms.
                </p>
              </div>
            </section>

            {/* Section 13 */}
            <section id="section-13" className="space-y-4 scroll-mt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">13.</span>
                <span>Contact</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  Questions about these Terms can be sent to <a href="mailto:salmanhossain75313@gmail.com" className="text-purple-300 underline hover:text-white transition-colors">salmanhossain75313@gmail.com</a>, via WhatsApp at <a href="https://wa.me/8801975230313" target="_blank" rel="noreferrer" className="text-purple-300 underline hover:text-white transition-colors">+880 1975-230313</a>, or through Whop's support chat.
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
