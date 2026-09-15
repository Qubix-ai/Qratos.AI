import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Copy, Check } from "lucide-react";
import { copyToClipboard } from "../lib/clipboard";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Qreato ErrorBoundary caught exception]:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/");
      window.location.href = "/";
    }
  };

  private handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  private handleCopyError = async () => {
    const errorDetails = `Error: ${this.state.error?.message || "Unknown error"}\n\nStack:\n${
      this.state.error?.stack || ""
    }\n\nComponent Stack:\n${this.state.errorInfo?.componentStack || ""}`;

    const ok = await copyToClipboard(errorDetails);
    if (ok) {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2500);
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07060B] text-white flex flex-col items-center justify-center p-6 selection:bg-[#8B5CF6]/40 font-sans">
          <div className="w-full max-w-md p-8 rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-xl text-center space-y-6 shadow-2xl">
            {/* Warning Icon */}
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <AlertTriangle size={28} />
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-['Nohemi',sans-serif] text-white">
                {this.props.fallbackTitle || "Something went wrong"}
              </h2>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                The application encountered an unexpected state. You can try recovering the view or reloading.
              </p>
            </div>

            {/* Error details snippet */}
            {this.state.error && (
              <div className="text-left bg-black/50 border border-white/10 rounded-xl p-3 text-[11px] font-mono text-red-300 max-h-24 overflow-y-auto">
                <span className="opacity-60 block text-[10px] uppercase tracking-wider mb-1">Details:</span>
                {this.state.error.message}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs sm:text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <RefreshCw size={15} />
                <span>Try Again</span>
              </button>

              <div className="grid grid-cols-2 gap-2 w-full">
                <button
                  type="button"
                  onClick={this.handleGoHome}
                  className="py-2.5 px-3 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/10 text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Home size={14} />
                  <span>Go to Home</span>
                </button>

                <button
                  type="button"
                  onClick={this.handleReload}
                  className="py-2.5 px-3 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/10 text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Full Reload</span>
                </button>
              </div>

              <button
                type="button"
                onClick={this.handleCopyError}
                className="mt-1 text-[11px] text-white/40 hover:text-white/70 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                {this.state.copied ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-emerald-400">Error copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy error details</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
