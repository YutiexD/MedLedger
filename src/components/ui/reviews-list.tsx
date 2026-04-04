"use client";

import { useState, useEffect } from "react";
import { Star, User, Quote } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ReviewProps {
    doctorId: string;
}

export function ReviewsList({ doctorId }: ReviewProps) {
    const [reviews, setReviews] = useState([]);

    const fetchReviews = async () => {
        // Fetch reviews for specific doctor
        const res = await fetch(`/api/reviews?doctorId=${doctorId}`);
        const data = await res.json();
        setReviews(data.reviews || []);
    };

    useEffect(() => {
        fetchReviews();
    }, [doctorId]);

    if (reviews.length === 0) return (
        <div className="flex flex-col items-center justify-center h-48 text-zinc-400 gap-3 opacity-30">
            <Quote className="w-10 h-10" />
            <p className="font-bold text-sm uppercase tracking-widest leading-none">No patient reviews yet</p>
        </div>
    );

    return (
        <div className="space-y-6 mt-8">
            <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> Patient Feedback
            </h3>
            
            <div className="grid gap-4">
                {reviews.map((review: any) => (
                    <div key={review._id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border-4 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center p-1.5">
                                    <User className="text-indigo-600 w-full h-full" />
                                </div>
                                <div className="font-bold text-sm uppercase tracking-wider">{review.patientName || "Verified Patient"}</div>
                            </div>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} 
                                    />
                                ))}
                            </div>
                        </div>
                        <Separator className="bg-zinc-100 dark:bg-zinc-800" />
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed italic">{`"${review.comment}"`}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
