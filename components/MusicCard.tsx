"use client";

import { usePlayer } from "@/context/PlayerContext";

function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);

    return `${minutes}:${remaining
        .toString()
        .padStart(2, "0")}`;
}

function Vinyl({ isPlaying }: { isPlaying: boolean }) {
    return (
        <div className="relative mx-auto h-52 w-52 sm:h-60 sm:w-60">

            <div
                className={`
                    absolute inset-0 rounded-full
                    bg-[radial-gradient(circle,#111_0%,#050505_55%,#000_100%)]
                    shadow-[0_0_80px_rgba(255,255,255,0.08)]
                    ${isPlaying ? "animate-[spin_10s_linear_infinite]" : ""}
                `}
            />

            <div className="absolute inset-3 rounded-full border border-white/[0.05]" />
            <div className="absolute inset-7 rounded-full border border-white/[0.05]" />
            <div className="absolute inset-11 rounded-full border border-white/[0.05]" />
            <div className="absolute inset-15 rounded-full border border-white/[0.05]" />

            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_35px_rgba(255,255,255,0.2)]">

                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />

            </div>
        </div>
    );
}

export default function MusicCard() {
    const {
        isPlaying,
        currentTime,
        duration,
        volume,

        togglePlay,
        nextSong,
        prevSong,

        seek,
        setVolume,
    } = usePlayer();

    return (
        <section className="mx-auto mt-10 w-full max-w-4xl">

            <div
                className="
                    relative overflow-hidden
                    rounded-[36px]
                    border border-white/[0.10]
                    bg-black/55
                    p-6
                    shadow-[0_30px_100px_rgba(0,0,0,0.65)]
                    backdrop-blur-2xl
                    sm:p-10
                "
            >

                {/* subtle glow */}

                <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-white/[0.025] blur-3xl" />

                <div className="relative">

                    {/* Vinyl */}

                    <Vinyl isPlaying={isPlaying} />

                    {/* Text */}

                    <div className="mt-8 text-center">

                        <p className="text-[10px] uppercase tracking-[0.55em] text-white/30">
                            THE NIGHT IS YOURS
                        </p>

                        <h2
                            className="mt-3 text-3xl text-white/90 sm:text-4xl"
                            style={{
                                fontFamily:
                                    "'Noto Serif Devanagari', 'Nirmala UI', serif",
                            }}
                        >
                            बस सुनो।
                        </h2>

                    </div>

                    {/* Progress */}

                    <div className="mt-9">

                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            step="0.1"
                            value={Math.min(
                                currentTime,
                                duration || 0
                            )}
                            onChange={(e) =>
                                seek(
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                            className="w-full accent-white"
                        />

                        <div className="mt-2 flex justify-between text-[11px] text-white/30">
                            <span>
                                {formatTime(currentTime)}
                            </span>

                            <span>
                                {formatTime(duration)}
                            </span>
                        </div>

                    </div>

                    {/* Main controls */}

                    <div className="mt-8 flex items-center justify-center gap-7">

                        <button
                            type="button"
                            onClick={prevSong}
                            className="
                                flex h-12 w-12
                                items-center justify-center
                                rounded-full
                                border border-white/10
                                bg-white/[0.03]
                                text-white/60
                                transition
                                hover:bg-white/10
                                hover:text-white
                                active:scale-95
                            "
                            aria-label="Previous song"
                        >
                            ⏮
                        </button>

                        <button
                            type="button"
                            onClick={togglePlay}
                            className="
                                flex h-20 w-20
                                items-center justify-center
                                rounded-full
                                bg-white
                                text-black
                                text-2xl
                                shadow-[0_0_45px_rgba(255,255,255,0.15)]
                                transition
                                hover:scale-105
                                active:scale-95
                            "
                            aria-label={
                                isPlaying
                                    ? "Pause"
                                    : "Play"
                            }
                        >
                            {isPlaying ? "Ⅱ" : "▶"}
                        </button>

                        <button
                            type="button"
                            onClick={nextSong}
                            className="
                                flex h-12 w-12
                                items-center justify-center
                                rounded-full
                                border border-white/10
                                bg-white/[0.03]
                                text-white/60
                                transition
                                hover:bg-white/10
                                hover:text-white
                                active:scale-95
                            "
                            aria-label="Next song"
                        >
                            ⏭
                        </button>

                    </div>

                    {/* Volume */}

                    <div className="mx-auto mt-8 flex max-w-xs items-center gap-3">

                        <span className="text-xs text-white/30">
                            🔈
                        </span>

                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) =>
                                setVolume(
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                            className="w-full accent-white"
                            aria-label="Volume"
                        />

                        <span className="text-xs text-white/30">
                            🔊
                        </span>

                    </div>

                    <p className="mt-8 text-center text-[9px] uppercase tracking-[0.45em] text-white/15">
                        ALONE 3AM · LISTEN IN THE DARK
                    </p>

                </div>
            </div>
        </section>
    );
}