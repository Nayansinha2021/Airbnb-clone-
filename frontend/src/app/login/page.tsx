"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { User, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { loginCustom, loginAsGuest, loginAsHost } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("GUEST");
  const [countryCode, setCountryCode] = useState("India (+91)");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginCustom(fullName || "Nayan Sinha", email || "nayan@example.com", role);
    router.push("/");
  };

  const handleDemoGuest = () => {
    loginAsGuest();
    router.push("/");
  };

  const handleDemoHost = () => {
    loginAsHost();
    router.push("/hosting");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header startCollapsed={true} />

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-12">
        <div className="border border-gray-200 rounded-3xl p-8 shadow-xl bg-white space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition text-gray-700">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Log in or sign up</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">Welcome to Airbnb</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Account Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("GUEST")}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-sm font-semibold transition ${
                    role === "GUEST" 
                      ? "border-black bg-gray-50 text-black shadow-sm" 
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <User size={16} /> Guest Mode
                </button>
                <button
                  type="button"
                  onClick={() => setRole("HOST")}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-sm font-semibold transition ${
                    role === "HOST" 
                      ? "border-black bg-gray-50 text-black shadow-sm" 
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <Home size={16} /> Host Mode
                </button>
              </div>
            </div>

            {/* Country / Region selector */}
            <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Country / Region</label>
                <select 
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full text-xs font-semibold text-gray-900 bg-transparent outline-none cursor-pointer mt-0.5"
                >
                  <option value="India (+91)">India (+91)</option>
                  <option value="United States (+1)">United States (+1)</option>
                  <option value="United Kingdom (+44)">United Kingdom (+44)</option>
                </select>
              </div>

              <div className="p-3 border-b border-gray-200">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Nayan Sinha"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-sm outline-none text-gray-900 font-medium placeholder-gray-400 mt-0.5"
                />
              </div>

              <div className="p-3">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phone Number or Email</label>
                <input 
                  type="text"
                  required
                  placeholder="nayan@example.com or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm outline-none text-gray-900 font-medium placeholder-gray-400 mt-0.5"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#E51D53] hover:bg-[#d8164b] text-white py-3.5 rounded-xl font-bold text-base transition shadow-md"
            >
              Continue
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs font-semibold text-gray-500">or</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDemoGuest}
              className="w-full border border-gray-300 hover:border-black py-3 rounded-xl font-semibold text-sm text-gray-800 transition flex items-center justify-center gap-3"
            >
              <User size={18} className="text-rose-600" />
              <span>Quick Login as Guest (Happy Guest)</span>
            </button>

            <button
              onClick={handleDemoHost}
              className="w-full border border-gray-300 hover:border-black py-3 rounded-xl font-semibold text-sm text-gray-800 transition flex items-center justify-center gap-3"
            >
              <Home size={18} className="text-emerald-600" />
              <span>Quick Login as Host (Super Host)</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
