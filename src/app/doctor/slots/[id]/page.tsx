"use client";

import { useState, use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Save, Clipboard } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export default function DoctorClinicalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", frequency: "" }]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [slotInfo, setSlotInfo] = useState<any>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const { user } = useAuth();

  // Fetch slot info to get patient data
  useEffect(() => {
    const fetchSlot = async () => {
      try {
        const res = await fetch(`/api/slots/info?slotId=${id}`);
        const data = await res.json();
        setSlotInfo(data.slot);
      } catch (error) {
        console.error("Failed to fetch slot info");
      }
    };
    fetchSlot();
  }, [id]);

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
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: id,
          patientId: slotInfo?.patientId?._id || slotInfo?.patientId || "",
          doctorId: user?.id,
          medicines,
          clinicalNotes: notes,
        }),
      });

      if (res.ok) {
        toast.success("Prescription issued successfully.");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save prescription.");
      }
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

        {/* Patient Info */}
        {slotInfo && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border-4 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] flex items-center gap-6">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-zinc-900">
              <span className="text-2xl font-bold text-indigo-600">{(slotInfo.patientId?.username || "P")[0].toUpperCase()}</span>
            </div>
            <div>
              <p className="font-bold text-lg">{slotInfo.patientId?.username || "Patient"}</p>
              <p className="text-sm text-zinc-500">{slotInfo.patientId?.email || ""}</p>
              <p className="text-xs text-zinc-400 mt-1">
                Slot: {new Date(slotInfo.startTime).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* File Attachment */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border-4 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)]">
          <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3 block">Attach Report / Document (in-browser view)</Label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-2 file:border-zinc-900 file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {attachedFile && (
            <div className="mt-4 border-2 border-zinc-200 rounded-xl overflow-hidden">
              {attachedFile.type === "application/pdf" ? (
                <iframe src={URL.createObjectURL(attachedFile)} className="w-full h-96" />
              ) : (
                <img src={URL.createObjectURL(attachedFile)} alt="Attached" className="w-full max-h-96 object-contain" />
              )}
            </div>
          )}
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
                Issue Final Record
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
