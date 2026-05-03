"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Stethoscope, User, ShieldCheck } from "lucide-react";

interface PupilProps {
  size?: number;
  maxDistance?: number;
  isFocused?: boolean;
}

const Pupil = ({ size = 8, maxDistance = 6, isFocused = false }: PupilProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isFocused) return;
      const x = (e.clientX / window.innerWidth - 0.5) * maxDistance;
      const y = (e.clientY / window.innerHeight - 0.5) * maxDistance;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [maxDistance, isFocused]);

  return (
    <div
      className="bg-zinc-900 rounded-full transition-transform duration-75"
      style={{
        width: size,
        height: size,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    />
  );
};

const CharacterHead = ({ isFocused = false, isPassword = false }) => {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      {/* Head */}
      <div className="absolute inset-0 bg-indigo-100 rounded-2xl border-4 border-zinc-900 shadow-xl overflow-hidden">
        {/* Ears */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-6 bg-indigo-100 border-4 border-zinc-900 rounded-full" />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-6 bg-indigo-100 border-4 border-zinc-900 rounded-full" />

        {/* Face */}
        <div className="relative h-full pt-10">
          <div className="flex justify-center gap-6">
            {/* Eyes */}
            <div className="relative w-10 h-10 bg-white border-4 border-zinc-900 rounded-xl flex items-center justify-center overflow-hidden">
              {!isPassword ? (
                <Pupil isFocused={isFocused} />
              ) : (
                <div className="w-full h-1 bg-zinc-900 mt-2 rotate-12" />
              )}
            </div>
            <div className="relative w-10 h-10 bg-white border-4 border-zinc-900 rounded-xl flex items-center justify-center overflow-hidden">
              {!isPassword ? (
                <Pupil isFocused={isFocused} />
              ) : (
                <div className="w-full h-1 bg-zinc-900 mt-2 -rotate-12" />
              )}
            </div>
          </div>

          {/* Mouth */}
          <div
            className={cn(
              "mt-6 mx-auto w-8 h-2 bg-zinc-900 rounded-full transition-all duration-300",
              isFocused && "w-12 h-6 rounded-b-full bg-transparent border-b-4 border-zinc-900"
            )}
          />
        </div>
      </div>

      {/* Accessories */}
      <div className="absolute -top-4 -right-2 w-8 h-8 bg-amber-400 border-4 border-zinc-900 rounded-lg rotate-12 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-zinc-900" />
      </div>
    </div>
  );
};

export function AnimatedCharactersLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [step, setStep] = useState<"CREDENTIALS" | "WALLET">("CREDENTIALS");
  const [role, setRole] = useState<"PATIENT" | "DOCTOR" | "ADMIN">("PATIENT");
  const [walletAddress, setWalletAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tempToken, setTempToken] = useState<any>(null);

  const { login, confirmWallet, user } = useAuth();
  const router = useRouter();

  // Redirect if already fully logged in (with wallet)
  useEffect(() => {
    if (user && user.isWalletConnected) {
      router.push(user.role === "ADMIN" ? "/admin" : "/dashboard");
    } else if (user && !user.isWalletConnected) {
        setStep("WALLET");
    }
  }, [user, router]);

  const connectWalletInit = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        toast.success("Wallet connected! You may now sign in.");
      } catch (error) {
        toast.error("Wallet connection failed");
      }
    } else {
      toast.error("Please install MetaMask!");
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const res = await confirmWallet(accounts[0]);
        if (res.success) {
            toast.success(`Wallet confirmed!`);
            router.push(role === "ADMIN" ? "/admin" : "/dashboard");
        } else {
            toast.error(res.error || "Wallet confirmation failed");
        }
      } catch (error) {
        toast.error("Wallet connection failed");
      }
    } else {
      toast.error("Please install MetaMask!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success("Identity verified! Now connect your wallet.");
      setStep("WALLET");
    } else {
      toast.error(result.error || "Login failed");
    }

    setIsLoading(false);
  };
  
  // prefill admin
  useEffect(() => {
     if (role === "ADMIN") {
        setEmail("admin@gmail.com");
        setPassword("123456");
     } else if (email === "admin@gmail.com") {
        setEmail("");
        setPassword("");
     }
  }, [role]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#030303] p-4 font-sans pt-20">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900/50 rounded-3xl border-4 border-zinc-900 shadow-[12px_12px_0px_0px_rgba(24,24,27,1)] p-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl" />

        <div className="relative">
          <CharacterHead
            isFocused={isEmailFocused || isPasswordFocused}
            isPassword={isPasswordFocused}
          />

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                {step === "CREDENTIALS" ? "Welcome Back!" : "Final Step"}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
                {step === "CREDENTIALS" ? "Please enter your details" : "Connect your MetaMask to continue"}
            </p>
          </div>

          {step === "CREDENTIALS" ? (
            <div className="space-y-6">
              {/* Role Toggle */}
              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-400">
                  Login as
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center gap-1 py-3 rounded-xl border-4 border-zinc-900 font-bold text-xs transition-all",
                      role === "PATIENT"
                        ? "bg-indigo-500 text-white shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]"
                        : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50"
                    )}
                    onClick={() => setRole("PATIENT")}
                  >
                    <User className="w-3 h-3" /> Patient
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center gap-1 py-3 rounded-xl border-4 border-zinc-900 font-bold text-xs transition-all",
                      role === "DOCTOR"
                        ? "bg-indigo-500 text-white shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]"
                        : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50"
                    )}
                    onClick={() => setRole("DOCTOR")}
                  >
                    <Stethoscope className="w-3 h-3" /> Doctor
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center gap-1 py-3 rounded-xl border-4 border-zinc-900 font-bold text-xs transition-all",
                      role === "ADMIN"
                        ? "bg-indigo-500 text-white shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]"
                        : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50"
                    )}
                    onClick={() => setRole("ADMIN")}
                  >
                    <ShieldCheck className="w-3 h-3" /> Admin
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
                    onClick={connectWalletInit}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all border-2 border-zinc-900"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg" alt="MetaMask" className="w-5 h-5 mr-2" />
                    Connect MetaMask
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-400">
                        Email Address
                    </Label>
                    <div className="relative group">
                        <Input
                        id="email"
                        type="email"
                        placeholder="hello@example.com"
                        value={email}
                        readOnly={role === "ADMIN"}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 pl-12 bg-white dark:bg-zinc-900 border-4 border-zinc-900 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500 transition-colors text-lg"
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => setIsEmailFocused(false)}
                        required
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-400">
                        Password
                    </Label>
                    <div className="relative group">
                        <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        readOnly={role === "ADMIN"}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-14 pl-12 pr-12 bg-white dark:bg-zinc-900 border-4 border-zinc-900 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500 transition-colors text-lg"
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        required
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center cursor-default">
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

                    <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold text-xl shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] hover:shadow-none transition-all duration-200 mt-2 border-2 border-zinc-900"
                    >
                    {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-6">
                <Button
                    onClick={connectWallet}
                    className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xl shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] hover:shadow-none translate-y-0 hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 flex items-center justify-center gap-4 border-4 border-zinc-900"
                >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg" alt="MetaMask" className="w-8 h-8" />
                    Connect MetaMask
                </Button>
                <p className="text-center text-xs text-zinc-500 font-medium px-4">
                    Blockchain verification is required for all role-based actions and transaction logging.
                </p>
                <Button 
                    variant="ghost" 
                    onClick={() => setStep("CREDENTIALS")}
                    className="w-full font-bold text-zinc-400 hover:text-zinc-900"
                >
                    Back to login
                </Button>
            </div>
          )}

          <p className="mt-8 text-center text-zinc-600 dark:text-zinc-400 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-indigo-500 hover:text-indigo-600">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

