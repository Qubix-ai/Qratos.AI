import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";
import { recordUserActivity } from "../lib/sessionManager";
import { QreatoLogo } from "./QreatoLogo";
import { MoltenMetal } from "./MoltenMetal";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, initialMode = "login", onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => {
    setIsLogin(initialMode === "login");
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMessage(null);
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      if (showForgot) {
        const { error: resetErr } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: window.location.origin,
        });
        if (resetErr) throw resetErr;
        setSuccessMessage("Password reset instructions have been sent to your email.");
      } else if (isLogin) {
        if (!trimmedPassword) {
          setError("Please enter your password.");
          setLoading(false);
          return;
        }
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        if (signInErr) {
          const errMsg = (signInErr.message || "").toLowerCase();
          if (errMsg.includes("invalid login credentials") || errMsg.includes("invalid claim") || errMsg.includes("invalid password")) {
            setError("Incorrect password or email. If you haven't created an account yet, switch to Sign Up, or use 'Forgot password?' to reset.");
            setLoading(false);
            return;
          }
          throw signInErr;
        }
        if (data.session) {
          recordUserActivity();
          onSuccess?.();
          onClose();
        }
      } else {
        // Frictionless Signup Flow (Email confirmation is disabled in Supabase)
        if (!trimmedPassword) {
          setError("Please enter a secure password.");
          setLoading(false);
          return;
        }
        if (trimmedPassword.length < 6) {
          setError("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }

        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPassword,
        });

        // Handle case where account already exists
        if (signUpErr) {
          const errMsg = (signUpErr.message || "").toLowerCase();
          if (
            errMsg.includes("already registered") ||
            errMsg.includes("already exists") ||
            errMsg.includes("user already registered")
          ) {
            // Attempt seamless sign-in with the provided password
            const { data: directSignIn, error: directSignInErr } = await supabase.auth.signInWithPassword({
              email: trimmedEmail,
              password: trimmedPassword,
            });

            if (directSignIn?.session) {
              recordUserActivity();
              onSuccess?.();
              onClose();
              return;
            }

            // If password differed, transition seamlessly to Login mode with clear instructions
            setIsLogin(true);
            setError("An account with this email already exists. Please enter your password to log in.");
            setLoading(false);
            return;
          }

          throw signUpErr;
        }

        // If session returned directly from signup, land straight in workspace
        if (signUpData?.session) {
          recordUserActivity();
          onSuccess?.();
          onClose();
          return;
        }

        // If user created without immediate session, seamlessly log in right away
        const { data: signInData, error: autoSignInErr } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });

        if (autoSignInErr) {
          // If auto sign in had an edge issue, switch to login mode cleanly
          setIsLogin(true);
          setSuccessMessage("Account created! Please enter your password to enter the workspace.");
        } else if (signInData?.session) {
          recordUserActivity();
          onSuccess?.();
          onClose();
          return;
        }
      }
    } catch (err: any) {
      let msg = err?.message || "Authentication failed. Please verify your credentials.";
      
      const lower = msg.toLowerCase();
      if (lower.includes("invalid login credentials") || lower.includes("invalid claim")) {
        msg = "Invalid email or password. Please check your credentials and try again.";
        console.warn("Supabase Auth notice (invalid credentials):", msg);
      } else if (lower.includes("already registered") || lower.includes("already exists") || lower.includes("user already registered")) {
        msg = "An account with this email already exists. Please log in instead.";
        setIsLogin(true);
        console.info("Supabase Auth notice (user exists):", msg);
      } else {
        console.warn("Supabase Auth notice:", msg);
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="auth-modal-root" className="fixed inset-0 z-[1000] flex items-center justify-center px-4 overflow-y-auto py-8">
          {/* Molten Metal Animated Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 pointer-events-none overflow-hidden z-0"
          >
            <div className="absolute inset-0 w-full h-full">
              <MoltenMetal
                color1="#0c0716"
                color2="#581c87"
                color3="#e0e7ff"
                speed={0.22}
                scale={3.2}
                detail={3}
                glow={1.1}
                coreSize={0.08}
                swirl={0.9}
                fold={-0.18}
                blackPoint={0.08}
                brightness={0.7}
                colorMode="molten"
                grain={true}
                grainIntensity={0.04}
                mouseInteraction={true}
                mouseStrength={0.2}
                opacity={0.4}
                className="w-full h-full"
              />
            </div>
            
            {/* Calibrated Dark Vignette & Atmospheric Tint to ensure 100% text readability & button prominence */}
            <div 
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at center, rgba(10, 8, 20, 0.65) 0%, rgba(5, 3, 10, 0.90) 100%)",
              }}
            />
          </motion.div>

          {/* Backdrop Blur Layer with Close Action */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xl z-0 cursor-pointer"
            style={{ transform: "translateZ(0)" }}
          />
          
          {/* Card Container: Premium White Glassmorphism */}
          <motion.div
            id="auth-glass-card"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="relative w-full max-w-md bg-gradient-to-b from-white/[0.12] via-white/[0.06] to-white/[0.03] backdrop-blur-3xl border border-white/25 rounded-[32px] p-7 sm:p-9 shadow-[0_30px_90px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.45),inset_0_-1px_2px_rgba(255,255,255,0.1),0_0_40px_rgba(255,255,255,0.06)] overflow-hidden z-10 will-change-transform"
            style={{ transform: "translateZ(0)" }}
          >
            {/* Specular Radial Crown Glow */}
            <div 
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 bg-white/20 blur-3xl rounded-full pointer-events-none"
            />

            {/* Specular Edge Highlighting (Top & Bottom subtle rim) */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-90 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60 pointer-events-none" />
            
            {/* Close Button - Frosted Glass Pill */}
            <button 
              id="auth-modal-close-btn"
              onClick={onClose} 
              className="absolute top-5 right-5 p-2.5 rounded-2xl text-white/70 hover:text-white bg-white/[0.08] hover:bg-white/[0.18] border border-white/20 hover:border-white/40 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all cursor-pointer z-20 group"
              aria-label="Close modal"
            >
              <X size={16} className="group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Header / Brand Mark with White Glass Badge */}
            <div className="flex flex-col items-center mb-6 relative z-10">
              <div className="relative group mb-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-white/25 via-white/12 to-white/5 border border-white/35 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.7),0_0_20px_rgba(255,255,255,0.15)] backdrop-blur-2xl overflow-hidden">
                  {/* Subtle inner glass sweep */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-60" />
                  <QreatoLogo size={24} className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)] relative z-10" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-[26px] font-black tracking-tight text-white uppercase font-sans text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                {showForgot ? "Reset Password" : isLogin ? "Log In to Murgii" : "Create Murgii Account"}
              </h2>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Sparkles size={11} className="text-white/60" />
                <p className="text-xs text-white/75 font-mono tracking-widest uppercase text-center font-bold">
                  Qreato Persuasion Architecture
                </p>
                <Sparkles size={11} className="text-white/60" />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-400/35 backdrop-blur-xl text-xs text-rose-200 flex items-start gap-2.5 relative z-10 shadow-[0_4px_16px_rgba(244,63,94,0.15)]"
              >
                <AlertCircle size={16} className="text-rose-300 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{error}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/35 backdrop-blur-xl text-xs text-emerald-200 flex items-start gap-2.5 relative z-10 shadow-[0_4px_16px_rgba(16,185,129,0.15)]"
              >
                <CheckCircle2 size={16} className="text-emerald-300 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{successMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-[11px] font-mono font-bold text-white/80 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative rounded-2xl bg-white/[0.06] hover:bg-white/[0.09] focus-within:bg-white/[0.12] border border-white/15 hover:border-white/25 focus-within:border-white/45 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_2px_10px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-200">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60" size={16} />
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="w-full bg-transparent py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-white/35 focus:outline-none font-sans"
                  />
                </div>
              </div>

              {!showForgot && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-mono font-bold text-white/80 uppercase tracking-wider">
                      Password
                    </label>
                    {isLogin && (
                      <button
                        id="auth-forgot-password-btn"
                        type="button"
                        onClick={() => {
                          setShowForgot(true);
                          setError(null);
                          setSuccessMessage(null);
                        }}
                        className="text-[11px] font-mono font-semibold text-white/70 hover:text-white hover:underline cursor-pointer transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative rounded-2xl bg-white/[0.06] hover:bg-white/[0.09] focus-within:bg-white/[0.12] border border-white/15 hover:border-white/25 focus-within:border-white/45 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_2px_10px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-200">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60" size={16} />
                    <input
                      id="auth-password-input"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      className="w-full bg-transparent py-3.5 pl-10 pr-11 text-sm text-white placeholder:text-white/35 focus:outline-none font-sans"
                    />
                    <button
                      id="auth-toggle-password-visibility-btn"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Premium Glassmorphic CTA Button */}
              <button
                id="auth-submit-cta-btn"
                type="submit"
                disabled={loading}
                className="relative group w-full py-3.5 sm:py-4 rounded-2xl border border-white/40 hover:border-white/70 bg-gradient-to-b from-white/25 via-white/16 to-white/08 hover:from-white/35 hover:via-white/24 hover:to-white/14 active:scale-[0.98] text-white font-black text-xs sm:text-[13px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 shadow-[0_12px_35px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.85),inset_0_-2px_4px_rgba(0,0,0,0.25),0_0_25px_rgba(255,255,255,0.12)] backdrop-blur-2xl overflow-hidden cursor-pointer mt-5 disabled:opacity-50"
              >
                {/* Specular Curved Sheen on top half */}
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-2xl" />
                
                {/* Shimmer Light Sweep on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />
                ) : (
                  <>
                    <span className="relative z-10 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                      {showForgot ? "Send Reset Link" : isLogin ? "Sign In to Workspace" : "Create Account & Enter"}
                    </span>
                    <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-center relative z-10">
              {showForgot ? (
                <button
                  id="auth-back-to-signin-btn"
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 text-xs text-white/70 hover:text-white font-medium transition-all cursor-pointer backdrop-blur-md"
                >
                  Back to Sign In
                </button>
              ) : (
                <p className="text-xs text-white/60">
                  {isLogin ? "Don't have an account yet?" : "Already have a Murgii account?"}{" "}
                  <button
                    id="auth-mode-switch-btn"
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="font-bold text-white hover:text-white underline decoration-white/40 hover:decoration-white ml-1 cursor-pointer transition-colors"
                  >
                    {isLogin ? "Sign Up" : "Log In"}
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

