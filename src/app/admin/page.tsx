"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserMinus, UserPlus, Users, Search, Wallet, Plus, Trash2, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ethers } from "ethers";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [walletInput, setWalletInput] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [specInput, setSpecInput] = useState("General Practice");
    const [searchQuery, setSearchQuery] = useState("");
    const [txHistory, setTxHistory] = useState<{hash: string; action: string; address: string}[]>([]);
    const { user, isLoading: authLoading, confirmWallet } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && (!user || user.role !== "ADMIN")) {
            toast.error("Admin access required");
            router.push("/dashboard");
        }
    }, [user, authLoading, router]);

    const connectAdminWallet = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                const res = await confirmWallet(accounts[0]);
                if (res.success) {
                    toast.success("Admin wallet connected!");
                } else {
                    toast.error(res.error || "Wallet connection failed");
                }
            } catch (error) {
                toast.error("Wallet connection failed");
            }
        } else {
            toast.error("Please install MetaMask!");
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const ct = res.headers.get("Content-Type");
            if (!ct || !ct.includes("application/json")) { setUsers([]); return; }
            const data = await res.json();
            setUsers(data.users || []);
        } catch { setUsers([]); }
    };

    useEffect(() => {
        if (user?.role === "ADMIN") fetchUsers();
    }, [user]);

    const SPECIALIZATIONS = [
        "General Practice", "Cardiology", "Neurology", "Pediatrics", "Dermatology", "Orthopedics"
    ];

    const addDoctorOnChain = async () => {
        if (!walletInput || !ethers.isAddress(walletInput)) {
            toast.error("Please enter a valid Ethereum wallet address");
            return;
        }
        if (!nameInput.trim()) {
            toast.error("Please enter the doctor's name");
            return;
        }

        setIsLoading(true);
        try {
            toast.info("Please confirm the transaction in MetaMask...");
            const ABI = [
                "function addDoctor(address doctor, string name, string specialization) public",
            ];
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, ABI, signer);

            const tx = await contract.addDoctor(walletInput, nameInput, specInput);
            toast.info("Waiting for block confirmation...");
            const receipt = await tx.wait();

            // Also create the user in DB if not exists, or update role
            await fetch("/api/admin/add-doctor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walletAddress: walletInput, name: nameInput, specialization: specInput }),
            });

            setTxHistory(prev => [{ hash: receipt.hash, action: "ADD", address: walletInput }, ...prev]);
            toast.success(
                <div className="flex flex-col gap-1">
                    <span>Doctor added on-chain!</span>
                    <a href={`https://sepolia.etherscan.io/tx/${receipt.hash}`} target="_blank" className="text-xs font-bold underline">
                        View on Etherscan
                    </a>
                </div>
            );
            setWalletInput("");
            setNameInput("");
            fetchUsers();
        } catch (error: any) {
            toast.error(`Failed: ${error.reason || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const removeDoctorOnChain = async (targetUser: any) => {
        if (!targetUser.walletAddress) {
            toast.error("This user has no linked wallet");
            return;
        }
        setIsLoading(true);
        try {
            toast.info("Please confirm removal in MetaMask...");
            const ABI = ["function removeDoctor(address doctor) public"];
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, ABI, signer);

            const tx = await contract.removeDoctor(targetUser.walletAddress);
            toast.info("Waiting for block confirmation...");
            const receipt = await tx.wait();

            await fetch("/api/admin/role", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: targetUser._id, role: "PATIENT" }),
            });

            setTxHistory(prev => [{ hash: receipt.hash, action: "REMOVE", address: targetUser.walletAddress }, ...prev]);
            toast.success("Doctor removed from on-chain registry");
            fetchUsers();
        } catch (error: any) {
            toast.error(`Failed: ${error.reason || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = users.filter((u: any) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (u.email?.toLowerCase().includes(q) || u.walletAddress?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q));
    });

    const doctors = filteredUsers.filter((u: any) => u.role === "DOCTOR");
    const patients = filteredUsers.filter((u: any) => u.role === "PATIENT");

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center border-4 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)]">
                            <ShieldCheck className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold uppercase tracking-tight">Admin Console</h1>
                            <p className="text-sm text-zinc-500 font-medium">On-chain doctor registry management</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="h-10 px-4 border-2 border-zinc-900 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold uppercase tracking-widest text-xs shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                        Master Admin
                    </Badge>
                </div>

                {/* Wallet Gate */}
                {!user?.isWalletConnected ? (
                    <Card className="border-4 border-dashed border-amber-400 dark:border-amber-600 shadow-[8px_8px_0px_0px_rgba(245,158,11,0.4)] rounded-3xl overflow-hidden bg-white dark:bg-zinc-900">
                        <CardContent className="p-12 flex flex-col items-center gap-6">
                            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                <Wallet className="w-10 h-10 text-amber-600" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-bold">Connect Admin Wallet</h3>
                                <p className="text-zinc-500 max-w-md">
                                    You must connect the contract owner&apos;s MetaMask wallet to perform on-chain operations like adding or removing doctors.
                                </p>
                            </div>
                            <Button
                                onClick={connectAdminWallet}
                                className="h-16 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all border-4 border-zinc-900 flex items-center gap-3"
                            >
                                <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg" alt="MetaMask" className="w-7 h-7" />
                                Connect MetaMask
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>

                {/* Add Doctor Card */}
                <Card className="border-4 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(79,70,229,1)] rounded-3xl overflow-hidden bg-white dark:bg-zinc-900">
                    <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20 border-b-4 border-zinc-900">
                        <CardTitle className="text-xl font-bold uppercase flex items-center gap-3">
                            <Wallet className="w-6 h-6 text-indigo-600" />
                            Register Doctor by Wallet Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Wallet Address *</Label>
                                <Input
                                    placeholder="0x..."
                                    value={walletInput}
                                    onChange={(e) => setWalletInput(e.target.value)}
                                    className="h-14 bg-white dark:bg-zinc-800 border-4 border-zinc-900 rounded-2xl font-mono text-sm focus-visible:ring-0 focus-visible:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Doctor Name *</Label>
                                <Input
                                    placeholder="Dr. John Doe"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    className="h-14 bg-white dark:bg-zinc-800 border-4 border-zinc-900 rounded-2xl focus-visible:ring-0 focus-visible:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Specialization</Label>
                                <select
                                    value={specInput}
                                    onChange={(e) => setSpecInput(e.target.value)}
                                    className="w-full h-14 px-4 bg-white dark:bg-zinc-800 border-4 border-zinc-900 rounded-2xl font-medium text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                                >
                                    {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <Button
                                    onClick={addDoctorOnChain}
                                    disabled={isLoading}
                                    className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold text-lg shadow-[6px_6px_0px_0px_rgba(79,70,229,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all border-4 border-zinc-900"
                                >
                                    <Plus className="w-6 h-6 mr-2" />
                                    {isLoading ? "Processing..." : "Add Doctor On-Chain"}
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-zinc-400 mt-4 font-medium">
                            This will register the doctor on the Sepolia blockchain via the smart contract. The wallet address will be granted the DOCTOR role.
                        </p>
                    </CardContent>
                </Card>

                {/* Search Bar */}
                <div className="relative group max-w-lg">
                    <Input
                        placeholder="Search by name, email, or wallet..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-14 pl-14 bg-white dark:bg-zinc-900 border-4 border-zinc-900 rounded-2xl focus-visible:ring-0 focus-visible:border-indigo-500 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] transition-all text-base"
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>

                {/* Registered Doctors */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border-4 border-zinc-900 shadow-[10px_10px_0px_0px_rgba(24,24,27,1)] overflow-hidden">
                    <div className="bg-zinc-100 dark:bg-zinc-800 border-b-4 border-zinc-900 px-6 py-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-500" />
                            Registered Doctors ({doctors.length})
                        </h2>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b-2 border-zinc-200 dark:border-zinc-700">
                                <TableHead className="font-bold py-4 px-6 uppercase tracking-widest text-xs">Name</TableHead>
                                <TableHead className="font-bold py-4 px-6 uppercase tracking-widest text-xs">Wallet</TableHead>
                                <TableHead className="font-bold py-4 px-6 uppercase tracking-widest text-xs">Specialization</TableHead>
                                <TableHead className="text-right font-bold py-4 px-6 uppercase tracking-widest text-xs">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {doctors.length > 0 ? doctors.map((doc: any) => (
                                <TableRow key={doc._id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 transition-colors">
                                    <TableCell className="px-6 py-5">
                                        <div className="font-bold text-base">{doc.username || doc.email?.split("@")[0]}</div>
                                        <div className="text-xs text-zinc-400">{doc.email}</div>
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        {doc.walletAddress ? (
                                            <code className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-mono border border-zinc-200 dark:border-zinc-700">
                                                {doc.walletAddress.slice(0, 8)}...{doc.walletAddress.slice(-6)}
                                            </code>
                                        ) : (
                                            <span className="text-xs italic text-zinc-400">No wallet</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs">{doc.specialization || "General"}</Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-5 text-right">
                                        <Button
                                            onClick={() => removeDoctorOnChain(doc)}
                                            disabled={isLoading || !doc.walletAddress}
                                            variant="outline"
                                            size="sm"
                                            className="font-bold text-rose-600 border-2 border-rose-300 rounded-xl hover:bg-rose-50 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-zinc-400 italic">
                                        No doctors registered yet. Use the form above to add one.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Transaction History */}
                {txHistory.length > 0 && (
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border-4 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] overflow-hidden">
                        <div className="bg-zinc-100 dark:bg-zinc-800 border-b-4 border-zinc-900 px-6 py-4">
                            <h2 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
                                <ExternalLink className="w-5 h-5 text-indigo-500" />
                                Recent Transactions
                            </h2>
                        </div>
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {txHistory.map((tx, i) => (
                                <div key={i} className="flex items-center justify-between px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Badge className={cn(
                                            "text-xs font-bold uppercase",
                                            tx.action === "ADD" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                                        )}>{tx.action}</Badge>
                                        <code className="text-xs font-mono text-zinc-500">{tx.address.slice(0, 10)}...{tx.address.slice(-6)}</code>
                                    </div>
                                    <a
                                        href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                                        target="_blank"
                                        className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                                    >
                                        Etherscan <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                </>
                )}
            </div>
        </div>
    );
}
