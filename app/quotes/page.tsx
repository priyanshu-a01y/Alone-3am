"use client";

import { useState } from "react";

const thoughts = [
    {
        hi: "कुछ रातें सिर्फ़ महसूस करने के लिए होती हैं।",
        en: "Some nights are meant to be felt, not understood.",
    },
    {
        hi: "ख़ामोशी भी कभी-कभी जवाब होती है।",
        en: "Silence can be an answer too.",
    },
    {
        hi: "हर अकेलापन उदासी नहीं होता।",
        en: "Not every solitude is sadness.",
    },
    {
        hi: "रात जितनी गहरी होती है, ख़याल उतने साफ़ होते हैं।",
        en: "The deeper the night, the clearer the thoughts.",
    },
    {
        hi: "कुछ बातें सिर्फ़ रात समझती है।",
        en: "Some things are understood only by the night.",
    },
];

export default function QuotesPage() {
    const [index, setIndex] = useState(0);

    const nextThought = () => {
        setIndex((current) => (current + 1) % thoughts.length);
    };

    const thought = thoughts[index];

    return (
        <main
            className="relative min-h-screen overflow-hidden bg-cover bg-center px-6 pb-40 pt-44 text-white"
            style={{
                backgroundImage: "url('/quotes-bg.jpg')",
            }}
        >
            {/* Background */}
            <div className="absolute inset-0 bg-black/70" />

            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/65 to-black" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex min-h-[75vh] max-w-6xl flex-col items-center justify-center text-center">

                <p
                    className="text-sm tracking-[0.5em] text-white/40"
                    style={{
                        fontFamily:
                            "'Noto Serif Devanagari', 'Nirmala UI', serif",
                    }}
                >
                    रात के ख़याल
                </p>

                <p className="mt-3 text-xs uppercase tracking-[0.35em] text-white/25">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(thoughts.length).padStart(2, "0")}
                </p>

                {/* Quote */}
                <div
                    key={index}
                    className="mt-14 max-w-5xl"
                >
                    <h1
                        className="text-5xl font-semibold leading-[1.35] text-white md:text-7xl"
                        style={{
                            fontFamily:
                                "'Noto Serif Devanagari', 'Nirmala UI', serif",
                        }}
                    >
                        “{thought.hi}”
                    </h1>

                    <p className="mx-auto mt-10 max-w-2xl text-lg font-light leading-8 text-white/45">
                        {thought.en}
                    </p>
                </div>

                {/* Divider */}
                <div className="mt-14 flex items-center gap-4">
                    <span className="h-px w-16 bg-white/15" />

                    <span className="text-white/30">✦</span>

                    <span className="h-px w-16 bg-white/15" />
                </div>

                {/* Next */}
                <button
                    onClick={nextThought}
                    className="mt-12 rounded-full border border-white/15 bg-white/5 px-8 py-3 text-xs tracking-[0.3em] text-white/70 backdrop-blur-xl transition duration-500 hover:bg-white hover:text-black"
                >
                    अगला ख़याल
                </button>

            </div>
        </main>
    );
}