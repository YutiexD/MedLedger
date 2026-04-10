"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Stethoscope, ExternalLink, Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewsList } from "@/components/ui/reviews-list";

interface DoctorCardProps {
    doctor: any;
    onBook?: (slotId: string, doctorWallet: string) => void;
}

export function DoctorCard({ doctor, onBook }: DoctorCardProps) {
    const [showReviews, setShowReviews] = useState(false);

    return (
        <Card className="hover:shadow-lg transition-shadow border-2 border-zinc-900 bg-white dark:bg-zinc-900/50 rounded-2xl overflow-hidden mb-6">
            <CardHeader className="flex flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center p-3">
                        <Stethoscope className="w-full h-full text-indigo-600" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold">{doctor.username || doctor.email?.split("@")[0]}</CardTitle>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 mt-1 uppercase tracking-wider">
                            {doctor.specialization || "General Practice"}
                        </div>
                        {doctor.walletAddress && (
                            <div className="text-[10px] font-mono text-zinc-400 mt-1">
                                {doctor.walletAddress.slice(0, 6)}...{doctor.walletAddress.slice(-4)}
                            </div>
                        )}
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-bold text-zinc-400 hover:text-amber-500"
                    onClick={() => setShowReviews(!showReviews)}
                >
                    <Star className="w-4 h-4 mr-1" />
                    {showReviews ? "Hide" : "Reviews"}
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {doctor.slots && doctor.slots.length > 0 ? (
                        doctor.slots.map((slot: any) => (
                            <Button 
                                key={slot._id} 
                                variant={slot.status === "BOOKED" ? "secondary" : "outline"}
                                size="sm" 
                                disabled={slot.status === "BOOKED"}
                                className={cn(
                                    "text-xs h-auto min-h-[3rem] border-2 border-zinc-900 transition-all shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] flex flex-col items-center justify-center gap-0.5 py-2",
                                    slot.status === "BOOKED" ? "bg-zinc-100 text-zinc-400 opacity-100 border-zinc-300 shadow-none cursor-default" : "hover:bg-indigo-500 hover:text-white"
                                )}
                                onClick={() => slot.status !== "BOOKED" && onBook && onBook(slot._id, doctor.walletAddress)}
                            >
                                <div className="flex items-center gap-1 font-bold">
                                    {slot.status === "BOOKED" ? <Lock className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                    {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="text-[9px] font-medium">
                                    {new Date(slot.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </div>
                                {slot.status === "BOOKED" && (
                                    <>
                                        <span className="text-[9px] uppercase tracking-tighter font-extrabold text-indigo-500/70">
                                            Booked by {slot.patientId?.username || "Patient"}
                                        </span>
                                        {slot.txHash && (
                                            <a 
                                                href={`https://sepolia.etherscan.io/tx/${slot.txHash}`} 
                                                target="_blank"
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-[8px] font-bold text-indigo-600 underline flex items-center gap-0.5 hover:text-indigo-800"
                                            >
                                                Etherscan <ExternalLink className="w-2.5 h-2.5" />
                                            </a>
                                        )}
                                    </>
                                )}
                            </Button>
                        ))
                    ) : (
                        <p className="text-sm text-zinc-500 col-span-full font-medium italic py-4">No slots available for this doctor.</p>
                    )}
                </div>

                {/* Reviews Section */}
                {showReviews && (
                    <ReviewsList doctorId={doctor._id} />
                )}
            </CardContent>
        </Card>
    );
}
