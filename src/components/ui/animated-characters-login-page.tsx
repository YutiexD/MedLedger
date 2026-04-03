"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";


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
          <div className={cn(
            "mt-6 mx-auto w-8 h-2 bg-zinc-900 rounded-full transition-all duration-300",
            isFocused && "w-12 h-6 rounded-b-full bg-transparent border-b-4 border-zinc-900"
          )} />
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
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setWalletAddress(accounts[0]);
            } catch (error) {
                console.error('Wallet connection failed:', error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Auth logic here
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#030303] p-4 font-sans">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900/50 rounded-3xl border-4 border-zinc-900 shadow-[12px_12px_0px_0px_rgba(24,24,27,1)] p-8 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl" />
                
                <div className="relative">
                    <CharacterHead 
                      isFocused={isEmailFocused || isPasswordFocused} 
                      isPassword={isPasswordFocused}
                    />

                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Welcome Back!</h2>
                        <p className="text-zinc-500 dark:text-zinc-400">Please enter your details or connect wallet</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-400">Email Address</Label>
                            <div className="relative group">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="hello@example.com"
                                    className="h-14 pl-12 bg-white dark:bg-zinc-900 border-4 border-zinc-900 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500 transition-colors"
                                    onFocus={() => setIsEmailFocused(true)}
                                    onBlur={() => setIsEmailFocused(false)}
                                    required
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-400">Password</Label>
                            <div className="relative group">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="h-14 pl-12 pr-12 bg-white dark:bg-zinc-900 border-4 border-zinc-900 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500 transition-colors"
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                    required
                                />
                                <div 
                                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center cursor-default"
                                >
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

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" className="border-2 border-zinc-900 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-zinc-900" />
                                <Label htmlFor="remember" className="text-sm font-medium leading-none cursor-pointer text-zinc-600 dark:text-zinc-400">Remember me</Label>
                            </div>
                            <a href="#" className="text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors">Forgot Password?</a>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold text-lg shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] hover:shadow-none transition-all duration-200 mt-2"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-8 flex flex-col gap-4">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-x-0 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                            <span className="relative px-4 bg-white dark:bg-zinc-900 text-sm font-bold text-zinc-400 uppercase tracking-widest leading-none">OR</span>
                        </div>
                        
                        <Button
                            onClick={connectWallet}
                            variant="outline"
                            className="h-14 border-4 border-zinc-900 rounded-2xl font-bold bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-3"
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg" alt="MetaMask" className="w-6 h-6" />
                            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect MetaMask"}
                        </Button>
                    </div>

                    <p className="mt-8 text-center text-zinc-600 dark:text-zinc-400 font-medium">
                        Don't have an account?{" "}
                        <a href="#" className="font-bold text-indigo-500 hover:text-indigo-600">Create one</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
