"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  LogOut,
  User,
  Search,
  CalendarCheck,
  ShieldCheck,
  Stethoscope,
  Menu,
  X,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Don't show navbar on landing page
  if (pathname === "/") return null;

  const navLinks = [
    { href: "/search", label: "Find Doctors", icon: Search, roles: ["PATIENT", "DOCTOR", "ADMIN"] },
    { href: "/dashboard", label: "My Appointments", icon: CalendarCheck, roles: ["PATIENT", "DOCTOR", "ADMIN"] },
    ...(user?.role === "ADMIN" ? [{ href: "/admin", label: "Admin Console", icon: ShieldCheck, roles: ["ADMIN"] }] : []),
    ...(user?.role === "DOCTOR" ? [{ href: "/doctor/slots/manage", label: "Manage Slots", icon: Stethoscope, roles: ["DOCTOR"] }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b-2 border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Med<span className="text-indigo-500">Ledger</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ModeToggle />

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                {/* Wallet Address Badge */}
                {user.walletAddress && user.isWalletConnected && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <User className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {user.username || user.email.split("@")[0]}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-2 border-zinc-300 dark:border-zinc-700 font-medium"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="font-medium border-2 border-zinc-300 dark:border-zinc-700">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="font-medium bg-indigo-600 hover:bg-indigo-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-2">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 mb-1 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <User className="w-4 h-4 text-zinc-500" />
                <span className="text-sm font-medium">{user.username || user.email}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {user.role}
                </span>
              </div>
              {/* Mobile wallet badge */}
              {user.walletAddress && user.isWalletConnected && (
                <div className="flex items-center gap-1.5 px-3 py-2 mb-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                  </span>
                </div>
              )}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              <Button
                variant="outline"
                className="w-full mt-2 border-2 font-medium"
                onClick={() => { logout(); setMobileOpen(false); }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full font-medium border-2">Sign In</Button>
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}>
                <Button className="w-full font-medium bg-indigo-600 hover:bg-indigo-700 text-white">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
