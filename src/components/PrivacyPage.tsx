import React from "react";

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
    <div className="min-h-screen bg-[#07060B] text-zinc-300 selection:bg-zinc-800 selection:text-white py-12 md:py-20 px-4 sm:px-6">
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
            Privacy Policy
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
                {sec.number}. {sec.title}
              </a>
            ))}
          </div>
        </nav>

        {/* Document Body */}
        <main className="space-y-10 text-sm sm:text-base leading-relaxed text-zinc-300">
          {/* Introduction */}
          <section id="sec-intro" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              Introduction
            </h2>
            <p>
              Qreato Labs ("Qreato Labs," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard personal data when you use Murgii AI, Qreato Bolt, and related websites and applications (collectively, the "Service"), including murgii.vercel.app and any successor domains. By accessing or using the Service, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </section>

          {/* Section 1 */}
          <section id="sec-1" className="space-y-4 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              1. Personal Data We Collect
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-medium text-white">A. Personal data you provide to us directly</h3>
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

              <div className="space-y-2 pt-2">
                <h3 className="text-sm sm:text-base font-medium text-white">B. Personal data we receive automatically</h3>
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

              <div className="space-y-2 pt-2">
                <h3 className="text-sm sm:text-base font-medium text-white">C. Information We Do Not Knowingly Collect</h3>
                <p>
                  We do not knowingly collect sensitive personal information such as health data, biometric data, or government identification numbers. We do not knowingly collect information from or direct the Service to individuals under the age of 18.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="sec-2" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              2. How We Use Personal Data
            </h2>
            <p>
              We use personal data to: (a) provide, operate, and maintain the Service, including generating Outputs from your Inputs; (b) create and manage your account and process payments; (c) enforce daily usage credit limits associated with your subscription tier; (d) personalize Outputs using information you've saved via Memory & Personalization; (e) communicate with you about your account or the Service; (f) improve and develop the Service; (g) detect, prevent, and investigate fraud, abuse, or violations of our Terms of Service; and (h) comply with legal obligations.
            </p>
            <p>
              We do not use your Inputs or Outputs to train AI models, except where necessary to investigate suspected violations of our Terms of Service or where you have explicitly submitted content to us as feedback.
            </p>
          </section>

          {/* Section 3 */}
          <section id="sec-3" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              3. How We Share Personal Data
            </h2>
            <p>
              We may disclose personal data in the following circumstances:
            </p>
            <p>
              <strong className="text-white font-medium">AI Processing Subprocessor.</strong> To generate Outputs, your Inputs are transmitted to Google LLC's Gemini API for processing. Google processes this data as our subprocessor, solely to return a generated response, and in accordance with Google's own data handling terms for its API services. We do not control and are not responsible for Google's independent processing of this data beyond what is necessary to provide the Service to you.
            </p>
            <p>
              <strong className="text-white font-medium">Payment Processing.</strong> Payment-related information is shared with Whop, Inc. to process subscriptions and, where applicable, affiliate commission payouts.
            </p>
            <p>
              <strong className="text-white font-medium">Infrastructure and Service Providers.</strong> We use third-party infrastructure providers, including Supabase (database and authentication hosting) and Vercel (application hosting), to operate the Service. These providers process personal data only as necessary to support our operations.
            </p>
            <p>
              <strong className="text-white font-medium">Public Sharing Features.</strong> If you use the Copy Score Challenge feature, your submitted copy, resulting scores, and a shareable link may become publicly accessible, as described in our Terms of Service.
            </p>
            <p>
              <strong className="text-white font-medium">Legal Compliance and Protection of Rights.</strong> We may disclose personal data where required by law, legal process, or government request, or where necessary to protect the rights, safety, or property of Qreato Labs, our users, or the public.
            </p>
            <p>
              <strong className="text-white font-medium">Business Transfers.</strong> If Qreato Labs is involved in a merger, acquisition, or sale of assets, personal data may be transferred as part of that transaction.
            </p>
            <p className="pt-2 text-white font-medium">
              We do not sell your personal data, and we do not share it for cross-contextual behavioral advertising or targeted advertising purposes.
            </p>
          </section>

          {/* Section 4 */}
          <section id="sec-4" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              4. Retention
            </h2>
            <p>
              We retain personal data for as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce our agreements. Chat history, generation history, and Memory & Personalization data are retained until you delete them or close your account, subject to any applicable tier-based history limits described in our Terms of Service. When data is no longer needed, we take reasonable steps to delete or de-identify it.
            </p>
          </section>

          {/* Section 5 */}
          <section id="sec-5" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              5. Security
            </h2>
            <p>
              We implement reasonable technical and organizational measures designed to protect personal data against loss, misuse, and unauthorized access. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 6 */}
          <section id="sec-6" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              6. Your Rights and Choices
            </h2>
            <p>
              Depending on your jurisdiction, you may have rights to access, correct, delete, or export your personal data, or to object to or restrict certain processing. To exercise these rights, contact us using the details in Section 11. We may need to verify your identity before fulfilling your request. We will not discriminate against you for exercising your privacy rights.
            </p>
            <p>
              Please note that due to the nature of AI-generated Outputs, we cannot guarantee the correction or removal of information already reflected in previously generated Outputs that you have saved, downloaded, or shared outside the Service.
            </p>
          </section>

          {/* Section 7 */}
          <section id="sec-7" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              7. Children's Privacy
            </h2>
            <p>
              The Service is not directed to individuals under the age of 18, and we do not knowingly collect personal data from children. If we learn that we have collected personal data from a child under 18, we will take steps to delete it.
            </p>
          </section>

          {/* Section 8 */}
          <section id="sec-8" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              8. International Data Transfers
            </h2>
            <p>
              Qreato Labs and its service providers may process and store personal data in the United States and other countries. By using the Service, you understand that your personal data may be transferred to, and processed in, countries other than your country of residence, which may have different data protection laws.
            </p>
          </section>

          {/* Section 9 */}
          <section id="sec-9" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will indicate changes by updating the "Last updated" date above. Your continued use of the Service after changes take effect constitutes your acceptance of the revised policy.
            </p>
          </section>

          {/* Section 10 */}
          <section id="sec-10" className="space-y-3 scroll-mt-8">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              10. Contacting Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise your privacy rights, contact us at <a href="mailto:salmanhossain75313@gmail.com" className="text-zinc-200 underline hover:text-white transition-colors">salmanhossain75313@gmail.com</a>, via WhatsApp at <a href="https://wa.me/8801975230313" target="_blank" rel="noreferrer" className="text-zinc-200 underline hover:text-white transition-colors">+880 1975-230313</a>, or through Whop's support chat.
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
