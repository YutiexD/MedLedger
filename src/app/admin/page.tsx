"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserMinus, UserPlus, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ethers } from "ethers";


export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUsers = async () => {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data.users || []);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: string, walletAddress: string, newRole: string) => {
        setIsLoading(true);
        try {
            // Web3 Transaction logic
            if (walletAddress) {
                toast.info(`Signing on-chain role update for ${walletAddress}...`);
                // ABI fragments for grantRole/revokeRole
                const ABI = [
                    "function grantRole(bytes32 role, address account) public",
                    "function revokeRole(bytes32 role, address account) public",
                    "function DOCTOR_ROLE() public view returns (bytes32)"
                ];
                
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, ABI, signer);
                
                const doctorRole = await contract.DOCTOR_ROLE();
                let tx;
                if (newRole === "DOCTOR") {
                    tx = await contract.grantRole(doctorRole, walletAddress);
                } else {
                    tx = await contract.revokeRole(doctorRole, walletAddress);
                }
                
                await tx.wait();
            }

            // DB Update
            await fetch("/api/admin/role", {
                method: 'POST',
                body: JSON.stringify({ userId, role: newRole })
            });

            toast.success(`User role updated to ${newRole}`);
            fetchUsers();
        } catch (error: any) {
            toast.error(`Operation failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-indigo-500" />
                        <h1 className="text-3xl font-bold uppercase tracking-tight">Admin Console</h1>
                    </div>
                    <Badge variant="outline" className="h-8 border-2 border-zinc-900 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold uppercase tracking-widest">
                        Master Administrator
                    </Badge>
                </div>

                <div className="relative group max-w-md">
                    <Input placeholder="Search user by email or wallet..." className="h-12 pl-12 bg-white dark:bg-zinc-900 border-4 border-zinc-900 rounded-2xl focus-visible:ring-0 focus-visible:border-indigo-500 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] transition-all" />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-3xl border-4 border-zinc-900 shadow-[10px_10px_0px_0px_rgba(24,24,27,1)] overflow-hidden">
                    <Table>
                        <TableHeader className="bg-zinc-100 dark:bg-zinc-800 border-b-4 border-zinc-900">
                            <TableRow>
                                <TableHead className="font-bold py-5 px-6 uppercase tracking-widest text-xs">Identity</TableHead>
                                <TableHead className="font-bold py-5 px-6 uppercase tracking-widest text-xs">Stored Wallet</TableHead>
                                <TableHead className="font-bold py-5 px-6 uppercase tracking-widest text-xs">Current Role</TableHead>
                                <TableHead className="text-right font-bold py-5 px-6 uppercase tracking-widest text-xs">Management</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length > 0 ? (
                                users.map((user: any) => (
                                    <TableRow key={user._id} className="border-b-2 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 transition-colors">
                                        <TableCell className="px-6 py-4">
                                            <div className="font-bold text-zinc-900 dark:text-white uppercase tracking-tight">{user.email.split("@")[0]}</div>
                                            <div className="text-xs text-zinc-500 font-medium">{user.email}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {user.walletAddress ? (
                                                <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs font-mono text-zinc-600 dark:text-zinc-400">
                                                    {user.walletAddress.slice(0, 10)}...{user.walletAddress.slice(-6)}
                                                </code>
                                            ) : (
                                                <span className="text-xs italic text-zinc-400">No Wallet Linked</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Badge className={cn(
                                                "font-bold text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 border-2 border-zinc-900 bg-white",
                                                user.role === "DOCTOR" ? "text-indigo-600 border-indigo-600" : "text-emerald-600 border-emerald-600"
                                            )}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            {user.role === "PATIENT" ? (
                                                <Button 
                                                    onClick={() => handleRoleChange(user._id, user.walletAddress, "DOCTOR")}
                                                    disabled={isLoading || !user.walletAddress}
                                                    size="sm" 
                                                    className="font-bold bg-zinc-900 text-white rounded-xl h-10 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(79,70,229,1)] hover:shadow-none transition-all ml-auto"
                                                >
                                                    <UserPlus className="w-4 h-4 mr-2" />
                                                    Promote
                                                </Button>
                                            ) : (
                                                <Button 
                                                    onClick={() => handleRoleChange(user._id, user.walletAddress, "PATIENT")}
                                                    disabled={isLoading}
                                                    variant="outline"
                                                    size="sm" 
                                                    className="font-bold text-rose-600 border-2 border-rose-600 rounded-xl h-10 shadow-[2px_2px_0px_0px_rgba(225,29,72,1)] hover:shadow-none transition-all ml-auto"
                                                >
                                                    <UserMinus className="w-4 h-4 mr-2" />
                                                    Revoke
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-64 text-center items-center justify-center">
                                        <div className="flex flex-col items-center gap-2 opacity-20">
                                            <ShieldCheck className="w-16 h-16" />
                                            <p className="font-bold uppercase tracking-[0.2em] text-sm">No registry entries found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
