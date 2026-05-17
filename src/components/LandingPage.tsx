import { motion } from "motion/react";
import { BrainCircuit, Check, ArrowRight, Target, Sparkles, MessageSquare, ShieldCheck, Mail, FileText, Globe, Wand2, Zap, BarChart3, Activity, Layers, Network } from "lucide-react";
import { useState } from "react";

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly" | "lifetime">("monthly");

  const metrics = [
    { label: "Revenue Influenced", value: "$5B+", sub: "Direct attribution" },
    { label: "Words Generated", value: "1.2B+", sub: "High-intent copy" },
    { label: "Monthly Views", value: "250M+", sub: "Organic & Paid" },
    { label: "Followers Gained", value: "8M+", sub: "Across platforms" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden noise-bg">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 overflow-hidden">
        {/* Cinematic Atmosphere */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,181,46,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-[#FFB52E]/5 rounded-full blur-[160px] pointer-events-none" />
        
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-[0.2em] font-bold text-[#FFB52E] backdrop-blur-md"
          >
            <Sparkles size={14} className="animate-pulse" />
            THE FUTURE OF PERSUASION INTELLIGENCE
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-[10rem] font-bold tracking-tighter mb-10 leading-[0.8] bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent"
          >
            QRATOS.AI
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-xl md:text-3xl text-gray-400 max-w-4xl mx-auto mb-16 leading-relaxed font-medium"
          >
            The world’s most advanced AI persuasion engine built to generate elite copy, engineer demand & maximize conversions across launches, funnels, emails, ads & high-stakes marketing campaigns.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-4 md:p-8 rounded-[40px] w-fit mx-auto shadow-2xl relative"
          >
            {/* Inner Glow for Glass Effect */}
            <div className="absolute inset-0 rounded-[40px] shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] pointer-events-none" />
            
            <button
              onClick={onLogin}
              className="w-full sm:w-auto group relative flex items-center justify-center gap-3 px-8 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all duration-500 shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="text-base tracking-tight uppercase">Access Intelligence</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="w-full sm:w-auto px-8 py-5 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-white font-bold tracking-tight uppercase text-xs glass-card">
              System Architecture
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-24 flex flex-wrap justify-center px-4"
          >
            <span className="text-[10px] md:text-sm font-mono tracking-[0.4em] font-bold text-gray-500 uppercase text-center border-t border-white/5 pt-12 w-full max-w-2xl">
              specifically trained copywriting agent to generate $100M+ in sales
            </span>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section - Luxury Metrics */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-48 md:h-64 flex flex-col justify-center items-center rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-[#FFB52E]/30 transition-all duration-700 glass-card p-6 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFB52E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-3xl md:text-6xl font-bold bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent mb-3">{m.value}</span>
                <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] text-[#FFB52E] uppercase mb-1">{m.label}</span>
                <span className="text-[10px] text-gray-500">{m.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How Qratos Engineers Conversion Section */}
      <section className="py-44 px-4 relative overflow-hidden">
        {/* Cinematic Background Elements */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#FFB52E]/5 rounded-full blur-[180px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-32 relative">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-[10px] font-mono text-[#FFB52E] tracking-[0.5em] uppercase mb-6 flex items-center justify-center gap-2"
            >
              <Sparkles size={12} className="animate-pulse" />
              Elite Infrastructure
            </motion.div>
            <h2 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter leading-[0.9] bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              How Qratos Engineers <br className="hidden md:block" /> Conversion
            </h2>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#FFB52E] to-transparent mx-auto mb-10 shadow-[0_0_20px_#FFB52E]" />
            <p className="text-gray-400 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
              Built to generate high-performing copy, influence buyer psychology, and scale revenue through elite persuasion intelligence.
            </p>
          </div>

          <div className="space-y-44">
            {/* BLOCK 1: Psychology */}
            <FeatureBlock 
              index={1}
              title="AI Trained on Elite Conversion Psychology"
              description="Qratos is trained on direct response frameworks, behavioral economics, emotional persuasion systems, and high-converting marketing campaigns engineered to drive measurable business growth."
              points={[
                "Understands buying psychology",
                "Generates emotionally persuasive copy",
                "Adapts to customer awareness levels",
                "Creates conversion-focused messaging",
                "Engineered for revenue outcomes"
              ]}
              visual={
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#FFB52E]/5 rounded-full blur-3xl animate-pulse" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="relative w-64 h-64 border border-[#FFB52E]/20 rounded-full flex items-center justify-center"
                  >
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${i * 45}deg)` }}>
                         <div className="w-3 h-3 bg-[#FFB52E] rounded-full blur-[2px] translate-y-[-128px]" />
                      </div>
                    ))}
                    <div className="w-32 h-32 bg-black border border-[#FFB52E]/40 rounded-full flex items-center justify-center shadow-[0_0_50px_-10px_rgba(255,181,46,0.2)]">
                       <Network size={48} className="text-[#FFB52E]" />
                    </div>
                  </motion.div>
                </div>
              }
            />

            {/* BLOCK 2: Systems */}
            <FeatureBlock 
              index={2}
              reversed
              title="Generate Complete Revenue Systems"
              description="Qratos does not generate isolated content. It builds full conversion ecosystems including funnels, launches, sales pages, email sequences, VSLs, and brand positioning systems designed to maximize audience action."
              points={[
                "Launch campaign generation",
                "Funnel architecture",
                "Landing page systems",
                "Email conversion flows",
                "Offer positioning intelligence",
                "Strategic CTA optimization"
              ]}
              visual={
                <div className="relative w-full h-full flex items-center justify-center p-8">
                  <div className="grid grid-cols-2 gap-4 w-full h-full">
                    {[Layers, Zap, BarChart3, Mail].map((Icon, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, delay: i * 0.5, repeat: Infinity }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-center relative group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FFB52E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Icon size={40} className="text-[#FFB52E]/60" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              }
            />

            {/* BLOCK 3: Intelligence */}
            <FeatureBlock 
              index={3}
              title="Real-Time Persuasion Intelligence"
              description="Qratos dynamically adapts tone, emotional depth, positioning strategy, and messaging structure based on audience psychology, platform behavior, and conversion objectives."
              points={[
                "Emotional tone adaptation",
                "Audience-aware copywriting",
                "Premium brand positioning",
                "Creator-focused storytelling",
                "Platform-native optimization"
              ]}
              visual={
                <div className="relative w-full h-full flex flex-col items-center justify-center gap-8">
                   <div className="w-full h-32 flex items-center justify-center gap-2">
                     {[...Array(12)].map((_, i) => (
                       <motion.div
                         key={i}
                         animate={{ height: [20, 60, 20] }}
                         transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
                         className="w-1.5 bg-gradient-to-t from-[#FFB52E] to-[#FFD778] rounded-full"
                       />
                     ))}
                   </div>
                   <div className="flex gap-4">
                      <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono text-[#FFB52E]">ADAPTING TONE...</div>
                      <div className="px-4 py-2 rounded-xl bg-[#FFB52E]/10 border border-[#FFB52E]/20 text-[10px] font-mono text-white">99.8% PRECISION</div>
                   </div>
                </div>
              }
            />

            {/* BLOCK 4: Growth */}
            <FeatureBlock 
              index={4}
              reversed
              title="Built for High-Stakes Growth"
              description="Qratos is engineered for founders, creators, agencies, and brands that depend on high-performance communication to drive attention, trust, conversions, and scalable revenue."
              points={[
                "Engineered for scaling brands",
                "Optimized for high-converting campaigns",
                "Strategic storytelling systems",
                "Premium communication frameworks",
                "Elite AI writing infrastructure"
              ]}
              visual={
                <div className="relative w-full h-full p-8 flex items-end overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-[#FFB52E]/10 to-transparent" />
                   <div className="w-full flex items-end justify-between gap-2 h-[80%]">
                      {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="flex-1 bg-gradient-to-t from-[#FFB52E] to-transparent rounded-t-xl group relative"
                        >
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-[#FFB52E] opacity-0 group-hover:opacity-100 transition-opacity">
                             +{h}%
                           </div>
                        </motion.div>
                      ))}
                   </div>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-4 relative overflow-hidden bg-[#0A0A0A]">
        {/* Background Luxury Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-yellow-500/5 to-transparent rounded-full blur-[160px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Choose Your Intelligence Layer
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FFB52E] to-transparent mx-auto mb-8 rounded-full shadow-[0_0_10px_#FFB52E]" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Access the world’s most advanced AI persuasion and copywriting system.
            </p>
          </div>

          {/* Pricing Toggle */}
          <div className="flex justify-center mb-20">
            <div className="p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl inline-flex relative">
               <div 
                 className={`absolute inset-y-1 rounded-xl bg-white/[0.08] transition-all duration-300 shadow-xl ${
                   billingPeriod === 'monthly' ? 'left-1 w-[100px]' : 
                   billingPeriod === 'yearly' ? 'left-[105px] w-[100px]' : 
                   'left-[209px] w-[100px]'
                 }`}
               />
               <button 
                 onClick={() => setBillingPeriod("monthly")}
                 className={`relative z-10 px-6 py-2.5 text-xs font-bold transition-colors ${billingPeriod === 'monthly' ? 'text-white' : 'text-gray-500'}`}
               >
                 MONTHLY
               </button>
               <button 
                 onClick={() => setBillingPeriod("yearly")}
                 className={`relative z-10 px-6 py-2.5 text-xs font-bold transition-colors ${billingPeriod === 'yearly' ? 'text-white' : 'text-gray-500'}`}
               >
                 YEARLY
               </button>
               <button 
                 onClick={() => setBillingPeriod("lifetime")}
                 className={`relative z-10 px-6 py-2.5 text-xs font-bold transition-colors ${billingPeriod === 'lifetime' ? 'text-white' : 'text-gray-500'}`}
               >
                 LIFETIME
               </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-stretch px-4 sm:px-0 mt-20">
            {/* FREE PLAN */}
            <PricingCard
              badge="Lifetime Free"
              title="FREE"
              price="$0"
              desc="For creators exploring AI-powered persuasion."
              features={[
                "Limited daily credits", "Standard AI model", "Basic copywriting tools", 
                "Landing page generation", "Social content generation", "Email copy generation",
                "Access to chat interface", "Limited conversation history", "Community access"
              ]}
              cta="Start Free"
              onCta={onLogin}
            />

            {/* CORE PLAN */}
            <PricingCard
              featured
              badge="Most Popular"
              title="CORE"
              price={billingPeriod === 'monthly' ? '$29' : billingPeriod === 'yearly' ? '$247' : '$397'}
              subPrice={billingPeriod === 'monthly' ? '/month' : billingPeriod === 'yearly' ? '/year' : 'one-time'}
              saving={billingPeriod === 'yearly' ? "Save $101" : billingPeriod === 'lifetime' ? "Save $299" : ""}
              desc="For serious creators, founders, and operators scaling with AI."
              features={[
                "Higher daily credits", "Faster AI responses", "More powerful AI model", 
                "Advanced persuasion engine", "Long-form copywriting", "AI brand voice training",
                "Unlimited projects", "Campaign workspaces", "Advanced email sequences",
                "Landing page frameworks", "Launch campaign systems", "Premium templates",
                "Smart rewrite modes", "Priority generation speed", "Advanced export tools"
              ]}
              cta="Upgrade to Core"
              onCta={onLogin}
            />

            {/* ASCEND PLAN */}
            <PricingCard
              elite
              badge="Elite Intelligence Access"
              title="ASCEND"
              price={billingPeriod === 'monthly' ? '$67' : billingPeriod === 'yearly' ? '$599' : '$1199'}
              subPrice={billingPeriod === 'monthly' ? '/month' : billingPeriod === 'yearly' ? '/year' : 'one-time'}
              saving={billingPeriod === 'yearly' ? "Save $201" : ""}
              desc="For elite founders, agencies, teams, and power users."
              features={[
                "Highest daily credit limits", "Frontier-level AI intelligence", "Fastest generation speeds", 
                "Advanced reasoning engine", "Deep persuasion optimization", "Multi-step campaign systems",
                "AI sales funnel architect", "VSL intelligence system", "Conversion psychology analysis",
                "Advanced audience profiling", "Competitor messaging analysis", "AI offer optimization",
                "High-converting launch systems", "Team collaboration features", "Dedicated premium workspace"
              ]}
              cta="Unlock Ascend"
              onCta={onLogin}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center">
                 <BrainCircuit size={18} />
              </div>
              <span className="font-bold text-xl tracking-tight">Qratos.ai</span>
           </div>
           <div className="text-gray-600 text-xs font-mono tracking-widest uppercase">
              © 2026 QREATO LABS • OPERATING WITH INTELLIGENCE
           </div>
        </div>
      </footer>
    </div>
  );
}

interface PricingCardProps {
  badge: string;
  title: string;
  price: string;
  subPrice?: string;
  saving?: string;
  desc: string;
  features: string[];
  cta: string;
  onCta: () => void;
  featured?: boolean;
  elite?: boolean;
}

function PricingCard({ badge, title, price, subPrice, saving, desc, features, cta, onCta, featured, elite }: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative flex flex-col p-10 rounded-[32px] border transition-all duration-700 h-full ${
        featured ? 'bg-[#0F0F11] border-[#FFB52E]/30 shadow-[0_0_80px_-20px_rgba(226,167,46,0.15)] scale-105 z-10' : 
        elite ? 'bg-black border-white/10 shadow-2xl' : 
        'bg-[#080808] border-white/5'
      }`}
    >
      {/* Visual Effects for Elite */}
      {elite && (
        <>
          <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
            <motion.div 
               animate={{ x: ['100%', '-100%'], opacity: [0, 0.5, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
               className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFB52E]/50 to-transparent"
            />
          </div>
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#FFB52E]/5 rounded-full blur-3xl" />
        </>
      )}

      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-8 w-fit ${
        featured ? 'bg-[#FFB52E]/10 text-[#FFB52E]' : 'bg-white/5 text-gray-400'
      }`}>
        {badge}
      </div>

      <h3 className="text-3xl font-bold mb-4 tracking-tight">{title}</h3>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-5xl font-bold tracking-tighter">{price}</span>
        {subPrice && <span className="text-gray-500 text-sm font-medium">{subPrice}</span>}
      </div>
      {saving && <div className="text-xs font-bold text-[#FFB52E] mb-6">{saving}</div>}
      
      <p className="text-gray-400 text-sm mb-10 leading-relaxed min-h-[3rem]">{desc}</p>

      <div className="space-y-4 mb-12 flex-1">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3">
             <div className={`mt-1 p-0.5 rounded-full ${featured || elite ? 'bg-[#FFB52E]/20 text-[#FFB52E]' : 'bg-white/10 text-gray-400'}`}>
                <Check size={10} />
             </div>
             <span className="text-xs text-gray-300 font-medium">{f}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={onCta}
        className={`group relative w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
          featured ? 'bg-[#FFB52E] text-black hover:bg-[#E2A72E]' : 
          elite ? 'bg-white text-black hover:bg-gray-200' : 
          'bg-white/5 text-white border border-white/10 hover:bg-white/10'
        }`}
      >
        {elite && (
           <div className="absolute inset-x-0 -top-full h-full bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        {cta}
        <ArrowRight size={16} />
      </button>
    </motion.div>
  );
}

interface FeatureBlockProps {
  index: number;
  title: string;
  description: string;
  points: string[];
  visual: React.ReactNode;
  reversed?: boolean;
}

function FeatureBlock({ index, title, description, points, visual, reversed }: FeatureBlockProps) {
  return (
    <div className={`flex flex-col lg:flex-row items-center gap-16 md:gap-32 ${reversed ? 'lg:flex-row-reverse' : ''}`}>
      <motion.div 
        initial={{ opacity: 0, x: reversed ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 space-y-8"
      >
        <div className="inline-flex items-center gap-4">
           <span className="text-4xl md:text-6xl font-bold text-white/10 tracking-tighter">0{index}</span>
           <div className="w-12 h-[1px] bg-[#FFB52E]/30" />
        </div>
        <h3 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-white">{title}</h3>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed">{description}</p>
        <div className="space-y-4 pt-4">
           {points.map((p, i) => (
             <div key={i} className="flex items-center gap-4 group">
               <div className="w-1.5 h-1.5 rounded-full bg-[#FFB52E] group-hover:scale-150 group-hover:shadow-[0_0_10px_#FFB52E] transition-all" />
               <span className="text-sm md:text-base font-medium text-gray-300 group-hover:text-white transition-colors">{p}</span>
             </div>
           ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 w-full aspect-square md:aspect-auto md:h-[600px] relative group"
      >
        <div className="absolute inset-0 rounded-[48px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl overflow-hidden group-hover:border-[#FFB52E]/20 transition-colors duration-500">
           <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />
           {visual}
        </div>
        
        {/* Decorative corner glows */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#FFB52E]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </motion.div>
    </div>
  );
}
