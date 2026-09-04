import React from "react";

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
            Terms of Service
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

        {/* Legal Document Content Body */}
        <main className="space-y-10 text-sm sm:text-base leading-relaxed text-zinc-300">
          {/* Preamble */}
          <div className="space-y-4 pb-8 border-b border-zinc-800">
            <p>
              Welcome to Murgii, a product of Qreato Labs ("Qreato Labs," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of Murgii AI, Qreato Bolt, and any related websites, applications, and services (collectively, the "Service"), including murgii.vercel.app and any successor domains. By creating an account or otherwise using the Service, you agree to be bound by these Terms and our Privacy Policy.
            </p>
            <p>
              If you are using the Service on behalf of a company or organization, you represent that you have the authority to bind that entity to these Terms.
            </p>
          </div>

          {/* Section 1 */}
          <section id="section-1" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              1. The Service
            </h2>
            <p>
              <strong className="text-white font-medium">1.1 Description.</strong> Qreato Labs operates a creator monetization studio consisting of two connected products: Qreato Bolt, an execution roadmap application, and Murgii AI, an AI-powered copywriting and content generation engine. Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable right to access and use the Service.
            </p>
            <p>
              <strong className="text-white font-medium">1.2 Content.</strong> You may submit prompts, briefs, copy, or other information to the Service ("Inputs") and receive AI-generated text, scores, diagnoses, or other output in response ("Outputs") (Inputs and Outputs are collectively "Content"). You represent and warrant that you have all rights necessary to submit your Inputs and that your Inputs do not violate any third party's rights.
            </p>
            <p>
              <strong className="text-white font-medium">1.3 AI-Generated Output Disclaimer.</strong> Murgii AI uses large language model technology to generate Outputs, including copy, scores, and diagnostic feedback (such as the Copy Score Challenge feature). You acknowledge and agree that: (a) Outputs are generated automatically and may contain errors, inaccuracies, or content that is not suitable for your intended use; (b) Copy Score results are diagnostic estimates based on persuasion-writing heuristics and are NOT a guarantee, prediction, or warranty of actual marketing performance, conversion rates, sales, or any real-world business outcome; (c) you are solely responsible for reviewing, editing, and verifying any Output before using it for any commercial, marketing, or public purpose; and (d) we do not warrant that Outputs are original, non-infringing, or free from similarity to content generated for other users.
            </p>
            <p>
              <strong className="text-white font-medium">1.4 Beta and Evolving Features.</strong> Certain features of the Service, including but not limited to the Copy Score Challenge, Prompt Builder, and Business Blueprint Studio, may be offered on an evolving, beta, or early-access basis. Such features are provided "as is" and may be modified, limited, or discontinued at any time without notice or liability to you.
            </p>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              2. Eligibility and Accounts
            </h2>
            <p>
              <strong className="text-white font-medium">2.1</strong> You must be at least 18 years old, or the age of legal majority in your jurisdiction if higher, to use the Service.
            </p>
            <p>
              <strong className="text-white font-medium">2.2</strong> To access most features, you must register for an account using accurate, current information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at support@qreato.io (or via the contact methods listed in Section 13) if you suspect unauthorized use of your account.
            </p>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              3. Subscriptions, Billing, and Free Tier
            </h2>
            <p>
              <strong className="text-white font-medium">3.1 Plans.</strong> The Service is offered under multiple tiers: a free Basic plan with limited daily usage credits, and paid Core and Max subscription plans with expanded daily usage credits and additional features, as described on our Pricing page.
            </p>
            <p>
              <strong className="text-white font-medium">3.2 Billing.</strong> Paid subscriptions are billed on a recurring monthly basis through our third-party payment processor, Whop, Inc. ("Whop"). By subscribing to a paid plan, you authorize Whop to charge your chosen payment method on a recurring basis until you cancel. Your use of Whop's payment services is subject to Whop's own terms and privacy policy. We are not responsible for Whop's handling of your payment information.
            </p>
            <p>
              <strong className="text-white font-medium">3.3 Cancellation.</strong> You may cancel your subscription at any time through your account settings or Whop's customer portal. Cancellation will take effect at the end of your current billing period. Except as required by law, fees already paid are non-refundable.
            </p>
            <p>
              <strong className="text-white font-medium">3.4 Daily Usage Credits.</strong> Each plan includes a daily allotment of generation credits that resets on a 24-hour cycle. Unused credits do not roll over. We may adjust credit limits, features included in each tier, or pricing at any time, with reasonable notice provided through the Service for material changes.
            </p>
            <p>
              <strong className="text-white font-medium">3.5 Affiliate/Partner Program.</strong> Users who participate in the Qreato Partner Program may earn a commission on referred subscription purchases, as described in the Service. Commission structure, eligibility, and payout terms are governed by the terms presented at the time of enrollment via our third-party affiliate platform (Whop) and may be modified or discontinued at our discretion.
            </p>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              4. Copy Score Challenge and Public Sharing
            </h2>
            <p>
              <strong className="text-white font-medium">4.1</strong> If you use the Copy Score Challenge feature, you acknowledge that the copy you submit, your resulting score, and a shareable link to your results may be made publicly accessible via a unique URL, for the purpose of the feature's sharing and challenge mechanic. Do not submit copy containing confidential, proprietary, or sensitive information that you do not wish to be publicly viewable.
            </p>
            <p>
              <strong className="text-white font-medium">4.2</strong> We do not guarantee that publicly shared Copy Score results will remain available indefinitely and may remove or disable any shared result at our discretion, including for content that violates these Terms.
            </p>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              5. Acceptable Use
            </h2>
            <p>
              You agree not to: (a) use the Service to generate content that is unlawful, defamatory, fraudulent, or infringes any third party's intellectual property or other rights; (b) reverse engineer, decompile, or attempt to extract the underlying models, prompts, or source code of the Service; (c) use the Service to build or train a competing product; (d) scrape, harvest, or programmatically extract data from the Service without our written permission; (e) circumvent or attempt to circumvent usage limits, credit restrictions, or access controls; (f) misrepresent your identity or affiliation, including impersonating Qreato Labs or Murgii AI; or (g) use the Service in any way that violates applicable law.
            </p>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              6. Ownership and License
            </h2>
            <p>
              <strong className="text-white font-medium">6.1 Our IP.</strong> Qreato Labs owns and retains all right, title, and interest in the Service, including its underlying software, design, trademarks, and the Murgii AI brand, excluding your Content.
            </p>
            <p>
              <strong className="text-white font-medium">6.2 Your Content.</strong> As between you and us, you retain ownership of your Inputs. Subject to your compliance with these Terms, we assign to you our right, title, and interest, if any, in the Outputs generated specifically for you, except for Outputs made publicly available through features like Copy Score Challenge sharing.
            </p>
            <p>
              <strong className="text-white font-medium">6.3 License to Operate the Service.</strong> You grant us a limited license to process, store, and use your Content solely as necessary to provide, maintain, and improve the Service.
            </p>
            <p>
              <strong className="text-white font-medium">6.4 Feedback.</strong> If you provide us with suggestions, ideas, or feedback about the Service, you grant us the right to use that feedback without restriction or compensation to you.
            </p>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              7. Termination
            </h2>
            <p>
              We may suspend or terminate your access to the Service at any time, with or without notice, for conduct that we believe violates these Terms, creates risk or legal exposure for us, or for any other reason at our discretion, including extended account inactivity. You may stop using the Service and close your account at any time. Sections 1.3, 4, 5, 6, 8, 9, 10, and 11 will survive termination of these Terms.
            </p>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              8. Disclaimer of Warranties
            </h2>
            <p className="text-xs sm:text-sm uppercase font-mono tracking-wide text-zinc-400 leading-relaxed font-semibold">
              THE SERVICE AND ALL OUTPUTS ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT ANY OUTPUT WILL ACHIEVE ANY PARTICULAR MARKETING, CONVERSION, OR BUSINESS RESULT.
            </p>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              9. Limitation of Liability
            </h2>
            <p className="text-xs sm:text-sm uppercase font-mono tracking-wide text-zinc-400 leading-relaxed font-semibold">
              TO THE FULLEST EXTENT PERMITTED BY LAW, QREATO LABS AND ITS OWNERS, EMPLOYEES, AND CONTRACTORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ANY CLAIM ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE THREE (3) MONTHS PRECEDING THE CLAIM, OR (B) FIFTY U.S. DOLLARS ($50).
            </p>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              10. Indemnification
            </h2>
            <p>
              You agree to defend, indemnify, and hold harmless Qreato Labs and its owners, employees, and contractors from any claims, damages, liabilities, and expenses (including reasonable legal fees) arising from: (a) your use or misuse of the Service; (b) your violation of these Terms; or (c) your Content, including any claim that your Inputs or your use of Outputs infringes a third party's rights.
            </p>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              11. Governing Law and Disputes
            </h2>
            <p>
              These Terms are governed by the laws of the State of <strong className="text-white font-medium">Delaware</strong>, United States, without regard to conflict of law principles. Any dispute arising from these Terms or the Service will be resolved exclusively in the state or federal courts located in <strong className="text-white font-medium">[STATE — confirm]</strong>, and you consent to the personal jurisdiction of those courts.
            </p>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="space-y-3 scroll-mt-8 pb-8 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              12. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. Material changes will be indicated by updating the "Last updated" date above and, where appropriate, through notice within the Service. Your continued use of the Service after changes take effect constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="space-y-3 scroll-mt-8">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              13. Contact
            </h2>
            <p>
              Questions about these Terms can be sent to <a href="mailto:salmanhossain75313@gmail.com" className="text-zinc-200 underline hover:text-white transition-colors">salmanhossain75313@gmail.com</a>, via WhatsApp at <a href="https://wa.me/8801975230313" target="_blank" rel="noreferrer" className="text-zinc-200 underline hover:text-white transition-colors">+880 1975-230313</a>, or through Whop's support chat.
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
