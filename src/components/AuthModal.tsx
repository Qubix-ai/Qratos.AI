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
          
          {/* Card Container: Refined, Understated Glassmorphism */}
          <motion.div
            id="auth-glass-card"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ 
              duration: 0.25, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="relative w-full max-w-md bg-[#0e0c18]/90 sm:bg-[#0c0a15]/85 backdrop-blur-2xl border border-white/15 rounded-3xl p-7 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.7),0_1px_1px_rgba(255,255,255,0.08)] overflow-hidden z-10 will-change-transform"
            style={{ transform: "translateZ(0)" }}
          >
            {/* Subtle Ambient Backlight */}
            <div 
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-24 bg-white/[0.06] blur-2xl rounded-full pointer-events-none"
            />
            
            {/* Close Button - Minimal Frosted Icon */}
            <button 
              id="auth-modal-close-btn"
              onClick={onClose} 
              className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 backdrop-blur-md transition-colors cursor-pointer z-20 group"
              aria-label="Close modal"
            >
              <X size={16} className="transition-transform duration-200" />
            </button>

            {/* Header / Brand Mark */}
            <div className="flex flex-col items-center mb-6 relative z-10">
              <div className="mb-3">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.07] border border-white/15 flex items-center justify-center backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
                  <QreatoLogo size={22} className="text-white" />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans text-center">
                {showForgot ? "Reset Password" : isLogin ? "Log In to Murgii" : "Create Murgii Account"}
              </h2>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Sparkles size={11} className="text-white/40" />
                <p className="text-[11px] text-white/60 font-mono tracking-wider uppercase text-center font-medium">
                  Qreato Persuasion Architecture
                </p>
                <Sparkles size={11} className="text-white/40" />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-400/25 text-xs text-rose-200 flex items-start gap-2.5 relative z-10"
              >
                <AlertCircle size={15} className="text-rose-300 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-normal">{error}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/25 text-xs text-emerald-200 flex items-start gap-2.5 relative z-10"
              >
                <CheckCircle2 size={15} className="text-emerald-300 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-normal">{successMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-[11px] font-mono font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative rounded-xl bg-white/[0.04] hover:bg-white/[0.06] focus-within:bg-white/[0.08] border border-white/10 hover:border-white/20 focus-within:border-white/40 transition-all duration-200">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="w-full bg-transparent py-3 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none font-sans"
                  />
                </div>
              </div>

              {!showForgot && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-mono font-semibold text-neutral-300 uppercase tracking-wider">
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
                        className="text-[11px] font-mono text-neutral-400 hover:text-white hover:underline cursor-pointer transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative rounded-xl bg-white/[0.04] hover:bg-white/[0.06] focus-within:bg-white/[0.08] border border-white/10 hover:border-white/20 focus-within:border-white/40 transition-all duration-200">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
                    <input
                      id="auth-password-input"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      className="w-full bg-transparent py-3 pl-10 pr-11 text-sm text-white placeholder:text-neutral-500 focus:outline-none font-sans"
                    />
                    <button
                      id="auth-toggle-password-visibility-btn"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer p-1 rounded-lg transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Clean, Flat, Confident CTA Button */}
              <button
                id="auth-submit-cta-btn"
                type="submit"
                disabled={loading}
                className="relative w-full py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-black font-semibold text-xs sm:text-[13px] uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-5 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {showForgot ? "Send Reset Link" : isLogin ? "Sign In to Workspace" : "Create Account & Enter"}
                    </span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 text-center relative z-10">
              {showForgot ? (
                <button
                  id="auth-back-to-signin-btn"
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-neutral-300 hover:text-white font-medium transition-colors cursor-pointer"
                >
                  Back to Sign In
                </button>
              ) : (
                <p className="text-xs text-neutral-400">
                  {isLogin ? "Don't have an account yet?" : "Already have a Murgii account?"}{" "}
                  <button
                    id="auth-mode-switch-btn"
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="font-semibold text-white hover:underline ml-1 cursor-pointer transition-colors"
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

