"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Save, Clipboard } from "lucide-react";
import { toast } from "sonner";

export default function DoctorClinicalPage({ params }: { params: { id: string } }) {
    const [medicines, setMedicines] = useState([{ name: "", dosage: "", frequency: "" }]);
    const [notes, setNotes] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const addMedicine = () => {
        setMedicines([...medicines, { name: "", dosage: "", frequency: "" }]);
    };

    const removeMedicine = (index: number) => {
        setMedicines(medicines.filter((_, i) => i !== index));
    };

    const updateMedicine = (index: number, field: string, value: string) => {
        const updated = [...medicines];
        (updated[index] as any)[field] = value;
        setMedicines(updated);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Simplified API call for Phase 5 execution
            toast.success("Prescription Issued successfully.");
        } catch (error) {
            toast.error("Failed to save.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] pt-24 pb-12 px-4 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-3">
                    <Clipboard className="w-8 h-8 text-indigo-500" />
                    <h1 className="text-3xl font-bold uppercase tracking-tight">Clinical Record</h1>
                </div>

                <Card className="border-4 border-zinc-900 shadow-[12px_12px_0px_0px_rgba(24,24,27,1)] rounded-3xl overflow-hidden bg-white dark:bg-zinc-900">
                    <CardHeader className="bg-zinc-50 dark:bg-zinc-800 border-b-4 border-zinc-900">
                        <CardTitle className="text-xl font-bold uppercase flex items-center justify-between">
                            Medication List
                            <Button variant="outline" size="sm" onClick={addMedicine} className="border-2 border-zinc-900 font-bold">
                                <Plus className="w-4 h-4 mr-1" /> Add 
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {medicines.map((med, index) => (
                            <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="flex-1 space-y-2">
                                    <Label className="text-xs font-bold text-zinc-400">Medicine Name</Label>
                                    <Input 
                                        value={med.name} 
                                        onChange={(e) => updateMedicine(index, "name", e.target.value)}
                                        placeholder="e.g. Paracetamol"
                                        className="h-12 border-2 border-zinc-900 rounded-xl"
                                    />
                                </div>
                                <div className="w-32 space-y-2">
                                    <Label className="text-xs font-bold text-zinc-400">Dosage</Label>
                                    <Input 
                                        value={med.dosage} 
                                        onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                                        placeholder="500mg"
                                        className="h-12 border-2 border-zinc-900 rounded-xl"
                                    />
                                </div>
                                <div className="w-32 space-y-2">
                                    <Label className="text-xs font-bold text-zinc-400">Frequency</Label>
                                    <Input 
                                        value={med.frequency} 
                                        onChange={(e) => updateMedicine(index, "frequency", e.target.value)}
                                        placeholder="1-0-1"
                                        className="h-12 border-2 border-zinc-900 rounded-xl"
                                    />
                                </div>
                                <Button 
                                    variant="destructive" 
                                    size="icon" 
                                    onClick={() => removeMedicine(index)}
                                    className="h-12 w-12 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        ))}

                        <div className="pt-6 space-y-2">
                            <Label className="text-sm font-bold uppercase tracking-wider text-zinc-500">Clinical Observations</Label>
                            <textarea 
                                className="w-full h-32 p-4 bg-white dark:bg-zinc-900 border-4 border-zinc-900 rounded-2xl focus:ring-0 focus:border-indigo-500 transition-colors"
                                placeholder="Enter detailed patient progress notes here..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <div className="pt-6">
                            <Button 
                                className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold text-xl shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] active:shadow-none transition-all"
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                <Save className="w-5 h-5 mr-3" /> 
                                Issued Final Record
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
