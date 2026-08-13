"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Shield, Check, Edit2, Camera } from "lucide-react";

export default function ProfilePage() {
  const { user, loginAsGuest, loginAsHost } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "Nayan Sinha");
  const [about, setAbout] = useState("Avid traveler, design enthusiast, and frequent Airbnb guest!");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header startCollapsed={true} />

      <main className="max-w-4xl mx-auto px-6 py-10 flex-1 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Personal Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Avatar Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="relative mb-4">
              <div className="w-28 h-28 bg-[#FFEAEF] text-[#C1121F] rounded-full flex items-center justify-center font-bold text-4xl shadow-inner">
                {name.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full shadow hover:scale-110 transition">
                <Camera size={14} />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{name}</h2>
            <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
              Role: {user?.role || "GUEST"}
            </span>

            <div className="w-full border-t border-gray-200 my-4 pt-4 text-left space-y-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600" /> Identity Verified
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600" /> Email Confirmed
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600" /> Phone Number Confirmed
              </div>
            </div>

            <button 
              onClick={() => user?.role === 'HOST' ? loginAsGuest() : loginAsHost()}
              className="w-full mt-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-xl text-xs transition"
            >
              Switch to {user?.role === 'HOST' ? 'Guest' : 'Host'} Mode
            </button>
          </div>

          {/* Right Details Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-lg font-bold text-gray-900">About You</h3>
                <button 
                  onClick={() => setEditing(!editing)}
                  className="text-xs font-semibold underline text-gray-700 hover:text-black flex items-center gap-1"
                >
                  <Edit2 size={12} /> {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                {editing ? (
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-black"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                <p className="text-sm text-gray-900">{user?.email || "nayan@example.com"}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Biography</label>
                {editing ? (
                  <textarea 
                    rows={3}
                    value={about} 
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-black"
                  />
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed">{about}</p>
                )}
              </div>

              {editing && (
                <button 
                  onClick={() => setEditing(false)}
                  className="bg-black text-white px-5 py-2.5 rounded-xl font-semibold text-xs hover:bg-gray-800 transition"
                >
                  Save Profile
                </button>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
