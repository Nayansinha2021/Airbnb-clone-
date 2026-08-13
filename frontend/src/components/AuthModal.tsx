"use client";

import React, { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { X, User, Home, Mail, Phone, Lock, Check } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { loginCustom, loginAsGuest, loginAsHost } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("GUEST");
  const [countryCode, setCountryCode] = useState("India (+91)");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginCustom(fullName || "Nayan Sinha", email || "nayan@example.com", role);
    onClose();
  };

  const handleDemoGuest = () => {
    loginAsGuest();
    onClose();
  };

  const handleDemoHost = () => {
    loginAsHost();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between relative bg-white">
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition text-gray-700"
          >
            <X size={18} />
          </button>
          <h2 className="text-base font-bold text-gray-900 text-center flex-1 pr-8">
            Log in or sign up
          </h2>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Welcome to Airbnb</h3>

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
                  <option value="Canada (+1)">Canada (+1)</option>
                  <option value="Australia (+61)">Australia (+61)</option>
                </select>
              </div>

              {/* Full Name & Phone / Email inputs */}
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

            <p className="text-[11px] text-gray-500 leading-normal">
              We'll call or text you to confirm your number. Standard message and data rates apply. <span className="underline font-semibold cursor-pointer">Privacy Policy</span>
            </p>

            <button
              type="submit"
              className="w-full bg-[#E51D53] hover:bg-[#d8164b] text-white py-3.5 rounded-xl font-bold text-base transition shadow-md"
            >
              Continue
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs font-semibold text-gray-500">or</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          {/* Social Logins & Demo Quick Logins */}
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

            <button
              onClick={handleDemoGuest}
              className="w-full border border-gray-300 hover:border-black py-3 rounded-xl font-semibold text-sm text-gray-800 transition flex items-center justify-center gap-3"
            >
              <span className="font-bold text-blue-600">G</span>
              <span>Continue with Google</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
