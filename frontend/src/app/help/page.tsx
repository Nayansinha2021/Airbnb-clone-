"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, HelpCircle, Shield, Calendar, Home, MessageSquare } from "lucide-react";

export default function HelpPage() {
  const [query, setQuery] = useState("");

  const topics = [
    { title: "Booking & Cancellations", desc: "How refund policies, date changes, and host cancellations work", icon: Calendar },
    { title: "Hosting Guides", desc: "Setting up your listing, pricing, and guest communication", icon: Home },
    { title: "Safety & Security", desc: "AirCover protection, identity verification, and community guidelines", icon: Shield },
    { title: "Payments & Refunds", desc: "Payment methods, resolution center, and fee breakdowns", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header startCollapsed={true} />

      <main className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full">
        {/* Banner Search */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-10 text-white text-center shadow-lg mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">How can we help?</h1>
          <p className="text-rose-100 text-sm mb-6">Search help articles or explore popular topics below</p>
          <div className="max-w-xl mx-auto bg-white rounded-full p-2 flex items-center shadow-md text-gray-800">
            <Search size={20} className="text-gray-400 ml-3 mr-2" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides, policies, or topics..." 
              className="w-full text-sm outline-none bg-transparent"
            />
            <button className="bg-black text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-gray-800 transition">
              Search
            </button>
          </div>
        </div>

        {/* Topics Grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Help Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {topics.map((t, i) => {
            const Icon = t.icon;
            return (
              <div key={i} className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-black transition cursor-pointer flex gap-4 items-start">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl flex-shrink-0">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 mb-1">{t.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="p-3 bg-white rounded-xl border border-gray-200 font-medium">How do I cancel a booking and receive a refund?</li>
            <li className="p-3 bg-white rounded-xl border border-gray-200 font-medium">What is AirCover for guests?</li>
            <li className="p-3 bg-white rounded-xl border border-gray-200 font-medium">How do I edit or delete my property listing as a host?</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
