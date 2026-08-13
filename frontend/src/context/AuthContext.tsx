"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "GUEST" | "HOST";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loginAsGuest: () => void;
  loginAsHost: () => void;
  loginCustom: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("airbnb_clone_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    }
  }, []);

  const loginAsGuest = () => {
    const guestUser: User = { id: 2, name: "Happy Guest", email: "guest@example.com", role: "GUEST" };
    setUser(guestUser);
    localStorage.setItem("airbnb_clone_user", JSON.stringify(guestUser));
  };

  const loginAsHost = () => {
    const hostUser: User = { id: 1, name: "Super Host", email: "host@example.com", role: "HOST" };
    setUser(hostUser);
    localStorage.setItem("airbnb_clone_user", JSON.stringify(hostUser));
  };

  const loginCustom = (name: string, email: string, role: UserRole) => {
    const customUser: User = {
      id: Date.now(),
      name: name || "Nayan Sinha",
      email: email || "nayan@example.com",
      role: role || "GUEST"
    };
    setUser(customUser);
    localStorage.setItem("airbnb_clone_user", JSON.stringify(customUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("airbnb_clone_user");
  };

  return (
    <AuthContext.Provider value={{ user, loginAsGuest, loginAsHost, loginCustom, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
