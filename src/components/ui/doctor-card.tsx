import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Ensure badge is added later or uses a span
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Stethoscope } from "lucide-react";

interface DoctorCardProps {
    doctor: any;
    onBook?: (slotId: string) => void;
}

export function DoctorCard({ doctor, onBook }: DoctorCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow border-2 border-zinc-900 bg-white dark:bg-zinc-900/50 rounded-2xl overflow-hidden mb-6">
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center p-3">
                    <Stethoscope className="w-full h-full text-indigo-600" />
                </div>
                <div>
                    <CardTitle className="text-xl font-bold">{doctor.email.split("@")[0]}</CardTitle>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 mt-1 uppercase tracking-wider">
                        {doctor.specialization || "General Practice"}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {doctor.slots && doctor.slots.length > 0 ? (
                        doctor.slots.map((slot: any) => (
                            <Button 
                                key={slot._id} 
                                variant="outline" 
                                size="sm" 
                                className="text-xs h-10 border-2 border-zinc-900 hover:bg-indigo-500 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]"
                                onClick={() => onBook && onBook(slot._id)}
                            >
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Button>
                        ))
                    ) : (
                        <p className="text-xs text-zinc-500 col-span-full">No available slots.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
