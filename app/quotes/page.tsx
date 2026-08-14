"use client";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { useState } from "react";

const quotes = [
    "Some nights are not meant to be fixed.",
    "3 AM has a way of making everything feel honest.",
    "You don't always miss the person. Sometimes you miss who you were with them.",
    "Some memories sound better in the dark.",
    "Maybe silence is the closure we never got.",
    "You survived today. That's enough.",
    "Not every goodbye needs an explanation.",
    "Some feelings are better left unwritten.",
    "There are things we only understand after midnight.",
    "Maybe tomorrow will feel lighter.",
];

export default function Quotes() {
    const [index, setIndex] = useState(0);

    const anotherThought = () => {
        setIndex((current) => (current + 1) % quotes.length);
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-black text-white">

            {/* BACKGROUND */}
            <div
                className="fixed inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/player-bg.jpg')",
                }}
            />

            {/* DARK OVERLAY */}
            <div className="fixed inset-0 bg-black/80" />

            {/* NIGHT GLOW */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(35,50,85,0.25),transparent_60%)]" />

            {/* NAVBAR */}
            <nav className="relative z-20 flex items-center justify-between px-7 py-5 md:px-12">

                <Link
                    href="/"
                    className="text-sm font-bold tracking-[0.35em]"
                >
                    ALONE 3AM
                </Link>

                <Link
                    href="/"
                    className="text-xs text-white/40 transition hover:text-white"
                >
                    ← Home
                </Link>

            </nav>

            {/* CONTENT */}
            <section className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 text-center">

                {/* LABEL */}
                <p className="text-[10px] tracking-[0.5em] text-white/30">
                    THINGS WE NEVER SAID
                </p>

                {/* TITLE */}
                <h1 className="mt-5 text-4xl font-semibold tracking-[0.15em] md:text-6xl">
                    MIDNIGHT THOUGHTS
                </h1>

                {/* QUOTE */}
                <div className="relative mt-12 w-full max-w-3xl rounded-[30px] border border-white/10 bg-black/45 px-8 py-12 shadow-2xl backdrop-blur-xl md:px-16">

                    <span className="absolute left-7 top-4 text-7xl font-serif text-white/10">
                        “
                    </span>

                    <p
                        key={index}
                        className="quote-enter text-2xl font-light leading-relaxed text-white/85 md:text-4xl"
                    >
                        {quotes[index]}
                    </p>

                    <div className="mt-8 flex items-center justify-center gap-3">

                        <span className="h-px w-10 bg-white/10" />

                        <span className="text-[9px] tracking-[0.35em] text-white/25">
                            ALONE 3AM
                        </span>

                        <span className="h-px w-10 bg-white/10" />

                    </div>

                </div>

                {/* BUTTON */}
                <button
                    onClick={anotherThought}
                    className="mt-9 rounded-full border border-white/15 bg-white/5 px-8 py-3 text-xs tracking-[0.15em] text-white/60 backdrop-blur-md transition duration-300 hover:scale-105 hover:border-white/30 hover:bg-white hover:text-black"
                >
                    ANOTHER THOUGHT
                </button>

                {/* COUNTER */}
                <p className="mt-5 text-[9px] tracking-[0.35em] text-white/20">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(quotes.length).padStart(2, "0")}
                </p>

            </section>

        </main>
    );
}