"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, Clock, Stethoscope, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";


export default function ManageSlotsPage() {
  const [date, setDate] = useState("");
  const [startClock, setStartClock] = useState("");
  const [endClock, setEndClock] = useState("");
  const [slots, setSlots] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "DOCTOR")) {
      toast.error("Only doctors can access this page");
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const fetchSlots = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/slots?doctorId=${user.id}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch (error) {
      console.error("Failed to fetch slots:", error);
    }
  };

  useEffect(() => {
    if (user) fetchSlots();
  }, [user]);

  const handleCreateSlots = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !date || !startClock || !endClock) return;

    const formattedStartTime = `${date}T${startClock}`;
    const formattedEndTime = `${date}T${endClock}`;

    setIsCreating(true);
    try {
      const res = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          userId: user.id,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`${data.count} slots created successfully!`);
        setDate("");
        setStartClock("");
        setEndClock("");
        fetchSlots();
      } else {
        toast.error(data.error || "Failed to create slots");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#030303]">
        <div className="animate-pulse text-zinc-400 font-bold uppercase tracking-widest">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] pt-24 pb-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-8 h-8 text-indigo-500" />
          <h1 className="text-3xl font-bold uppercase tracking-tight">Manage Time Slots</h1>
        </div>

        {/* Create Slots Form */}
        <Card className="border-4 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] rounded-3xl overflow-hidden bg-white dark:bg-zinc-900">
          <CardHeader className="bg-zinc-50 dark:bg-zinc-800 border-b-4 border-zinc-900">
            <CardTitle className="text-xl font-bold uppercase flex items-center gap-2">
              <CalendarPlus className="w-5 h-5 text-indigo-500" />
              Create Available Slots
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateSlots} className="space-y-4">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Select a date and your working hours. 15-minute slots will be generated automatically.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Date</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-14 font-medium border-2 border-zinc-900 rounded-xl focus-visible:ring-indigo-500 text-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Start Time</Label>
                  <Input
                    type="time"
                    value={startClock}
                    onChange={(e) => setStartClock(e.target.value)}
                    className="h-14 font-medium border-2 border-zinc-900 rounded-xl focus-visible:ring-indigo-500 text-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">End Time</Label>
                  <Input
                    type="time"
                    value={endClock}
                    onChange={(e) => setEndClock(e.target.value)}
                    className="h-14 font-medium border-2 border-zinc-900 rounded-xl focus-visible:ring-indigo-500 text-lg"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isCreating}
                className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] hover:shadow-none transition-all"
              >
                {isCreating ? "Creating..." : "Generate Time Slots"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Slots */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border-4 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] overflow-hidden">
          <div className="bg-zinc-50 dark:bg-zinc-800 border-b-4 border-zinc-900 px-6 py-4">
            <h2 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Your Available Slots ({slots.length})
            </h2>
          </div>
          <Table>
            <TableHeader className="bg-zinc-100 dark:bg-zinc-800 border-b-4 border-zinc-900">
              <TableRow>
                <TableHead className="font-bold py-5 px-6 uppercase tracking-widest text-xs">Date</TableHead>
                <TableHead className="font-bold py-5 px-6 uppercase tracking-widest text-xs">Time</TableHead>
                <TableHead className="font-bold py-5 px-6 uppercase tracking-widest text-xs">Status</TableHead>
                <TableHead className="font-bold py-5 px-6 uppercase tracking-widest text-xs">Patient</TableHead>
                <TableHead className="text-right font-bold py-5 px-6 uppercase tracking-widest text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slots.length > 0 ? (
                slots.map((slot: any) => (
                  <TableRow key={slot._id} className="border-b-2 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 transition-colors text-lg">
                    <TableCell className="px-6 py-6 font-bold">
                      {new Date(slot.startTime).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-6 py-6 font-medium">
                      {new Date(slot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {" — "}
                      {new Date(slot.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </TableCell>
                    <TableCell className="px-6 py-6">
                      <Badge className={cn(
                        "font-bold text-xs uppercase tracking-widest px-3 py-1 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]",
                        slot.status === "AVAILABLE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-600 shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]"
                          : "bg-indigo-50 text-indigo-700 border-indigo-600 shadow-[2px_2px_0px_0px_rgba(79,70,229,1)]"
                      )}>
                        {slot.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-6 font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-200">
                      {slot.status === "BOOKED" ? (
                        <div className="flex flex-col">
                            <span>{slot.patientId?.username || "Anonymous Patient"}</span>
                            <span className="text-[10px] text-zinc-400 font-mono tracking-tighter">
                                {slot.patientId?.email}
                            </span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-300 italic">Open for Booking</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-6 text-right">
                      {slot.status === "BOOKED" ? (
                        <div className="flex justify-end gap-2">
                            {slot.txHash && (
                                <a 
                                    href={`https://sepolia.etherscan.io/tx/${slot.txHash}`} 
                                    target="_blank"
                                    className="h-10 w-10 flex items-center justify-center border-2 border-zinc-900 rounded-xl bg-white hover:bg-zinc-50 transition-all shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]"
                                    title="View on Etherscan"
                                >
                                    <Clock className="w-4 h-4" />
                                </a>
                            )}
                            <Link href={`/doctor/slots/${slot._id}`}>
                              <Button size="lg" className="font-bold bg-zinc-900 text-white rounded-xl border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] hover:shadow-none transition-all">
                                Write Rx
                              </Button>
                            </Link>
                        </div>
                      ) : (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="font-bold border-2 border-rose-600 text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                            onClick={async () => {
                                if(confirm("Are you sure you want to delete this slot?")) {
                                    // Implementation of delete...
                                }
                            }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-zinc-500 font-medium italic">
                    No slots created yet. Use the form above to add availability.
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
