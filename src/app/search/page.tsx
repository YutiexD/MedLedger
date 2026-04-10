"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DoctorCard } from "@/components/ui/doctor-card";
import { Search, SlidersHorizontal, Stethoscope, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { ethers } from "ethers";
import { cn } from "@/lib/utils";


const SPECIALIZATIONS = [
  "Cardiology", "Neurology", "Pediatrics", "General Practice", "Dermatology", "Orthopedics"
];

export default function SearchPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`/api/doctors/search?specialization=${selectedSpecialization}`);
      
      const contentType = res.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("[SEARCH] Received non-JSON response:", text.substring(0, 500));
        setDoctors([]);
        return;
      }

      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };


  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialization]);

  const handleBook = async (slotId: string, doctorWallet: string) => {
    if (!user) {
      toast.error("Please login to book an appointment");
      return;
    }

    if (!user.isWalletConnected) {
      toast.error("Please connect your MetaMask wallet first.");
      return;
    }

    try {
      // 1. Trigger On-Chain Transaction
      toast.info("Please sign the transaction in MetaMask...");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        ["function bookSlot(uint256 slotId, address doctor) public"],
        signer
      );

      // We use a numeric representation of slotId string for the contract
      // In a real app you'd have a mapping. 
      // For this demo we'll use a hash or a subset of the mongoId
      const numericSlotId = parseInt(slotId.substring(0, 8), 16);
      
      const tx = await contract.bookSlot(numericSlotId, doctorWallet);
      toast.info("Booking on-chain... please wait.");
      const receipt = await tx.wait();
      
      const txHash = receipt.hash;

      // 2. Update MongoDB
      const res = await fetch("/api/slots/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId,
          patientId: user.id,
          txHash: txHash,
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success(
          <div className="flex flex-col gap-1">
            <span>Appointment booked successfully!</span>
            <a 
              href={`https://sepolia.etherscan.io/tx/${txHash}`} 
              target="_blank" 
              className="text-xs font-bold underline"
            >
              View on Etherscan
            </a>
          </div>
        );
        fetchDoctors(); // Refresh to show as booked
      } else {
        toast.error(data.error || "Database sync failed");
      }
    } catch (error: any) {
      toast.error(error.reason || error.message || "Booking failed");
    }
  };


  // Client-side name filter
  const filteredDoctors = doctors.filter((doctor: any) => {
    if (!searchQuery) return true;
    const name = (doctor.username || doctor.email?.split("@")[0] || "").toLowerCase();
    const spec = doctor.specialization?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return name.includes(query) || spec.includes(query);
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] flex flex-col pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 w-full">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8 h-fit bg-white dark:bg-zinc-900 p-6 rounded-3xl border-4 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)]">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-5 h-5" />
            <h2 className="text-xl font-bold">Filters</h2>
          </div>

          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Specialization</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all"
                  checked={selectedSpecialization === "all"}
                  onCheckedChange={() => setSelectedSpecialization("all")}
                  className="border-2 border-zinc-900"
                />
                <Label htmlFor="all" className="text-sm font-medium leading-none cursor-pointer">All Categories</Label>
              </div>
              {SPECIALIZATIONS.map((spec) => (
                <div key={spec} className="flex items-center space-x-2">
                  <Checkbox
                    id={spec}
                    checked={selectedSpecialization === spec}
                    onCheckedChange={() => setSelectedSpecialization(spec)}
                    className="border-2 border-zinc-900"
                  />
                  <Label htmlFor={spec} className="text-sm font-medium leading-none cursor-pointer">{spec}</Label>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          <div className="relative group max-w-2xl">
            <Input
              placeholder="Search by specialty or doctor name..."
              className="h-14 pl-12 bg-white dark:bg-zinc-900 border-4 border-zinc-900 rounded-2xl focus-visible:ring-0 focus-visible:border-indigo-500 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>

          <div className="grid gap-2">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor: any) => (
                <DoctorCard key={doctor._id} doctor={doctor} onBook={handleBook} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-4">
                <Stethoscope className="w-16 h-16 opacity-20" />
                <p className="font-bold text-xl uppercase tracking-widest">No doctors found</p>
                <p className="text-sm">Try adjusting your filters to find availability.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
