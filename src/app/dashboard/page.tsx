"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Trash2, CalendarCheck, Search, Stethoscope, Clock, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ethers } from "ethers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [reviewModal, setReviewModal] = useState<{ open: boolean; doctorId: string; slotId: string }>({ open: false, doctorId: "", slotId: "" });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/slots/patient?id=${user.id}`);
      const data = await res.json();
      setBookings(data.slots || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancel = async (slotId: string, txHash: string) => {
    if (!user?.walletAddress) {
      toast.error("Wallet not connected");
      return;
    }
    try {
      toast.info("Please confirm cancellation in MetaMask...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        ["function cancelSlot(uint256 slotId) public"],
        signer
      );
      const numericSlotId = parseInt(slotId.substring(0, 8), 16);
      const tx = await contract.cancelSlot(numericSlotId);
      const receipt = await tx.wait();

      // Update DB
      await fetch(`/api/slots/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId, cancelTxHash: receipt.hash }),
      });

      toast.success(
        <div className="flex flex-col gap-1">
          <span>Appointment cancelled on-chain!</span>
          <a href={`https://sepolia.etherscan.io/tx/${receipt.hash}`} target="_blank" className="text-xs font-bold underline">
            View on Etherscan
          </a>
        </div>
      );
      fetchBookings();
    } catch (error: any) {
      toast.error(error.reason || error.message || "Cancellation failed");
    }
  };

  const submitReview = async () => {
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: reviewModal.doctorId,
          patientId: user!.id,
          rating,
          comment,
          patientName: user!.username || user!.email.split("@")[0],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Review submitted!");
        setReviewModal({ open: false, doctorId: "", slotId: "" });
        setComment("");
        setRating(5);
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#030303]">
        <div className="animate-pulse text-zinc-400 font-bold uppercase tracking-widest">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const isPast = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <CalendarCheck className="w-10 h-10 text-indigo-500" />
              <h1 className="text-4xl font-bold uppercase tracking-tight">Appointments</h1>
            </div>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
              Welcome back, <span className="font-bold text-zinc-900 dark:text-white underline decoration-indigo-500 decoration-4 underline-offset-4">{user.username || user.email.split("@")[0]}</span>
              <Badge className="ml-3 text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 bg-white border-2 border-zinc-900 text-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                {user.role}
              </Badge>
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/search">
              <Button size="lg" className="h-14 px-8 font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl border-4 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                <Search className="w-5 h-5 mr-3" />
                Find Doctors
              </Button>
            </Link>
          </div>
        </div>

        {/* Review modal overlay */}
        {reviewModal.open && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border-4 border-zinc-900 shadow-[12px_12px_0px_0px_rgba(24,24,27,1)] p-8 max-w-md w-full space-y-6">
              <h3 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" /> Write Review
              </h3>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setRating(s)}>
                      <Star className={`w-8 h-8 transition-colors ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Comment</Label>
                <textarea
                  className="w-full h-28 p-4 bg-white dark:bg-zinc-800 border-4 border-zinc-900 rounded-2xl focus:border-indigo-500 focus:outline-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={submitReview} className="flex-1 h-12 bg-zinc-900 text-white rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] hover:shadow-none transition-all">
                  Submit Review
                </Button>
                <Button variant="outline" onClick={() => setReviewModal({ open: false, doctorId: "", slotId: "" })} className="h-12 rounded-xl border-2 font-bold">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Bookings table */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border-4 border-zinc-900 shadow-[12px_12px_0px_0px_rgba(24,24,27,1)] overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-100 dark:bg-zinc-800 border-b-4 border-zinc-900">
              <TableRow>
                <TableHead className="font-bold py-6 px-8 uppercase tracking-widest text-xs">Medical Specialist</TableHead>
                <TableHead className="font-bold py-6 px-8 uppercase tracking-widest text-xs">Scheduled Time</TableHead>
                <TableHead className="font-bold py-6 px-8 uppercase tracking-widest text-xs">Blockchain Proof</TableHead>
                <TableHead className="text-right font-bold py-6 px-8 uppercase tracking-widest text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length > 0 ? (
                bookings.map((booking: any) => (
                  <TableRow key={booking._id} className="border-b-2 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 transition-colors text-xl">
                    <TableCell className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-zinc-900">
                            <Stethoscope className="w-7 h-7 text-indigo-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold">{booking.doctorId?.username || booking.doctorId?.email?.split("@")[0] || "Doctor"}</span>
                            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{booking.doctorId?.specialization || "Health Expert"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-bold">
                            <Clock className="w-5 h-5 text-indigo-500" />
                            {new Date(booking.startTime).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <span className="text-sm font-medium text-zinc-500 ml-7">
                            {new Date(booking.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-8">
                      {booking.txHash ? (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${booking.txHash}`}
                          target="_blank"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-600 border-2 border-indigo-200 shadow-[3px_3px_0px_0px_rgba(79,70,229,1)] hover:shadow-none transition-all"
                        >
                          Verify Transaction <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-sm text-zinc-400 font-medium italic">Off-chain record</span>
                      )}
                    </TableCell>
                    <TableCell className="px-8 py-8 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Review button — only for past appointments */}
                        {isPast(booking.startTime) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="font-bold border-2 border-amber-400 text-amber-600 rounded-xl hover:bg-amber-50 transition-all"
                            onClick={() => setReviewModal({ open: true, doctorId: booking.doctorId?._id, slotId: booking._id })}
                          >
                            <Star className="w-4 h-4 mr-1 fill-amber-400" />
                            Review
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="lg"
                          className="font-bold border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] hover:shadow-none transition-all h-12 rounded-xl"
                          onClick={() => handleCancel(booking._id, booking.txHash)}
                        >
                          <Trash2 className="w-5 h-5 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-zinc-500 font-medium italic">
                    No upcoming appointments found. Try{" "}
                    <Link href="/search" className="text-indigo-500 font-bold hover:underline">
                      searching for a doctor
                    </Link>{" "}
                    to book one!
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
