"use client";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Journal() {
    const [entry, setEntry] = useState("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedEntry = localStorage.getItem("alone3am-letter");

        if (savedEntry) {
            setEntry(savedEntry);
        }
    }, []);

    const saveLetter = () => {
        if (!entry.trim()) return;

        localStorage.setItem("alone3am-letter", entry);
        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2000);
    };

    const clearLetter = () => {
        localStorage.removeItem("alone3am-letter");
        setEntry("");
        setSaved(false);
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
            <div className="fixed inset-0 bg-black/85" />

            {/* NIGHT GLOW */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(40,55,90,0.25),transparent_60%)]" />

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
            <section className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] w-[90%] max-w-3xl flex-col justify-center py-12">

                {/* HEADER */}

                <div className="text-center">

                    <p className="text-[10px] tracking-[0.5em] text-white/30">
                        PRIVATE SPACE
                    </p>

                    <h1 className="mt-5 text-4xl font-semibold tracking-[0.15em] md:text-6xl">
                        LETTERS I NEVER SENT
                    </h1>

                    <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/40">
                        Say the things you never got the chance to say.
                    </p>

                </div>


                {/* LETTER */}

                <div className="mt-10 rounded-[28px] border border-white/10 bg-black/50 p-6 shadow-2xl backdrop-blur-xl md:p-8">

                    {/* DATE */}

                    <div className="mb-6 flex items-center justify-between text-[9px] tracking-[0.3em] text-white/25">

                        <span>
                            03:00 AM
                        </span>

                        <span>
                            ONLY YOU
                        </span>

                    </div>


                    {/* TEXT AREA */}

                    <textarea
                        value={entry}
                        onChange={(e) => {
                            setEntry(e.target.value);
                            setSaved(false);
                        }}
                        placeholder="Dear someone..."
                        className="h-72 w-full resize-none bg-transparent text-base leading-8 text-white/80 outline-none placeholder:text-white/20 md:h-80 md:text-lg"
                    />


                    {/* BOTTOM */}

                    <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-5">

                        <span className="text-[10px] text-white/20">
                            {entry.length} characters
                        </span>

                        <div className="flex items-center gap-3">

                            {entry && (
                                <button
                                    onClick={clearLetter}
                                    className="rounded-full px-4 py-2 text-[10px] text-white/30 transition hover:text-white"
                                >
                                    CLEAR
                                </button>
                            )}

                            <button
                                onClick={saveLetter}
                                className="rounded-full border border-white/15 bg-white/10 px-6 py-2.5 text-[10px] tracking-[0.15em] text-white/70 transition hover:bg-white hover:text-black"
                            >
                                {saved ? "SAVED ✓" : "KEEP THIS LETTER"}
                            </button>

                        </div>

                    </div>

                </div>


                {/* FOOTER */}

                <p className="mt-7 text-center text-[9px] tracking-[0.3em] text-white/20">
                    NOTHING LEAVES THIS BROWSER
                </p>

            </section>

        </main>
    );
}