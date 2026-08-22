import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { recordUserActivity } from "../lib/sessionManager";
import { QreatoLogo } from "./QreatoLogo";

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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 overflow-y-auto py-8">
          {/* Backdrop with solid color & GPU blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            style={{ transform: "translateZ(0)" }}
          />
          
          {/* Card Container: Solid dark background + hardware accelerated static gradients to prevent flickering */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ 
              duration: 0.25, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="relative w-full max-w-md bg-[#0C0A14] border border-[#8B5CF6]/30 rounded-[28px] p-7 sm:p-9 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(139,92,246,0.2)] overflow-hidden z-10 will-change-transform"
            style={{ transform: "translateZ(0)" }}
          >
            {/* Stable static ambient glow (no animated heavy SVG filters) */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background: "radial-gradient(circle at 85% 15%, rgba(217, 70, 239, 0.22) 0%, transparent 60%), radial-gradient(circle at 15% 85%, rgba(139, 92, 246, 0.22) 0%, transparent 60%)",
              }}
            />

            {/* Top Specular Accent Border */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C084FC] to-transparent opacity-80" />
            
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-20"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Header / Brand Mark */}
            <div className="flex flex-col items-center mb-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] via-[#A855F7] to-[#D946EF] flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.6)] mb-3">
                <QreatoLogo size={22} className="text-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white uppercase font-sans text-center">
                {showForgot ? "Reset Password" : isLogin ? "Log In to Murgii" : "Create Murgii Account"}
              </h2>
              <p className="text-xs text-[#C084FC]/90 font-mono tracking-wider mt-1 uppercase text-center font-bold">
                Qreato Persuasion Architecture
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5 relative z-10"
              >
                <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{error}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5 relative z-10"
              >
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{successMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-[11px] font-mono font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="w-full bg-white/[0.05] border border-white/12 rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#8B5CF6] focus:bg-white/[0.08] transition-all font-sans"
                  />
                </div>
              </div>

              {!showForgot && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-mono font-bold text-gray-300 uppercase tracking-wider">
                      Password
                    </label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgot(true);
                          setError(null);
                          setSuccessMessage(null);
                        }}
                        className="text-[11px] font-mono font-semibold text-[#D946EF] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      className="w-full bg-white/[0.05] border border-white/12 rounded-xl py-3.5 pl-10 pr-11 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#8B5CF6] focus:bg-white/[0.08] transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#D946EF] text-white font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(139,92,246,0.4)] disabled:opacity-50 cursor-pointer mt-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{showForgot ? "Send Reset Link" : isLogin ? "Sign In to Workspace" : "Create Account & Enter"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/[0.08] text-center relative z-10">
              {showForgot ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs text-gray-400 hover:text-[#D946EF] font-medium transition-colors cursor-pointer"
                >
                  Back to Sign In
                </button>
              ) : (
                <p className="text-xs text-gray-400">
                  {isLogin ? "Don't have an account yet?" : "Already have a Murgii account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="font-bold text-[#D946EF] hover:underline ml-1 cursor-pointer"
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
