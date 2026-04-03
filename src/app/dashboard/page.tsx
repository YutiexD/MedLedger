"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Trash2, CalendarCheck } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
    const [bookings, setBookings] = useState([]);
    const [userId, setUserId] = useState("PLACEHOLDER_USER_ID"); // In a real app, this comes from session/context

    const fetchBookings = async () => {
        // Fetch slots where patientId = current user
        // (Simplified for this phase execution)
        const res = await fetch(`/api/slots/patient?id=${userId}`);
        const data = await res.json();
        setBookings(data.slots || []);
    };

    const handleCancel = async (slotId: string) => {
        try {
            // Web3 Transaction logic would be here
            toast.promise(fetch(`/api/slots/cancel`, {
                method: 'POST',
                body: JSON.stringify({ slotId })
            }), {
                loading: 'Cancelling appointment...',
                success: 'Appointment cancelled.',
                error: 'Failed to cancel.'
            });
            setBookings(bookings.filter((b: any) => b._id !== slotId));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center gap-3">
                    <CalendarCheck className="w-8 h-8 text-indigo-500" />
                    <h1 className="text-3xl font-bold">My Appointments</h1>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-3xl border-4 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] overflow-hidden">
                    <Table>
                        <TableHeader className="bg-zinc-50 dark:bg-zinc-800">
                            <TableRow className="border-b-4 border-zinc-900">
                                <TableHead className="font-bold">Doctor</TableHead>
                                <TableHead className="font-bold">Date & Time</TableHead>
                                <TableHead className="font-bold">On-Chain Proof</TableHead>
                                <TableHead className="text-right font-bold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.length > 0 ? (
                                bookings.map((booking: any) => (
                                    <TableRow key={booking._id} className="border-b-2 border-zinc-100 dark:border-zinc-800">
                                        <TableCell className="font-medium">Dr. {booking.doctorId.email.split("@")[0]}</TableCell>
                                        <TableCell>
                                            {new Date(booking.startTime).toLocaleDateString()} at{" "}
                                            {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </TableCell>
                                        <TableCell>
                                            <a 
                                                href={`https://sepolia.etherscan.io/tx/${booking.txHash}`} 
                                                target="_blank" 
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                                            >
                                                Verify <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="destructive" 
                                                size="sm" 
                                                className="font-bold border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] hover:shadow-none transition-all"
                                                onClick={() => handleCancel(booking._id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Cancel
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-zinc-500 font-medium italic">
                                        No upcoming appointments found.
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
