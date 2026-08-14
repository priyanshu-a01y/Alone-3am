"use client";
import { useEffect, useState } from "react";
const quotes = [
    "Some nights heal more than mornings.",
    "The moon understands what people don't.",
    "Silence speaks the loudest after 3 AM.",
    "Not every lonely night is a bad one.",
    "You don't choose the night. The night chooses you.",
];

export default function QuotesPage() {
    const [quote, setQuote] = useState("");

    useEffect(() => {
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);
    return (
        <main
            className="relative flex min-h-screen items-center justify-center bg-cover bg-center text-white"
            style={{ backgroundImage: "url('/quotes-bg.jpg')" }}
        >
            <div className="absolute inset-0 bg-black/70" />

            <div className="relative z-10 max-w-3xl px-8 text-center">
                <p className="mb-6 text-sm tracking-[0.4em] text-white/40">
                    MIDNIGHT THOUGHTS
                </p>

                <h1 className="text-4xl leading-relaxed italic md:text-5xl">
                    “{quote}”
                </h1>
            </div>
        </main>
    );
}