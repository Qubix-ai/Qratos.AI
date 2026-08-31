import React from "react";
import { ArrowLeft, ShieldCheck, Lock, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import LightPillar from "./LightPillar";

interface PrivacyPageProps {
  onGoToHome?: () => void;
  onGoToChat?: () => void;
}

const TOC_SECTIONS = [
  { id: "sec-intro", number: "1", title: "Introduction" },
  { id: "sec-1", number: "2", title: "Personal Data We Collect" },
  { id: "sec-2", number: "3", title: "How We Use Personal Data" },
  { id: "sec-3", number: "4", title: "How We Share Personal Data" },
  { id: "sec-4", number: "5", title: "Retention" },
  { id: "sec-5", number: "6", title: "Security" },
  { id: "sec-6", number: "7", title: "Your Rights and Choices" },
  { id: "sec-7", number: "8", title: "Children's Privacy" },
  { id: "sec-8", number: "9", title: "International Data Transfers" },
  { id: "sec-9", number: "10", title: "Changes to This Policy" },
  { id: "sec-10", number: "11", title: "Contacting Us" },
];

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onGoToHome, onGoToChat }) => {
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
            <span>Privacy Documentation</span>
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
            PRIVACY POLICY
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
              <span className="text-[10px] text-gray-400 font-normal">11 Sections</span>
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
            {/* Introduction */}
            <section id="sec-intro" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span>Introduction</span>
              </h2>
              <div className="space-y-3.5 pl-2 sm:pl-4 text-gray-300">
                <p>
                  Qreato Labs ("Qreato Labs," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard personal data when you use Murgii AI, Qreato Bolt, and related websites and applications (collectively, the "Service"), including murgii.vercel.app and any successor domains. By accessing or using the Service, you acknowledge that you have read and understood this Privacy Policy.
                </p>
              </div>
            </section>

            {/* Section 1: Personal Data We Collect */}
            <section id="sec-1" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">1.</span>
                <span>Personal Data We Collect</span>
              </h2>
              <div className="space-y-5 pl-2 sm:pl-4">
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-white">A. Personal data you provide to us directly</h3>
                  <p>
                    <strong className="text-white font-medium">Account Information.</strong> When you create an account, we collect your email address and authentication credentials.
                  </p>
                  <p>
                    <strong className="text-white font-medium">Payment Information.</strong> If you subscribe to a paid plan, payment is processed by our third-party payment processor, Whop, Inc. We do not directly collect or store your full payment card details; Whop handles this in accordance with its own privacy policy.
                  </p>
                  <p>
                    <strong className="text-white font-medium">Inputs and Outputs.</strong> The Service allows you to submit prompts, briefs, and copy ("Inputs") to generate AI-written text, scores, and diagnostic feedback ("Outputs"). If you include personal data in your Inputs, we will process that information and it may appear in the resulting Outputs.
                  </p>
                  <p>
                    <strong className="text-white font-medium">Personalization Data.</strong> If you use the Memory & Personalization feature, we collect and store the business, niche, tone, and preference information you choose to provide, in order to personalize future generations.
                  </p>
                  <p>
                    <strong className="text-white font-medium">Communication Information.</strong> If you contact us for support, we collect your name, contact details, and the contents of your message.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-semibold text-white">B. Personal data we receive automatically</h3>
                  <p>
                    <strong className="text-white font-medium">Device and Log Information.</strong> We automatically receive technical information such as your IP address, browser type, device type, operating system, and error logs when you use the Service.
                  </p>
                  <p>
                    <strong className="text-white font-medium">Usage Data.</strong> We collect information about how you use the Service, including which features and modes you access, generation activity, and timestamps, primarily to enforce daily usage limits tied to your subscription plan.
                  </p>
                  <p>
                    <strong className="text-white font-medium">Cookies and Similar Technologies.</strong> We use cookies and similar technologies to operate the Service, keep you logged in, and understand how the Service is used.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-semibold text-white">C. Information We Do Not Knowingly Collect</h3>
                  <p>
                    We do not knowingly collect sensitive personal information such as health data, biometric data, or government identification numbers. We do not knowingly collect information from or direct the Service to individuals under the age of 18.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: How We Use Personal Data */}
            <section id="sec-2" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">2.</span>
                <span>How We Use Personal Data</span>
              </h2>
              <div className="space-y-3.5 pl-2 sm:pl-4">
                <p>
                  We use personal data to: (a) provide, operate, and maintain the Service, including generating Outputs from your Inputs; (b) create and manage your account and process payments; (c) enforce daily usage credit limits associated with your subscription tier; (d) personalize Outputs using information you've saved via Memory & Personalization; (e) communicate with you about your account or the Service; (f) improve and develop the Service; (g) detect, prevent, and investigate fraud, abuse, or violations of our Terms of Service; and (h) comply with legal obligations.
                </p>
                <p>
                  We do not use your Inputs or Outputs to train AI models, except where necessary to investigate suspected violations of our Terms of Service or where you have explicitly submitted content to us as feedback.
                </p>
              </div>
            </section>

            {/* Section 3: How We Share Personal Data */}
            <section id="sec-3" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">3.</span>
                <span>How We Share Personal Data</span>
              </h2>
              <div className="space-y-3.5 pl-2 sm:pl-4">
                <p>
                  We may disclose personal data in the following circumstances:
                </p>
                <p>
                  <strong className="text-white font-semibold">AI Processing Subprocessor.</strong> To generate Outputs, your Inputs are transmitted to Google LLC's Gemini API for processing. Google processes this data as our subprocessor, solely to return a generated response, and in accordance with Google's own data handling terms for its API services. We do not control and are not responsible for Google's independent processing of this data beyond what is necessary to provide the Service to you.
                </p>
                <p>
                  <strong className="text-white font-semibold">Payment Processing.</strong> Payment-related information is shared with Whop, Inc. to process subscriptions and, where applicable, affiliate commission payouts.
                </p>
                <p>
                  <strong className="text-white font-semibold">Infrastructure and Service Providers.</strong> We use third-party infrastructure providers, including Supabase (database and authentication hosting) and Vercel (application hosting), to operate the Service. These providers process personal data only as necessary to support our operations.
                </p>
                <p>
                  <strong className="text-white font-semibold">Public Sharing Features.</strong> If you use the Copy Score Challenge feature, your submitted copy, resulting scores, and a shareable link may become publicly accessible, as described in our Terms of Service.
                </p>
                <p>
                  <strong className="text-white font-semibold">Legal Compliance and Protection of Rights.</strong> We may disclose personal data where required by law, legal process, or government request, or where necessary to protect the rights, safety, or property of Qreato Labs, our users, or the public.
                </p>
                <p>
                  <strong className="text-white font-semibold">Business Transfers.</strong> If Qreato Labs is involved in a merger, acquisition, or sale of assets, personal data may be transferred as part of that transaction.
                </p>
                <p className="pt-2 text-white font-semibold">
                  We do not sell your personal data, and we do not share it for cross-contextual behavioral advertising or targeted advertising purposes.
                </p>
              </div>
            </section>

            {/* Section 4: Retention */}
            <section id="sec-4" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">4.</span>
                <span>Retention</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  We retain personal data for as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce our agreements. Chat history, generation history, and Memory & Personalization data are retained until you delete them or close your account, subject to any applicable tier-based history limits described in our Terms of Service. When data is no longer needed, we take reasonable steps to delete or de-identify it.
                </p>
              </div>
            </section>

            {/* Section 5: Security */}
            <section id="sec-5" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">5.</span>
                <span>Security</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  We implement reasonable technical and organizational measures designed to protect personal data against loss, misuse, and unauthorized access. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            {/* Section 6: Your Rights and Choices */}
            <section id="sec-6" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">6.</span>
                <span>Your Rights and Choices</span>
              </h2>
              <div className="space-y-3.5 pl-2 sm:pl-4">
                <p>
                  Depending on your jurisdiction, you may have rights to access, correct, delete, or export your personal data, or to object to or restrict certain processing. To exercise these rights, contact us using the details in Section 11. We may need to verify your identity before fulfilling your request. We will not discriminate against you for exercising your privacy rights.
                </p>
                <p>
                  Please note that due to the nature of AI-generated Outputs, we cannot guarantee the correction or removal of information already reflected in previously generated Outputs that you have saved, downloaded, or shared outside the Service.
                </p>
              </div>
            </section>

            {/* Section 7: Children's Privacy */}
            <section id="sec-7" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">7.</span>
                <span>Children's Privacy</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  The Service is not directed to individuals under the age of 18, and we do not knowingly collect personal data from children. If we learn that we have collected personal data from a child under 18, we will take steps to delete it.
                </p>
              </div>
            </section>

            {/* Section 8: International Data Transfers */}
            <section id="sec-8" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">8.</span>
                <span>International Data Transfers</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  Qreato Labs and its service providers may process and store personal data in the United States and other countries. By using the Service, you understand that your personal data may be transferred to, and processed in, countries other than your country of residence, which may have different data protection laws.
                </p>
              </div>
            </section>

            {/* Section 9: Changes to This Policy */}
            <section id="sec-9" className="space-y-4 scroll-mt-8 border-b border-white/10 pb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">9.</span>
                <span>Changes to This Policy</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  We may update this Privacy Policy from time to time. We will indicate changes by updating the "Last updated" date above. Your continued use of the Service after changes take effect constitutes your acceptance of the revised policy.
                </p>
              </div>
            </section>

            {/* Section 10: Contacting Us */}
            <section id="sec-10" className="space-y-4 scroll-mt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                <span className="font-mono text-purple-400 text-lg">10.</span>
                <span>Contacting Us</span>
              </h2>
              <div className="pl-2 sm:pl-4">
                <p>
                  If you have questions about this Privacy Policy or wish to exercise your privacy rights, contact us at <a href="mailto:salmanhossain75313@gmail.com" className="text-purple-300 underline hover:text-white transition-colors">salmanhossain75313@gmail.com</a>, via WhatsApp at <a href="https://wa.me/8801975230313" target="_blank" rel="noreferrer" className="text-purple-300 underline hover:text-white transition-colors">+880 1975-230313</a>, or through Whop's support chat.
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
