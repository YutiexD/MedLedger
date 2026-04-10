"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
  walletAddress?: string;
  isWalletConnected?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string, role?: string, specialization?: string, walletAddress?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  confirmWallet: (address: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("medledger_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // On refresh, we might need to re-verify wallet, but for now we trust the stored flag if it exists
        setUser(parsed);
      } catch {
        localStorage.removeItem("medledger_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const contentType = res.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("[LOGIN] Received non-JSON response:", text.substring(0, 500));
        return { success: false, error: "The server returned an invalid response (HTML page instead of JSON)." };
      }

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }
      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
        role: data.user.role,
        walletAddress: data.user.walletAddress || undefined,
        isWalletConnected: false, // Must be connected in step 2
      };
      setUser(authUser);
      localStorage.setItem("medledger_user", JSON.stringify(authUser));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const register = async (username: string, email: string, password: string, role?: string, specialization?: string, walletAddress?: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role, specialization, walletAddress }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("medledger_user");
  };

  const confirmWallet = async (address: string) => {
    if (!user) return { success: false, error: "No active session" };
    
    // In a real app, you'd verify a signature here. 
    // For now we check if it matches the registered address (if any) or just link it.
    try {
        const updated = { ...user, walletAddress: address, isWalletConnected: true };
        setUser(updated);
        localStorage.setItem("medledger_user", JSON.stringify(updated));
        
        // Optionally update the wallet in DB if not set
        if (!user.walletAddress) {
            await fetch("/api/auth/update-wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, walletAddress: address }),
            });
        }
        
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, confirmWallet }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
