import { motion, useSpring, useTransform, animate, AnimatePresence } from "motion/react";
import { BrainCircuit, Check, ArrowRight, Target, Sparkles, MessageSquare, ShieldCheck, Mail, FileText, Globe, Wand2, Zap, BarChart3, Activity, Layers, Network, Instagram, Facebook, Twitter, Lock, X, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { signInWithEmail, signUpWithEmail, resetPassword } from "../lib/firebase";

function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // Clear state on open/close
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setResetSent(false);
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      if (showForgot) {
        await resetPassword(trimmedEmail);
        setResetSent(true);
      } else if (isLogin) {
        await signInWithEmail(trimmedEmail, trimmedPassword);
        onClose();
      } else {
        await signUpWithEmail(trimmedEmail, trimmedPassword);
        onClose();
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      // Map common Firebase errors to user-friendly messages
      let msg = err.message;
      if (err.code === "auth/operation-not-allowed") {
        msg = "Email/Password login is not enabled in Firebase. Please enable it in the console.";
      } else if (err.code === "auth/user-not-found") {
        msg = "No account found with this email.";
      } else if (err.code === "auth/wrong-password") {
        msg = "Incorrect password.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "This email is already registered.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={error ? { 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: [0, -10, 10, -10, 10, 0] 
            } : { 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: 0
            }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: error ? 0.4 : 0.5, 
              ease: error ? "easeInOut" : [0.16, 1, 0.3, 1] 
            }}
            className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[32px] p-8 md:p-10 overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFB52E]/30 to-transparent" />
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>

            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFB52E] to-[#E2A72E]/50 flex items-center justify-center shadow-[0_0_20px_-5px_#FFB52E] mb-4">
                <BrainCircuit size={24} className="text-black" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white italic">
                {showForgot ? "Reset Engine Access" : isLogin ? "Access Persuasion OS" : "Initialize Creator Link"}
              </h2>
              <p className="text-xs text-gray-500 mt-2 font-medium">
                {showForgot ? "Enter your email to receive reset instructions" : isLogin ? "Welcome back to elite levels of conversion" : "Join the frontier of strategic copywriting"}
              </p>
            </div>

            {resetSent ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check size={20} className="text-green-500" />
                </div>
                <p className="text-gray-300 mb-6">Password reset link sent! Check your inbox.</p>
                <button 
                  onClick={() => {
                    setShowForgot(false);
                    setResetSent(false);
                  }}
                  className="text-[#FFB52E] text-xs font-black uppercase tracking-widest hover:underline"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Professional Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                    <input 
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-[#FFB52E]/30 transition-all font-medium"
                    />
                  </div>
                </div>

                {!showForgot && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Secure Keypass</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                      <input 
                        required
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-[#FFB52E]/30 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#FFB52E] transition-all p-2 -mr-2"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400 text-[10px] leading-relaxed text-center font-bold">{error}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-br from-white to-gray-300 text-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
                >
                  <span className="text-sm tracking-tight uppercase">
                    {loading ? "Authenticating..." : showForgot ? "Send Reset Link" : isLogin ? "Access System" : "Create Link"}
                  </span>
                  {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>

                <div className="flex flex-col items-center gap-3 pt-4 border-t border-white/5">
                  {!showForgot && (
                    <button 
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Forgotten credentials?
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => {
                      if (showForgot) setShowForgot(false);
                      else setIsLogin(!isLogin);
                    }}
                    className="text-[#FFB52E] text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-125 transition-all"
                  >
                    {showForgot ? "Return to authentication" : isLogin ? "Request fresh access link" : "Already have access? Connect"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleLoginClick = () => {
    setAuthModalOpen(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Growth Lead at Scalar",
      content: "Qratos didn't just write my ads; it re-engineered my entire conversion strategy. We tracked $400k in direct revenue in 30 days.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Sarah Jenkins",
      role: "Founder of Aura Agency",
      content: "The persuasion depth is unparalleled. Finally, an AI that understands human emotion instead of just templates. It's a game changer.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Marcus Chen",
      role: "SaaS Entrepreneur",
      content: "Built my entire onboarding email sequence in minutes. Conversion rate jumped 42% overnight. The ROI is literally infinite.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Elena Kosta",
      role: "Direct Response Copywriter",
      content: "I was skeptical, but Qratos creates hooks that I couldn't even brainstorm myself. It's my secret weapon for high-ticket clients.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "David Miller",
      role: "E-comm Marketing Director",
      content: "Scaling from 6 to 7 figures was a nightmare until we automated our funnel assets with Qratos. It engineered growth effortlessly.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Sofia Rossi",
      role: "Brand Strategist",
      content: "The brand voice synchronization is unbelievable. It sounds more human, more persuasive, and more 'me' than any freelancer.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "James T. Wilson",
      role: "Performance Marketer",
      content: "Every single iteration generated by Qratos is a winner. We've cut our creative testing time by 85%. Elite level intelligence.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden noise-bg selection:bg-[#FFB52E]/30 relative">
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Dynamic Background Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0.03, 0.08, 0.03],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 15 + i * 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute w-[500px] h-[500px] bg-[#FFB52E]/5 rounded-full blur-[100px] will-change-[opacity,transform]"
            style={{
              top: `${10 + i * 20}%`,
              left: `${15 + (i % 2) * 40}%`
            }}
          />
        ))}
      </div>

      {/* Interactive Cursor Spotlight */}
      <div
        className="fixed inset-0 pointer-events-none z-10 hidden lg:block"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255,181,46,0.03), transparent 80%)`
        }}
      />

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
            className="mb-10 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-sans tracking-[0.2em] font-bold text-[#FFB52E] backdrop-blur-md"
          >
            <Sparkles size={14} className="animate-pulse" />
            THE FUTURE OF PERSUASION INTELLIGENCE
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-[10rem] tracking-tighter mb-10 leading-[0.8] bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent will-change-transform"
          >
            <span className="font-bold">QRATOS</span>
            <span className="font-light">.AI</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-6 leading-relaxed font-medium px-4"
          >
            An elite AI persuasion system engineered to generate high-converting copy, strategic campaigns & scalable revenue assets across funnels, launches, emails, ads & premium brand ecosystems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-[10px] md:text-xs font-sans text-gray-500 uppercase tracking-[0.2em] mb-12 max-w-[280px] sm:max-w-none mx-auto"
          >
            Built for founders, creators, agencies <br /> and growth-focused brands.
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-4 md:p-8 rounded-[32px] md:rounded-[40px] w-full sm:w-fit mx-auto shadow-2xl relative"
          >
            {/* Inner Glow for Glass Effect */}
            <div className="absolute inset-0 rounded-[32px] md:rounded-[40px] shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] pointer-events-none" />
            
            <button
              onClick={handleLoginClick}
              className="w-full sm:w-auto group relative flex items-center justify-center gap-3 px-10 py-6 bg-gradient-to-br from-white/10 to-white/5 text-white border border-white/10 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all duration-500 shadow-[0_0_30px_-5px_rgba(255,181,46,0.1)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="text-base tracking-tight uppercase">
                Start Writing Free
              </span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={handleLoginClick}
              className="w-full sm:w-auto px-10 py-6 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-white font-bold tracking-tight uppercase text-xs glass-card"
            >
              Explore Intelligence
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-24 flex flex-wrap justify-center px-4"
          >
            <span className="text-[10px] md:text-sm font-sans tracking-[0.2em] md:tracking-[0.4em] font-bold text-gray-500 uppercase text-center border-t border-white/5 pt-12 w-full max-w-2xl">
              specifically trained copywriting agent to generate $100M+ in sales
            </span>
          </motion.div>
        </div>
      </section>

      {/* Why Qratos Section - Testimonial Marquee */}
      <section className="py-32 relative overflow-hidden contain-paint">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24 flex flex-col items-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-8 text-white italic leading-[1.3] px-2 md:px-4 max-w-5xl"
            >
              Why Qratos is the last <br className="hidden sm:block" /> 
              <span className="bg-gradient-to-r from-[#FFB52E] via-[#FFD778] to-[#FFB52E] bg-clip-text text-transparent px-1 md:px-2">copywriting tool</span> 
              <span>you will ever need</span>
            </motion.h2>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#FFB52E] to-transparent shadow-[0_0_10px_rgba(255,181,46,0.5)]" />
          </div>

          <div className="relative h-[600px] w-full max-w-4xl mx-auto overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
            <motion.div
              animate={{ y: ["0%", "-50%"] }}
              transition={{ 
                duration: 60, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="flex flex-col gap-6 py-6 will-change-transform"
            >
              {/* Double mapping for seamless loop */}
              {[...testimonials, ...testimonials].map((t, i) => (
                <div 
                  key={i}
                  className="group relative px-6 md:px-10 py-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-2xl transition-all duration-500 hover:bg-white/[0.04] hover:border-[#FFB52E]/30 overflow-hidden"
                >
                  {/* Premium Animated Border Glow */}
                  <motion.div 
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-[100%] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"
                    style={{
                      background: "conic-gradient(from 0deg, transparent, #FFB52E, transparent, #FFB52E, transparent)"
                    }}
                  />
                  
                  {/* Glowing Edge Effect (Legacy) */}
                  <div className="absolute inset-x-12 -bottom-px h-px bg-gradient-to-r from-transparent via-[#FFB52E]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="relative w-16 h-16 shrink-0">
                      <img 
                        src={t.image} 
                        alt={t.name}
                        className="w-full h-full rounded-2xl object-cover border border-white/10"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFB52E] rounded-full border-4 border-[#050505] flex items-center justify-center">
                        <Check size={8} className="text-black font-black" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Sparkles key={i} size={10} className="text-[#FFB52E]" />
                        ))}
                      </div>
                      <p className="text-gray-300 text-base md:text-lg italic font-medium leading-relaxed">
                        "{t.content}"
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white">{t.name}</span>
                        <div className="w-1 h-1 rounded-full bg-gray-700" />
                        <span className="text-xs font-bold text-[#FFB52E]/60 uppercase tracking-widest">{t.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
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
              className="text-[10px] font-sans text-[#FFB52E] tracking-[0.5em] uppercase mb-6 flex items-center justify-center gap-2"
            >
              <Sparkles size={12} className="animate-pulse" />
              Elite Infrastructure
            </motion.div>
            <h2 className="text-4xl md:text-8xl font-bold mb-8 tracking-tighter leading-[0.9] bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic">
              How Qratos Engineers <br className="hidden md:block" /> Conversion
            </h2>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#FFB52E] to-transparent mx-auto mb-10 shadow-[0_0_20px_#FFB52E]" />
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-6">
              Qratos combines behavioral psychology, conversion intelligence, and strategic AI systems to generate persuasive assets engineered for measurable business growth.
            </p>
          </div>

          <div className="space-y-44">
            {/* BLOCK 1: Psychology */}
            <FeatureBlock 
              index={1}
              title="AI Trained on Elite Conversion Psychology"
              description="Qratos is engineered using direct response frameworks, behavioral economics, buyer psychology & high-performing persuasion systems optimized for real-world conversion outcomes."
              trustLine="Built for modern digital markets and high-intent customer acquisition."
              points={[
                "Understands buying psychology",
                "Generates emotionally persuasive copy",
                "Adapts to customer awareness levels",
                "Creates conversion-focused messaging",
                "Engineered for revenue outcomes"
              ]}
              visual={
                <div className="relative w-full h-full flex items-center justify-center perspective-[2000px] group/vis">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,181,46,0.15),transparent_70%)]" />
                  
                  {/* Floating 3D Orbital System */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        rotateX: [45, 60, 45],
                        rotateY: [0, 360],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 20 + i * 5, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                      style={{ 
                        transformStyle: "preserve-3d",
                        width: 250 + i * 100,
                        height: 250 + i * 100
                      }}
                      className="absolute border border-[#FFB52E]/10 rounded-full blur-[0.5px] will-change-transform"
                    />
                  ))}
 
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="relative w-72 h-72 border border-[#FFB52E]/10 rounded-full flex items-center justify-center will-change-transform"
                  >
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${i * 30}deg)` }}>
                         <motion.div 
                           animate={{ 
                             opacity: [0.1, 0.6, 0.1],
                             scale: [1, 1.3, 1]
                           }}
                           transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                           className="w-1 h-2 bg-gradient-to-t from-[#FFB52E] to-transparent rounded-full translate-y-[-140px] will-change-[opacity,transform]" 
                         />
                      </div>
                    ))}
                    
                    {/* Central Core with Deep Glassmorphism */}
                    <motion.div 
                      animate={{ scale: [0.98, 1.02, 0.98] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-48 h-48 bg-black/60 backdrop-blur-3xl border-2 border-[#FFB52E]/30 rounded-full flex items-center justify-center shadow-[0_0_100px_-20px_rgba(255,181,46,0.4),inset_0_0_40px_rgba(255,181,46,0.1)] relative group/core overflow-hidden"
                      style={{ transform: "translateZ(100px)" }}
                    >
                       <div className="absolute inset-0 bg-gradient-to-tr from-[#FFB52E]/20 via-transparent to-white/5 opacity-50" />
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,181,46,0.1),transparent)]" />
                       
                       <Network size={72} className="text-[#FFB52E] relative z-10 drop-shadow-[0_0_20px_rgba(255,181,46,0.6)]" />
                       
                       {/* High-speed scanning ring */}
                       <motion.div 
                         animate={{ rotate: 360 }}
                         transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                         className="absolute inset-2 border-t-2 border-[#FFB52E] rounded-full opacity-20"
                       />
                    </motion.div>
                  </motion.div>
 
                  {/* Floating Psychology Particles */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={`part-${i}`}
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 8 + i,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                      className="absolute w-2 h-2 bg-[#FFB52E] rounded-full blur-[2px]"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        transform: "translateZ(150px)"
                      }}
                    />
                  ))}
                </div>
              }
            />

            {/* BLOCK 2: Systems */}
            <FeatureBlock 
              index={2}
              reversed
              title="Generate Complete Revenue Systems"
              description="Qratos creates interconnected conversion systems including funnels, launch assets, landing pages, email sequences, VSLs, positioning frameworks & revenue-focused campaign structures."
              points={[
                "Launch campaign generation",
                "Funnel architecture",
                "Landing page systems",
                "Email conversion flows",
                "Offer positioning intelligence",
                "Strategic CTA optimization"
              ]}
              visual={
                <div className="relative w-full h-full flex items-center justify-center p-8 perspective-[1500px]">
                   <div className="grid grid-cols-2 gap-6 rotate-[15deg] skew-x-[-15deg] scale-110">
                      {[
                        { icon: Layers, label: "CONVERSION ARCHITECTURE", desc: "Multi-layered logic" },
                        { icon: Zap, label: "DECISION TRIGGERS", desc: "Behavioral hooks" },
                        { icon: BarChart3, label: "REVENUE FLOWS", desc: "Monetization systems" },
                        { icon: Mail, label: "COMMUNICATION NODE", desc: "Email conversion" }
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, translateZ: -100 }}
                          whileInView={{ opacity: 1, translateZ: 0 }}
                          viewport={{ once: true }}
                          transition={{ 
                            delay: i * 0.1, 
                            duration: 1.2, 
                            ease: [0.16, 1, 0.3, 1] 
                          }}
                          style={{ transformStyle: "preserve-3d" }}
                          className="group relative w-44 h-44 bg-white/[0.03] border-t border-l border-white/20 rounded-[32px] backdrop-blur-3xl p-6 flex flex-col justify-between overflow-hidden shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.5)] hover:border-[#FFB52E]/50 transition-all duration-500"
                        >
                           <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50" />
                           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#FFB52E,transparent_80%)] opacity-0 group-hover:opacity-10 transition-opacity" />
                           
                           <div className="w-12 h-12 rounded-2xl bg-[#FFB52E]/10 flex items-center justify-center border border-[#FFB52E]/20 group-hover:scale-110 transition-transform duration-500">
                             <item.icon size={24} className="text-[#FFB52E]" />
                           </div>
                           <div className="space-y-1">
                              <span className="block text-[8px] font-sans text-gray-500 tracking-[0.2em] font-black uppercase">{item.label}</span>
                              <span className="block text-[10px] text-gray-400 font-medium">{item.desc}</span>
                           </div>

                           {/* Interactive Glowing Trace */}
                           <motion.div 
                             animate={{ left: ["-100%", "200%"] }}
                             transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                             className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFB52E]/30 to-transparent"
                           />
                        </motion.div>
                      ))}
                   </div>

                   {/* Floating depth particles */}
                   <div className="absolute inset-0 pointer-events-none">
                     {[...Array(6)].map((_, i) => (
                       <motion.div
                         key={i}
                         animate={{ 
                           opacity: [0.1, 0.3, 0.1]
                         }}
                         transition={{ duration: 5 + i, repeat: Infinity }}
                         className="absolute w-1 h-1 bg-white/20 rounded-full"
                         style={{
                           top: `${(i * 15) + 10}%`,
                           left: `${(i * 12) + 10}%`
                         }}
                       />
                     ))}
                   </div>
                </div>
              }
            />

            {/* BLOCK 3: Intelligence */}
            <FeatureBlock 
              index={3}
              title="Real-Time Persuasion Intelligence"
              description="Qratos dynamically adapts messaging tone, emotional depth, positioning strategy, and persuasive structure based on audience behavior, platform context, and conversion objectives."
              points={[
                "Emotional tone adaptation",
                "Audience-aware copywriting",
                "Premium brand positioning",
                "Creator-focused storytelling",
                "Platform-native optimization"
              ]}
              visual={
                <div className="relative w-full h-full flex flex-col items-center justify-center gap-8 md:gap-16 p-6 md:p-16 overflow-hidden perspective-[1500px]">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,181,46,0.1),transparent_70%)]" />
                   
                   {/* Advanced 3D Waveform */}
                   <div className="relative w-full h-32 flex items-center justify-center gap-1.5 md:gap-2 contain-layout">
                     {[...Array(16)].map((_, i) => (
                       <motion.div
                         key={i}
                         animate={{ 
                           height: [15, 60 + (i % 5) * 10, 15],
                           opacity: [0.3, 1, 0.3],
                         }}
                         transition={{ 
                           duration: 10 + (i * 0.5), 
                           repeat: Infinity,
                           ease: "easeInOut"
                         }}
                         style={{ transform: "translateZ(50px)" }}
                         className="w-2 md:w-3 bg-[#FFB52E] rounded-full shadow-[0_0_20px_rgba(255,181,46,0.3)] will-change-[height,opacity]"
                       />
                     ))}
                   </div>
 
                   {/* Premium Status Modules */}
                   <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
                      {[
                        { label: "EMOTIONAL CALIBRATION", value: "98.4%", icon: Target, status: "PEAK" },
                        { label: "PERSUASION DEPTH", value: "ELITE", icon: Sparkles, status: "ACTIVE" },
                        { label: "AUDIENCE AWARENESS", value: "ACTIVE", icon: Activity, status: "SYNCED" },
                        { label: "CONVERSION OPTIM", value: "SYNCED", icon: Zap, status: "OPTIMIZED" }
                      ].map((item, i) => (
                        <motion.div 
                          key={i}
                          whileHover={{ translateZ: 50, scale: 1.05 }}
                          className="relative p-5 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-3 backdrop-blur-3xl transition-all duration-500 hover:bg-white/[0.06] hover:border-[#FFB52E]/40 group will-change-transform shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]"
                        >
                           <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30 rounded-3xl" />
                           <div className="flex items-center justify-between relative z-10">
                             <div className="flex flex-col gap-1">
                               <span className="text-[8px] font-sans text-gray-500 tracking-[0.2em] font-black uppercase">{item.label}</span>
                               <div className="flex items-center gap-2">
                                 <div className="w-1 h-1 rounded-full bg-[#FFB52E] animate-pulse" />
                                 <span className="text-[7px] text-white/40 font-bold tracking-widest">{item.status}</span>
                               </div>
                             </div>
                             <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#FFB52E]/10 group-hover:border-[#FFB52E]/30 transition-all">
                               <item.icon size={14} className="text-[#FFB52E]" />
                             </div>
                           </div>
                           <span className="text-xl md:text-2xl font-sans text-white font-bold tracking-tighter relative z-10">{item.value}</span>
                        </motion.div>
                      ))}
                   </div>
                </div>
              }
            />

            {/* BLOCK 4: Growth */}
            <FeatureBlock 
              index={4}
              reversed
              title="Built for High-Stakes Growth"
              description="Designed for founders, creators, agencies, and brands that depend on strategic communication to increase trust, attention, conversions, and scalable revenue growth."
              points={[
                "Engineered for scaling brands",
                "Optimized for high-converting campaigns",
                "Strategic storytelling systems",
                "Premium communication frameworks",
                "Elite AI writing infrastructure"
              ]}
              visual={
                <div className="relative w-full h-full p-8 md:p-20 flex flex-col gap-10 md:gap-16 bg-[#080808]/80 backdrop-blur-3xl overflow-hidden perspective-[2000px] group/growth">
                   {/* Animated Background Flow */}
                   <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:2rem_2rem]" />
                      <motion.div 
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFB52E]/5 to-transparent skew-x-[-45deg]"
                      />
                   </div>

                   <div className="flex items-center justify-between relative z-10" style={{ transform: "translateZ(60px)" }}>
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] md:text-[12px] font-sans text-[#FFB52E] tracking-[0.4em] font-black uppercase drop-shadow-sm">REVENUE ARCHITECTURE</span>
                        <span className="text-2xl md:text-4xl font-bold text-white tracking-tighter italic">Frontier Scaling Engine</span>
                     </div>
                     <motion.div 
                       animate={{ 
                         rotate: [0, 10, -10, 0],
                         scale: [1, 1.1, 1]
                       }}
                       transition={{ duration: 5, repeat: Infinity }}
                       className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#FFB52E] to-[#C98E1A] flex items-center justify-center border border-white/20 shadow-[0_0_50px_rgba(255,181,46,0.4)]"
                     >
                        <Activity size={36} className="text-black" />
                     </motion.div>
                   </div>
                   
                   <div className="flex-1 w-full flex items-end justify-between gap-3 md:gap-6 pb-6 relative z-10" style={{ transformStyle: "preserve-3d" }}>
                      {[50, 75, 60, 110, 85, 120, 160].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0, translateZ: 0 }}
                          whileInView={{ height: `${(h / 160) * 100}%` }}
                          whileHover={{ translateZ: 60, scaleX: 1.1, filter: "brightness(1.5)" }}
                          transition={{ 
                            duration: 2, 
                            delay: i * 0.1, 
                            ease: [0.16, 1, 0.3, 1] 
                          }}
                          className="relative flex-1 group/bar will-change-[height,transform] cursor-pointer"
                        >
                           {/* 3D Glass Pillar Effect */}
                           <div className="absolute inset-0 bg-gradient-to-t from-[#FFB52E] via-[#FFB52E]/60 to-[#FFD778]/40 rounded-t-2xl shadow-[0_0_40px_rgba(255,181,46,0.2)] border-t border-x border-white/30" />
                           <div className="absolute inset-[1px] bg-white/10 rounded-t-2xl backdrop-blur-sm opacity-50" />
                           
                           {/* Top Glow Cap */}
                           <div className="absolute inset-x-0 top-0 h-2 bg-white rounded-full blur-[3px] opacity-60 translate-y-[-1px]" />
                           
                           {/* Internal Energy Line */}
                           <motion.div 
                             animate={{ top: ["100%", "0%"], opacity: [0, 1, 0] }}
                             transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                             className="absolute inset-x-2 w-px bg-white mx-auto blur-[1px]"
                           />

                           {/* Floating Tooltip */}
                           <motion.div 
                             initial={{ opacity: 0, y: 0 }}
                             whileHover={{ opacity: 1, y: -45 }}
                             className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none bg-white py-1 px-3 rounded-lg shadow-xl"
                           >
                             <span className="text-[10px] font-black text-black tracking-tight">+{(h * 1.8).toFixed(1)}%</span>
                             <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                           </motion.div>
                        </motion.div>
                      ))}
                   </div>
 
                   <div className="flex justify-between text-[10px] font-sans text-gray-500 border-t border-white/10 pt-6 tracking-[0.4em] font-black uppercase relative z-10">
                      {[ "JAN", "MAR", "MAY", "JUL", "SEP", "NOV", "DEC"].map(m => <span key={m} className="hover:text-[#FFB52E] transition-colors cursor-default">{m}</span>)}
                   </div>
                   
                   {/* Cinematic Surface Glow */}
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-[radial-gradient(ellipse_at_bottom,rgba(255,181,46,0.2),transparent_70%)] pointer-events-none" />
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-4 relative overflow-hidden bg-[#0A0A0A]">
        {/* Background Luxury Elements - Glassmorphism Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FFB52E]/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFB52E]/3 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFB52E]/10 border border-[#FFB52E]/20 text-[10px] font-black text-[#FFB52E] uppercase tracking-[0.2em] mb-8 backdrop-blur-md"
            >
              <Sparkles size={12} />
              Limited MVP Access
            </motion.div>
            <h2 className="text-4xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic leading-tight">
              Frontier Access <br /> for Early Adopters
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Qratos is currently in focused MVP development. We are granting full frontier-level intelligence to a select group of growth-focused pioneers.
            </p>
          </div>

          {/* Single MVP Card with 3D Orbital Effect */}
          <div className="flex justify-center mt-20 relative px-4">
            {/* Orbital Rings Background */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none opacity-20">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20 + i * 10, repeat: Infinity, ease: "linear" }}
                  className="absolute border border-white/20 rounded-full"
                  style={{ width: 400 + i * 200, height: 400 + i * 200 }}
                />
              ))}
            </div>

            <MVPPriceCard 
              handleLoginClick={handleLoginClick} 
            />
          </div>

          <div className="text-center mt-12 space-y-4">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-500 text-[10px] md:text-sm font-sans font-black uppercase tracking-[0.3em]"
            >
              pricings coming soon. App currently in MVP stage
            </motion.p>
            <div className="flex justify-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-[#FFB52E]/20" />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Footer Ecosystem */}
      <footer className="relative pt-32 pb-12 overflow-hidden border-t border-white/5 bg-[#050505]">
        {/* Cinematic Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFB52E]/30 to-transparent" />
        <div className="absolute top-0 right-[10%] w-[400px] h-[400px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[10%] w-[300px] h-[300px] bg-[#FFB52E]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* TOP SECTION: LOGO + NEWSLETTER */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-24">
            <div className="max-w-md space-y-6">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFB52E] to-[#E2A72E]/50 flex items-center justify-center shadow-[0_0_20px_-5px_#FFB52E] group-hover:scale-110 transition-transform">
                  <BrainCircuit size={22} className="text-black" />
                </div>
                <div className="tracking-tighter text-white uppercase text-2xl italic">
                  <span className="font-extrabold">QRATOS</span>
                  <span className="font-light">.AI</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                Qratos is an elite AI persuasion system engineered for founders, creators, agencies, and brands building scalable revenue through strategic communication.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                {[
                  { label: "AI-Powered Infrastructure", icon: Layers },
                  { label: "Enterprise-Grade Security", icon: ShieldCheck },
                  { label: "Premium Conversion Intelligence", icon: Target }
                ].map((trust, i) => (
                  <div key={i} className="flex items-center gap-2 text-[9px] font-sans text-gray-500 uppercase tracking-widest font-bold">
                    <trust.icon size={12} className="text-[#FFB52E]/60" />
                    {trust.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:max-w-sm space-y-6">
              <div className="space-y-2">
                <h4 className="text-xl font-bold tracking-tight text-white">Stay Ahead of Persuasion Intelligence</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">Product updates, AI research, conversion systems, and strategic release notes.</p>
              </div>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Enter your professional email"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-6 pr-32 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FFB52E]/30 transition-all shadow-inner backdrop-blur-md"
                />
                <button className="absolute right-2 top-2 bottom-2 px-6 bg-white text-black font-extrabold text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#FFB52E] transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 pb-24 border-b border-white/5">
            <div>
              <h4 className="text-[10px] font-sans font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Product</h4>
              <ul className="space-y-4">
                {["Features", "Pricing", "AI Workspace", "Brand Voice Engine", "Campaign Systems", "Prompt Library", "Release Notes", "API Access"].map(item => (
                  <li key={item}>
                    <a href="#" className="text-xs font-bold text-gray-500 hover:text-white transition-colors relative group w-fit flex items-center gap-2">
                      <span className="w-0 h-[1px] bg-[#FFB52E] transition-all group-hover:w-3" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-sans font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Company</h4>
              <ul className="space-y-4">
                {["About Qreato Labs", "Careers", "Contact", "Affiliate Program", "Press Kit", "Brand Assets", "Partnerships"].map(item => (
                  <li key={item}>
                    <a href="#" className="text-xs font-bold text-gray-500 hover:text-white transition-colors relative group w-fit flex items-center gap-2">
                      <span className="w-0 h-[1px] bg-[#FFB52E] transition-all group-hover:w-3" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-sans font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Resources</h4>
              <ul className="space-y-4">
                {["Documentation", "Help Center", "AI Copywriting Guides", "Persuasion Research", "System Tutorials", "Community", "Changelog"].map(item => (
                  <li key={item}>
                    <a href="#" className="text-xs font-bold text-gray-500 hover:text-white transition-colors relative group w-fit flex items-center gap-2">
                      <span className="w-0 h-[1px] bg-[#FFB52E] transition-all group-hover:w-3" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-sans font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Legal</h4>
              <ul className="space-y-4">
                {["Privacy Policy", "Terms of Service", "Cookie Policy", "AI Usage Policy", "Data Protection", "Refund Policy", "Acceptable Use Policy"].map(item => (
                  <li key={item}>
                    <a href="#" className="text-xs font-bold text-gray-500 hover:text-white transition-colors relative group w-fit flex items-center gap-2">
                      <span className="w-0 h-[1px] bg-[#FFB52E] transition-all group-hover:w-3" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-sans font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Connect</h4>
              <ul className="space-y-6">
                {[
                  { label: "Instagram", icon: Instagram, href: "https://www.instagram.com/qreato.io?igsh=MTlmNHN6ampqYWF3bQ==" },
                  { label: "Facebook", icon: Facebook, href: "#" },
                  { label: "Newsletter", icon: Mail, href: "#" },
                  { label: "X / Twitter", icon: Twitter, href: "https://x.com/s4lma9" }
                ].map(social => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#FFB52E]/10 group-hover:border-[#FFB52E]/30 transition-all font-bold">
                        <social.icon size={18} className="text-gray-500 group-hover:text-[#FFB52E] transition-colors" />
                      </div>
                      <span className="text-xs font-bold text-gray-500 group-hover:text-white transition-colors">{social.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* LEGAL + TRUST STRIP */}
          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 relative">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <p className="text-[10px] font-sans text-gray-600 uppercase tracking-[0.2em]">© 2026 Qreato Labs. All rights reserved.</p>
              <div className="hidden md:block w-3 h-[1px] bg-white/10" />
              <p className="text-[10px] font-sans text-[#FFB52E]/60 uppercase tracking-[0.3em] font-black">Engineered with persuasion intelligence.</p>
            </div>
            
            <div className="flex items-center flex-wrap justify-center gap-6">
               {[
                 { label: "Secure Infrastructure", icon: ShieldCheck },
                 { label: "Privacy Focused", icon: Globe },
                 { label: "Enterprise Ready", icon: Target }
               ].map((trust, i) => (
                 <div key={i} className="flex items-center gap-2 text-[9px] font-sans text-gray-700 uppercase tracking-widest font-bold">
                   <trust.icon size={10} className="text-gray-800" />
                   {trust.label}
                 </div>
               ))}
            </div>
          </div>
        </div>
      </footer>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}

function MVPPriceCard({ 
  handleLoginClick 
}: { 
  handleLoginClick: () => void 
}) {
  const x = useSpring(0, { stiffness: 100, damping: 30 });
  const y = useSpring(0, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full max-w-3xl p-8 md:p-16 rounded-[48px] bg-white/[0.02] border border-white/10 backdrop-blur-[100px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden group cursor-crosshair"
    >
       {/* Premium 3D Moving Light Streak */}
       <motion.div 
         animate={{ left: ['-100%', '200%'] }}
         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
         className="absolute top-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#FFB52E] to-transparent opacity-30"
       />

       <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center" style={{ transform: "translateZ(50px)" }}>
          <div className="flex-1 space-y-8">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <h3 className="text-4xl md:text-6xl font-bold tracking-tight text-white italic">MVP FREE</h3>
                   <div className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-[9px] font-black text-white/40 tracking-widest uppercase">Limited Tier</div>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-6xl font-bold tracking-tighter">$0</span>
                   <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Forever Free for Early Users</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  Experience the full persuasion engine. All advanced features from our Core and Ascend systems have been unlocked for the first 1,000 MVP users.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  "Unlimited Frontier AI Processing",
                  "Deep Persuasion Engine Access",
                  "AI Brand Voice Training",
                  "Strategic Funnel Architect",
                  "Complete Email Sequence Systems",
                  "Advanced Audience Profiling",
                  "Multi-Step Campaign Strategy",
                  "Campaign Collaboration Mode",
                  "VSL Intelligence Architect",
                  "Priority Generation Speed"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 group/item">
                     <div className="w-5 h-5 rounded-full bg-[#FFB52E]/10 border border-[#FFB52E]/30 flex items-center justify-center group-hover/item:bg-[#FFB52E]/20 transition-colors">
                        <Check size={12} className="text-[#FFB52E]" />
                     </div>
                     <span className="text-xs text-gray-300 font-bold tracking-tight group-hover/item:text-white transition-colors">{feature}</span>
                  </div>
                ))}
             </div>

             <button 
               onClick={handleLoginClick}
               className="group relative w-full py-6 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-[#FFB52E] transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] overflow-hidden"
             >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
               Claim Early Access
               <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
       </div>

       {/* MVP Decorative Counter */}
       <div className="absolute bottom-6 right-10 text-[8px] font-sans text-gray-700 font-bold tracking-[0.5em] uppercase pointer-events-none" style={{ transform: "translateZ(30px)" }}>
         MVP STATUS: v0.8.2 ACTIVE
       </div>
    </motion.div>
  );
}

interface FeatureBlockProps {
  index: number;
  title: string;
  description: string;
  trustLine?: string;
  points: string[];
  visual: React.ReactNode;
  reversed?: boolean;
}

function FeatureBlock({ index, title, description, trustLine, points, visual, reversed }: FeatureBlockProps) {
  const x = useSpring(0, { stiffness: 100, damping: 30 });
  const y = useSpring(0, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

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
           <motion.span 
             animate={{ opacity: [0.6, 1, 0.6] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="text-5xl md:text-8xl font-black bg-gradient-to-br from-[#FFB52E] via-white/30 to-transparent bg-clip-text text-transparent tracking-tighter select-none will-change-opacity"
           >
             0{index}
           </motion.span>
           <div className="w-16 h-[1px] bg-gradient-to-r from-[#FFB52E]/60 to-transparent" />
        </div>
        <h3 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-white">{title}</h3>
        <div className="space-y-4">
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed">{description}</p>
          {trustLine && (
            <p className="text-[#FFB52E]/60 text-xs font-sans tracking-widest uppercase font-bold">{trustLine}</p>
          )}
        </div>
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
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="flex-1 w-full aspect-square md:aspect-auto md:h-[600px] relative group cursor-crosshair"
      >
        <div 
          className="absolute inset-0 rounded-[48px] bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden group-hover:border-[#FFB52E]/50 transition-all duration-700 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
          style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
        >
           <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,181,46,0.1),transparent_50%)]" />
           <div className="relative w-full h-full flex items-center justify-center" style={{ transform: "translateZ(80px)" }}>
             {visual}
           </div>
        </div>
        
        {/* Floating Accents */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFB52E]/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </motion.div>
    </div>
  );
}
