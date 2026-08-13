"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UserPlus, Copy, Check, Gift } from "lucide-react";

export default function ReferPage() {
  const [copied, setCopied] = useState(false);
  const refUrl = "https://airbnb-clone-psi-eight.vercel.app/hosting?referral=NAYAN2026";

  const handleCopy = () => {
    navigator.clipboard.writeText(refUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header startCollapsed={true} />

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refer a Host, Earn Rewards</h1>
        <p className="text-gray-600 text-sm max-w-lg mx-auto mb-8">
          Know someone with a great space? Invite them to host on Airbnb. You'll earn up to ₹2,500 for every host who completes their first booking!
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 max-w-xl mx-auto shadow-sm mb-12">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-left">Your Personal Referral Link</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              readOnly 
              value={refUrl} 
              className="flex-1 p-3 border border-gray-300 rounded-xl text-xs bg-white font-mono outline-none"
            />
            <button 
              onClick={handleCopy}
              className="bg-black text-white px-5 py-3 rounded-xl font-semibold text-xs hover:bg-gray-800 transition flex items-center gap-1"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
