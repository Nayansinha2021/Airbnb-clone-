"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { User, Shield, CreditCard, Bell, Eye, Lock, Globe } from "lucide-react";

export default function AccountPage() {
  const cards = [
    { title: "Personal info", desc: "Provide personal details and how we can reach you", icon: User, href: "/profile" },
    { title: "Login & security", desc: "Update your password and secure your account", icon: Shield, href: "/profile" },
    { title: "Payments & payouts", desc: "Review payments, payouts, coupons, and gift cards", icon: CreditCard, href: "/trips" },
    { title: "Notifications", desc: "Choose notification preferences and how you want to be contacted", icon: Bell, href: "/notifications" },
    { title: "Privacy & sharing", desc: "Manage your personal data, connected services, and sharing settings", icon: Lock, href: "/profile" },
    { title: "Global preferences", desc: "Set your default language, currency, and time zone", icon: Globe, href: "/profile" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header startCollapsed={true} />

      <main className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-sm text-gray-500 mb-8">Manage your personal settings, security preferences, and account controls</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <Link 
                key={i} 
                href={c.href}
                className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <Icon size={28} className="text-gray-800 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-base text-gray-900 mb-1">{c.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
