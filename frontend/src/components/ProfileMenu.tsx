import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

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

  return (
    <div 
      ref={menuRef} 
      className="absolute top-14 right-0 w-64 bg-white rounded-xl shadow-[var(--shadow-modal)] border border-[var(--color-border-subtle)] overflow-hidden z-[100] py-2 text-sm text-[var(--color-text-primary)]"
    >
      {user ? (
        <>
          <div className="px-4 py-2 font-semibold">
            Logged in as {user.name} ({user.role})
          </div>
          <hr className="my-1 border-[var(--color-border-subtle)]" />
          <Link href="/trips" className="block px-4 py-3 hover:bg-[var(--color-surface-muted)] font-medium transition-colors">
            Trips
          </Link>
          <Link href="/wishlists" className="block px-4 py-3 hover:bg-[var(--color-surface-muted)] font-medium transition-colors">
            Wishlists
          </Link>
          <hr className="my-1 border-[var(--color-border-subtle)]" />
          <Link href="/hosting" className="block px-4 py-3 hover:bg-[var(--color-surface-muted)] transition-colors">
            Manage listings
          </Link>
          <Link href="/account" className="block px-4 py-3 hover:bg-[var(--color-surface-muted)] transition-colors">
            Account
          </Link>
          <hr className="my-1 border-[var(--color-border-subtle)]" />
          <button 
            onClick={() => { logout(); onClose(); }}
            className="block w-full text-left px-4 py-3 hover:bg-[var(--color-surface-muted)] transition-colors"
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <div 
            onClick={() => { loginAsGuest(); onClose(); }}
            className="block px-4 py-3 hover:bg-[var(--color-surface-muted)] font-semibold transition-colors cursor-pointer"
          >
            Sign in as Guest
          </div>
          <div 
            onClick={() => { loginAsHost(); onClose(); }}
            className="block px-4 py-3 hover:bg-[var(--color-surface-muted)] font-semibold transition-colors cursor-pointer"
          >
            Sign in as Host
          </div>
          <hr className="my-1 border-[var(--color-border-subtle)]" />
          <Link href="/hosting" className="block px-4 py-3 hover:bg-[var(--color-surface-muted)] transition-colors">
            Airbnb your home
          </Link>
          <Link href="/help" className="block px-4 py-3 hover:bg-[var(--color-surface-muted)] transition-colors">
            Help Centre
          </Link>
        </>
      )}
    </div>
  );
}
