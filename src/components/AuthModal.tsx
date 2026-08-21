import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrainCircuit, X, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

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
        if (signInErr) throw signInErr;
        if (data.session) {
          onSuccess?.();
          onClose();
        }
      } else {
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
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        if (signUpErr) throw signUpErr;

        if (data.session) {
          onSuccess?.();
          onClose();
        } else {
          setSuccessMessage("Account created successfully! You can now log in with your credentials.");
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      console.error("Supabase Auth Error:", err);
      let msg = err.message || "Authentication failed. Please verify your credentials.";
      if (msg.includes("Invalid login credentials")) {
        msg = "Invalid email or password. Please check your credentials and try again.";
      } else if (msg.includes("User already registered")) {
        msg = "An account with this email already exists. Please log in.";
        setIsLogin(true);
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
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={error ? { 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: [0, -8, 8, -8, 8, 0] 
            } : { 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: 0
            }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: error ? 0.35 : 0.45, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="relative w-full max-w-md bg-[#0A0812] border border-[#FFB52E]/30 rounded-[32px] p-8 md:p-10 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(255,181,46,0.15)]"
          >
            {/* Top Specular Neon Beam */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFB52E] via-white/80 to-transparent" />
            
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFB52E] via-[#FFA000] to-[#E28A00] flex items-center justify-center shadow-[0_0_25px_rgba(255,181,46,0.5)] mb-3">
                <BrainCircuit size={24} className="text-black" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white uppercase font-sans text-center">
                {showForgot ? "Reset Access" : isLogin ? "Log In to Murgii" : "Create Murgii Account"}
              </h2>
              <p className="text-xs text-[#FFB52E]/80 font-mono tracking-widest mt-1 uppercase text-center">
                Shared with Qreato Bolt Architecture
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-[#FF2A55]/10 border border-[#FF2A55]/30 text-xs text-[#FF859D] flex items-start gap-2.5"
              >
                <AlertCircle size={16} className="text-[#FF2A55] shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5"
              >
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{successMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FFB52E]/50 focus:bg-white/[0.07] transition-all font-sans"
                  />
                </div>
              </div>

              {!showForgot && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
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
                        className="text-[10px] font-mono text-[#FFB52E] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 pl-10 pr-11 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FFB52E]/50 focus:bg-white/[0.07] transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FFB52E] via-[#FFA000] to-[#E28A00] text-black font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(255,181,46,0.3)] disabled:opacity-50 cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{showForgot ? "Send Reset Link" : isLogin ? "Sign In to Murgii" : "Create Account"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/08 text-center">
              {showForgot ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs text-gray-400 hover:text-[#FFB52E] transition-colors"
                >
                  Back to Sign In
                </button>
              ) : (
                <p className="text-xs text-gray-400">
                  {isLogin ? "Don't have an account yet?" : "Already have a Bolt / Murgii account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="font-bold text-[#FFB52E] hover:underline ml-1"
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
