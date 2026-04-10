"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Eye, EyeOff, Stethoscope, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

const SPECIALIZATIONS = [
  "Cardiology", "Neurology", "Pediatrics", "General Practice", "Dermatology", "Orthopedics"
];

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");
  const [specialization, setSpecialization] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
        toast.error("Username is required");
        return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (role === "DOCTOR" && !specialization) {
      toast.error("Please select a specialization");
      return;
    }

    setIsLoading(true);
    const result = await register(username, email, password, role, specialization, walletAddress);

    if (result.success) {
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } else {
      toast.error(result.error || "Registration failed");
    }

    setIsLoading(false);
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        toast.success("Wallet connected!");
      } catch (error) {
        toast.error("Wallet connection failed");
      }
    } else {
      toast.error("Please install MetaMask!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#030303] p-4 font-sans pt-24 pb-12">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900/50 rounded-3xl border-4 border-zinc-900 shadow-[12px_12px_0px_0px_rgba(24,24,27,1)] p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-100 dark:bg-rose-900/20 rounded-full blur-3xl" />

        <div className="relative">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl border-4 border-zinc-900 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(24,24,27,1)]">
            <UserPlus className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Create Account</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Join MedLedger&apos;s blockchain healthcare platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Toggle */}
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-400">
                I am a
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl border-4 border-zinc-900 font-bold text-sm transition-all",
                    role === "PATIENT"
                      ? "bg-indigo-500 text-white shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]"
                      : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50"
                  )}
                  onClick={() => { setRole("PATIENT"); setSpecialization(""); }}
                >
                  <User className="w-4 h-4" /> Patient
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl border-4 border-zinc-900 font-bold text-sm transition-all",
                    role === "DOCTOR"
                      ? "bg-indigo-500 text-white shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]"
                      : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50"
                  )}
                  onClick={() => setRole("DOCTOR")}
                >
                  <Stethoscope className="w-4 h-4" /> Doctor
                </button>
              </div>
            </div>

            {role === "DOCTOR" && !walletAddress ? (
              <div className="py-6 space-y-4 flex flex-col items-center border-4 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm text-center px-4">
                  Doctors must connect their wallet first to verify their on-chain identity.
                </p>
                <Button
                  type="button"
                  onClick={connectWallet}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all border-2 border-zinc-900"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg" alt="MetaMask" className="w-5 h-5 mr-2" />
                  Connect MetaMask
                </Button>
              </div>
            ) : (
              <>
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="reg-username" className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-400">
                    Username
                  </Label>
                  <div className="relative group">
                    <Input
                      id="reg-username"
                      type="text"
                      placeholder="johndoe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-14 pl-12 bg-white dark:bg-zinc-900 border-4 border-zinc-900 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500 transition-colors"
                      required
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                </div>


                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-400">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="hello@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 pl-12 bg-white dark:bg-zinc-900 border-4 border-zinc-900 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500 transition-colors"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                </div>

                {/* Specialization (only for doctors) */}
                {role === "DOCTOR" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-400">
                      Specialization
                    </Label>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full h-14 px-4 bg-white dark:bg-zinc-900 border-4 border-zinc-900 rounded-2xl font-medium text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors"
                      required
                    >
                      <option value="">Select specialization...</option>
                      {SPECIALIZATIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-400">
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 pl-12 pr-12 bg-white dark:bg-zinc-900 border-4 border-zinc-900 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500 transition-colors"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                      <div className="w-4 h-1 bg-zinc-400 group-focus-within:bg-indigo-500 rounded-full" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm" className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-400">
                    Confirm Password
                  </Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-14 pl-4 bg-white dark:bg-zinc-900 border-4 border-zinc-900 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500 transition-colors"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold text-lg shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] hover:shadow-none transition-all duration-200 mt-2"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </>
            )}
          </form>

          <p className="mt-8 text-center text-zinc-600 dark:text-zinc-400 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-indigo-500 hover:text-indigo-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
