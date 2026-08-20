"use client";

import MusicCard from "@/components/MusicCard";

export default function PlayerPage() {
    return (
        <main className="relative h-[100dvh] w-full overflow-hidden bg-black text-white">

            {/* BACKGROUND VIDEO */}
            <video
                className="fixed inset-0 h-full w-full object-cover"
                src="/video/night-01.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
            />

            {/* VIDEO DARKNESS */}
            <div className="fixed inset-0 bg-black/70" />

            {/* CINEMATIC VIGNETTE */}
            <div
                className="
                    fixed inset-0
                    bg-[radial-gradient(
                        circle_at_center,
                        rgba(20,20,25,0.15)_0%,
                        rgba(0,0,0,0.55)_55%,
                        rgba(0,0,0,0.95)_100%
                    )]
                "
            />

            {/* CONTENT */}
            <div className="relative z-10 flex h-full w-full flex-col">

                {/* HEADER */}
                <div className="shrink-0 px-6 pt-7 text-center sm:pt-8">

                    <p
                        className="
                            text-[8px]
                            uppercase
                            tracking-[0.65em]
                            text-white/40
                        "
                    >
                        रात का संगीत
                    </p>

                    <h1
                        className="
                            mt-1
                            text-5xl
                            font-medium
                            leading-none
                            text-white
                            sm:text-6xl
                        "
                        style={{
                            fontFamily:
                                "'Noto Serif Devanagari', 'Nirmala UI', serif",
                        }}
                    >
                        बस सुनो।
                    </h1>

                    <p className="mt-2 text-xs text-white/35">
                        Close your eyes. Let the night play.
                    </p>

                </div>

                {/* PLAYER AREA */}
                <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-4 sm:px-8">

                    <MusicCard />

                </div>

            </div>
        </main>
    );
}