"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Star, MapPin, ShieldCheck } from "lucide-react";

export default function CoHostPage() {
  const coHosts = [
    { name: "Superhost Rahul", location: "Chandigarh & Panchkula", rating: 4.98, stays: 42, img: "https://ui-avatars.com/api/?name=Rahul&background=0D9488&color=fff" },
    { name: "Priya Sharma", location: "Goa & Coastal Region", rating: 4.95, stays: 28, img: "https://ui-avatars.com/api/?name=Priya&background=7C3AED&color=fff" },
    { name: "Vikram Mehta", location: "Manali & Hill Stations", rating: 4.99, stays: 65, img: "https://ui-avatars.com/api/?name=Vikram&background=DC2626&color=fff" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header startCollapsed={true} />

      <main className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Co-Host</h1>
        <p className="text-gray-600 text-sm mb-8">Get help managing your property from experienced local co-hosts in your area.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coHosts.map((ch, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
              <img src={ch.img} alt={ch.name} className="w-20 h-20 rounded-full mb-3 shadow" />
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-1">
                {ch.name} <ShieldCheck size={16} className="text-emerald-600" />
              </h3>
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1 my-1">
                <MapPin size={12} /> {ch.location}
              </p>
              <div className="flex items-center gap-1 text-xs font-semibold my-2">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span>{ch.rating} · {ch.stays} listings managed</span>
              </div>
              <button 
                onClick={() => alert(`Contact request sent to ${ch.name}!`)}
                className="mt-4 w-full bg-black text-white py-2.5 rounded-xl font-semibold text-xs hover:bg-gray-800 transition"
              >
                Contact Co-Host
              </button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
