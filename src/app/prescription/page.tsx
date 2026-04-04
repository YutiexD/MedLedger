"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer, Calendar, User, ClipboardList, ShieldCheck } from "lucide-react";

export default function PrescriptionPrintPage({ params }: { params: { id: string } }) {
    const [prescription, setPrescription] = useState<any>(null);

    useEffect(() => {
        // In a real app, fetch prescription by id
        // Mocking for this phase execution
        setPrescription({
            id: params.id,
            doctor: { name: "Dr. Smith", specialization: "Cardiology" },
            patient: { name: "Jane Doe" },
            date: new Date().toLocaleDateString(),
            medicines: [
                { name: "Aspirin", dosage: "100mg", frequency: "Daily" },
                { name: "Lisinopril", dosage: "10mg", frequency: "Once at night" }
            ],
            notes: "Please maintain a low-sodium diet and monitor blood pressure regularly."
        });
    }, [params.id]);

    if (!prescription) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-white text-zinc-900 p-8 sm:p-16 max-w-4xl mx-auto">
            {/* Header / Brand */}
            <div className="flex justify-between items-start mb-12">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tighter uppercase text-indigo-600">MedLedger</h1>
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" /> Blockchain Verified Clinical Record
                    </p>
                </div>
                <Button 
                    onClick={() => window.print()} 
                    className="no-print bg-zinc-900 text-white font-bold px-6 h-12 rounded-xl border-4 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] hover:shadow-none transition-all flex items-center gap-2"
                >
                    <Printer className="w-5 h-5" /> Print / Save PDF
                </Button>
            </div>

            <Separator className="h-1 bg-zinc-900 mb-12" />

            <div className="grid grid-cols-2 gap-12 mb-12">
                <div className="space-y-4">
                    <div className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Attending Physician</div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center p-2">
                            <User className="text-zinc-600" />
                        </div>
                        <div>
                            <div className="text-xl font-bold">{prescription.doctor.name}</div>
                            <div className="text-sm font-medium text-indigo-600 uppercase tracking-wide">{prescription.doctor.specialization}</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Patient Name</div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center p-2">
                            <User className="text-zinc-600" />
                        </div>
                        <div>
                            <div className="text-xl font-bold">{prescription.patient.name}</div>
                            <div className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Date: {prescription.date}</div>
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="h-0.5 bg-zinc-200 mb-12" />

            <div className="space-y-8 mb-12">
                <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
                    <ClipboardList className="w-6 h-6 text-zinc-400" /> Prescribed Medications
                </h2>
                
                <div className="grid grid-cols-3 gap-6 font-bold text-xs uppercase tracking-widest text-zinc-400 border-b-2 border-zinc-100 pb-4">
                    <div>Medicine</div>
                    <div className="text-center">Dosage</div>
                    <div className="text-right">Frequency</div>
                </div>

                {prescription.medicines.map((med: any, index: number) => (
                    <div key={index} className="grid grid-cols-3 gap-6 py-4 border-b border-zinc-100">
                        <div className="font-bold text-lg">{med.name}</div>
                        <div className="text-center font-medium text-zinc-600 bg-zinc-50 rounded-lg py-1">{med.dosage}</div>
                        <div className="text-right font-medium text-zinc-600 bg-zinc-50 rounded-lg py-1 px-4">{med.frequency}</div>
                    </div>
                ))}
            </div>

            <div className="bg-zinc-50 p-8 rounded-3xl border-2 border-zinc-100 mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Clinical Observations & Advice</h3>
                <p className="text-zinc-700 leading-relaxed italic">{prescription.notes}</p>
            </div>

            <div className="mt-20 pt-10 border-t border-zinc-100 text-center space-y-4">
                <div className="text-xs font-bold text-zinc-300 uppercase tracking-[0.2em]">Digital Document ID: {prescription.id}</div>
                <div className="text-zinc-400 text-xs">Generated by MedLedger Decentralized Healthcare Platform</div>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    body { margin: 0; padding: 0; }
                }
            `}</style>
        </div>
    );
}
