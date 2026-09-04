import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application component tree:', error, errorInfo);
    // If error is storage quota exceeded, immediately clean up bloated product cache
    if (error?.message?.toLowerCase().includes('quota') || error?.message?.toLowerCase().includes('storage')) {
      try {
        localStorage.removeItem('ayesha_cotton_products');
      } catch {
        // Ignore
      }
    }
  }

  private handleReset = () => {
    try {
      // Clear potentially oversized or corrupted product & cart cache
      localStorage.removeItem('ayesha_cotton_products');
      localStorage.removeItem('ayesha_cotton_cart');
    } catch {
      // Ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleClearAllAndReset = () => {
    try {
      localStorage.clear();
    } catch {
      // Ignore
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const isQuotaError =
        this.state.error?.message?.toLowerCase().includes('quota') ||
        this.state.error?.message?.toLowerCase().includes('storage');

      return (
        <div className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#ede8e4] text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#fdebf3] text-[#745663] flex items-center justify-center border border-[#fcd4e4]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="font-playfair text-2xl font-bold text-[#1b1c1c]">
                {isQuotaError ? 'ব্রাউজার ক্যাশে সীমা অতিক্রম করেছে' : 'কিছু একটা সমস্যা হয়েছে'}
              </h2>
              <p className="text-xs sm:text-sm text-[#53434b] leading-relaxed">
                {isQuotaError
                  ? 'ব্রাউজারের লোকাল স্টোরেজে অতিরিক্ত তথ্য বা বড় ছবি থাকার কারণে এই সমস্যা হয়েছিল। ক্যাশে স্বয়ংক্রিয়ভাবে পরিষ্কার করা হয়েছে। নিচের বাটনে ক্লিক করলে সাইট সাথে সাথে ঠিকভাবে চালু হবে।'
                  : 'পেজটি লোড করতে একটি অপ্রত্যাশিত সমস্যা দেখা দিয়েছে। নিচে রিলোড বাটনে ক্লিক করে আবার চেষ্টা করুন।'}
              </p>
              {this.state.error?.message && (
                <div className="p-2.5 bg-[#f6f4f2] rounded-xl text-[11px] text-[#53434b] font-mono text-left overflow-x-auto">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-xl bg-[#745663] hover:bg-[#5c434e] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isQuotaError ? 'ক্যাশে পরিষ্কার করে লোড করুন' : 'রিলোড দিন (Reload)'}</span>
              </button>

              <button
                onClick={this.handleClearAllAndReset}
                className="py-3 px-4 rounded-xl bg-[#f6f4f2] hover:bg-[#ece7e3] text-[#53434b] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#e4e0dc]"
              >
                <Home className="w-4 h-4" />
                <span>ক্লিন রিসেট</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
