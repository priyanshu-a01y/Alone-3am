"use client";

import MusicCard from "@/components/MusicCard";

export default function PlayerPage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-black text-white">

            {/* BACKGROUND VIDEO */}

            <video
                className="
                    fixed inset-0
                    -z-30
                    h-full w-full
                    object-cover
                "
                src="/video/video.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
            />

            {/* VIDEO DARKNESS */}

            <div className="fixed inset-0 -z-20 bg-black/70" />

            {/* CINEMATIC GRADIENT */}

            <div className="
                fixed inset-0 -z-20
                bg-gradient-to-b
                from-black/80
                via-black/55
                to-black
            " />

            {/* CONTENT */}

            <div className="
                relative z-10
                mx-auto
                flex min-h-screen
                w-full max-w-6xl
                flex-col
                items-center
                px-5
                pb-32
                pt-32
                sm:px-8
                sm:pt-36
            ">

                {/* HEADER */}

                <header className="text-center">

                    <p
                        className="
                            text-[10px]
                            uppercase
                            tracking-[0.55em]
                            text-white/35
                        "
                    >
                        रात का संगीत
                    </p>

                    <h1
                        className="
                            mt-2
                            text-5xl
                            font-medium
                            leading-none
                            text-white/95
                            sm:text-7xl
                        "
                        style={{
                            fontFamily:
                                "'Noto Serif Devanagari', 'Nirmala UI', serif",
                        }}
                    >
                        सुनो।
                    </h1>

                    <p className="mt-3 text-xs text-white/30 sm:text-sm">
                        Close your eyes. Let the night play.
                    </p>

                </header>

                {/* PLAYER */}

                <MusicCard />

            </div>
        </main>
    );
}