import Link from "next/link";
import Stars from "./Stars";
import Rain from "./Rain";
import MouseGlow from "./MouseGlow";

export default function Hero() {
    return (
        <main
            className="relative min-h-screen overflow-hidden bg-cover bg-center"
            style={{
                backgroundImage: "url('/quotes-bg.jpg')",
            }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/55" />

            {/* Soft gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/80" />

            <Stars />
            <Rain />
            <MouseGlow />

            {/* Hero */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">

                {/* Small Hindi label */}
                <p
                    className="mb-8 text-lg text-white/60"
                    style={{
                        fontFamily: "'Noto Serif Devanagari', 'Nirmala UI', serif",
                    }}
                >
                    एक रात • एक एहसास
                </p>

                {/* Main title */}
                <h1
                    className="text-[90px] font-semibold leading-none tracking-[0.08em] text-white drop-shadow-2xl md:text-[150px]"
                    style={{
                        fontFamily:
                            "'Noto Serif Devanagari', 'Nirmala UI', serif",
                    }}
                >
                    अकेले।
                </h1>

                {/* English subtitle */}
                <p
                    className="mt-8 max-w-xl text-lg font-light tracking-wide text-white/65 md:text-xl"
                    style={{
                        fontFamily: "Georgia, 'Times New Roman', serif",
                    }}
                >
                    Some nights don&apos;t need words.
                    <br />
                    They just need music.
                </p>

                {/* Enter button */}
                <Link
                    href="/player"
                    className="mt-12 rounded-full border border-white/25 bg-white/10 px-10 py-4 text-sm tracking-[0.35em] text-white backdrop-blur-md transition duration-500 hover:bg-white hover:text-black"
                >
                    सुनना शुरू करो
                </Link>

                {/* Small line */}
                <div className="mt-12 flex items-center gap-3 text-xs tracking-[0.35em] text-white/35">
                    <span className="h-px w-10 bg-white/20" />
                    ALONE
                    <span className="h-px w-10 bg-white/20" />
                </div>

            </div>
        </main>
    );
}
