"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Bell, CheckCircle, Tag, ShieldCheck, Heart } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "Booking Confirmed!",
      desc: "Your trip to Luxury Pool Estate in Panchkula is confirmed for Aug 20.",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      id: 2,
      title: "Special Host Promotion",
      desc: "Earn 10% bonus revenue when hosting your first 3 stays this summer.",
      time: "1 day ago",
      icon: Tag,
      color: "text-amber-600 bg-amber-50"
    },
    {
      id: 3,
      title: "Saved Property Price Drop",
      desc: "A property in your wishlist 'Chandigarh Modern Villa' updated pricing.",
      time: "3 days ago",
      icon: Heart,
      color: "text-rose-600 bg-rose-50"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header startCollapsed={true} />

      <main className="max-w-4xl mx-auto px-6 py-10 flex-1 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>

        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100 bg-white">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.id} className="p-5 flex gap-4 items-start hover:bg-gray-50 transition cursor-pointer">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-sm text-gray-900">{n.title}</h3>
                    <span className="text-xs text-gray-400">{n.time}</span>
                  </div>
                  <p className="text-xs text-gray-600">{n.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
