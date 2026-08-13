"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  Heart, Home, MessageSquare, User, Bell, Settings, 
  Globe, HelpCircle, Users, UserPlus, LogOut, ArrowRightLeft
} from "lucide-react";

interface ProfileMenuProps {
  onClose: () => void;
}

export default function ProfileMenu({ onClose }: ProfileMenuProps) {
  const { user, loginAsGuest, loginAsHost, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleActionToast = (msg: string) => {
    alert(msg);
    onClose();
  };

  return (
    <div 
      ref={menuRef} 
      className="absolute top-16 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-[100] py-3 text-sm text-gray-800 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Current User Role Info Header */}
      {user && (
        <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 flex justify-between items-center text-xs">
          <span className="text-gray-500 font-medium">Logged in as</span>
          <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
            {user.name} ({user.role})
          </span>
        </div>
      )}

      {/* Section 1: Main Links */}
      <div className="py-1">
        <Link 
          href="/wishlists" 
          onClick={onClose}
          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
        >
          <Heart size={18} className="text-gray-700" />
          <span>Wishlists</span>
        </Link>
        
        <Link 
          href="/trips" 
          onClick={onClose}
          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
        >
          <Home size={18} className="text-gray-700" />
          <span>Trips</span>
        </Link>

        <button 
          onClick={() => handleActionToast("Messages: No unread messages.")}
          className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
        >
          <MessageSquare size={18} className="text-gray-700" />
          <span>Messages</span>
        </button>

        <button 
          onClick={() => handleActionToast(`User Profile: ${user ? user.name : 'Guest User'}`)}
          className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
        >
          <User size={18} className="text-gray-700" />
          <span>Profile</span>
        </button>
      </div>

      <hr className="my-1 border-gray-100" />

      {/* Section 2: Account & Support */}
      <div className="py-1">
        <button 
          onClick={() => handleActionToast("Notifications: You're all caught up!")}
          className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-gray-50 font-normal transition-colors cursor-pointer text-gray-700"
        >
          <Bell size={18} className="text-gray-700" />
          <span>Notifications</span>
        </button>

        <Link 
          href="/hosting" 
          onClick={onClose}
          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 font-normal transition-colors cursor-pointer text-gray-700"
        >
          <Settings size={18} className="text-gray-700" />
          <span>Account settings</span>
        </Link>

        <button 
          onClick={() => handleActionToast("Language & Currency: English (IN) · INR (₹)")}
          className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-gray-50 font-normal transition-colors cursor-pointer text-gray-700"
        >
          <Globe size={18} className="text-gray-700" />
          <span>Languages & currency</span>
        </button>

        <button 
          onClick={() => handleActionToast("Help Centre: Contact Airbnb support or view FAQs.")}
          className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-gray-50 font-normal transition-colors cursor-pointer text-gray-700"
        >
          <HelpCircle size={18} className="text-gray-700" />
          <span>Help Centre</span>
        </button>
      </div>

      <hr className="my-1 border-gray-100" />

      {/* Section 3: Become a Host Card */}
      <div className="p-2">
        <Link 
          href="/hosting" 
          onClick={onClose}
          className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer group border border-gray-100"
        >
          <div>
            <span className="font-semibold block text-gray-900">Become a host</span>
            <span className="text-xs text-gray-500 block max-w-[170px] leading-tight mt-0.5">
              It's easy to start hosting and earn extra income.
            </span>
          </div>
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-105 transition-transform">
            🏠
          </div>
        </Link>

        <button 
          onClick={() => handleActionToast("Referral link copied to clipboard!")}
          className="flex items-center gap-3 w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg font-normal transition-colors cursor-pointer text-gray-700 mt-1"
        >
          <UserPlus size={16} className="text-gray-600" />
          <span>Refer a host</span>
        </button>

        <button 
          onClick={() => handleActionToast("Find a co-host feature: Browse local co-hosts in your area.")}
          className="flex items-center gap-3 w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg font-normal transition-colors cursor-pointer text-gray-700"
        >
          <Users size={16} className="text-gray-600" />
          <span>Find a co-host</span>
        </button>
      </div>

      <hr className="my-1 border-gray-100" />

      {/* Section 4: Role Switch & Auth */}
      <div className="py-1">
        {user?.role === "HOST" ? (
          <button 
            onClick={() => { loginAsGuest(); onClose(); }}
            className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-gray-50 font-semibold text-rose-600 transition-colors cursor-pointer"
          >
            <ArrowRightLeft size={16} />
            <span>Switch to Guest account</span>
          </button>
        ) : (
          <button 
            onClick={() => { loginAsHost(); onClose(); }}
            className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-gray-50 font-semibold text-rose-600 transition-colors cursor-pointer"
          >
            <ArrowRightLeft size={16} />
            <span>Switch to Host account</span>
          </button>
        )}

        {user ? (
          <button 
            onClick={() => { logout(); onClose(); }}
            className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-gray-50 font-medium text-gray-700 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        ) : (
          <button 
            onClick={() => { loginAsGuest(); onClose(); }}
            className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-gray-50 font-semibold text-gray-900 transition-colors cursor-pointer"
          >
            <span>Log in / Sign up</span>
          </button>
        )}
      </div>

    </div>
  );
}
