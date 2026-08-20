"use client";

import { usePlayer } from "@/context/PlayerContext";

function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);

    return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

function Vinyl({
    isPlaying,
}: {
    isPlaying: boolean;
}) {
    return (
        <div
            className="
                relative
                h-44
                w-44
                sm:h-52
                sm:w-52
            "
        >
            {/* VINYL */}
            <div
                className={`
                    absolute
                    inset-0
                    rounded-full
                    bg-[radial-gradient(
                        circle,
                        #f5f5f5_0%,
                        #f5f5f5_9%,
                        #111_10%,
                        #080808_38%,
                        #030303_70%,
                        #000_100%
                    )]
                    shadow-[0_0_70px_rgba(255,255,255,0.08)]
                    ${isPlaying ? "animate-[spin_12s_linear_infinite]" : ""}
                `}
            />

            {/* RECORD RINGS */}
            <div className="absolute inset-5 rounded-full border border-white/[0.06]" />
            <div className="absolute inset-9 rounded-full border border-white/[0.05]" />
            <div className="absolute inset-14 rounded-full border border-white/[0.05]" />
            <div className="absolute inset-[72px] rounded-full border border-white/[0.05]" />

            {/* CENTER */}
            <div
                className="
                    absolute
                    left-1/2
                    top-1/2
                    h-12
                    w-12
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-white
                    shadow-[0_0_35px_rgba(255,255,255,0.2)]
                "
            >
                <div
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        h-2
                        w-2
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-black
                    "
                />
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
        <section
            className="
                flex
                w-full
                max-w-4xl
                items-center
                justify-center
            "
        >
            <div
                className="
                    relative
                    w-full
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-white/[0.10]
                    bg-black/65
                    px-5
                    py-6
                    shadow-[0_30px_100px_rgba(0,0,0,0.65)]
                    backdrop-blur-2xl
                    sm:px-10
                    sm:py-8
                "
            >

                {/* AMBIENT LIGHT */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-0
                        h-64
                        w-64
                        -translate-x-1/2
                        rounded-full
                        bg-white/[0.025]
                        blur-[90px]
                    "
                />

                <div className="relative flex flex-col items-center">

                    {/* VINYL */}

                    <Vinyl isPlaying={isPlaying} />

                    {/* LABEL */}

                    <div className="mt-5 text-center">

                        <p
                            className="
                                text-[9px]
                                uppercase
                                tracking-[0.6em]
                                text-white/30
                            "
                        >
                            THE NIGHT IS YOURS
                        </p>

                        <h2
                            className="
                                mt-2
                                text-3xl
                                text-white/90
                            "
                            style={{
                                fontFamily:
                                    "'Noto Serif Devanagari', 'Nirmala UI', serif",
                            }}
                        >
                            बस सुनो।
                        </h2>

                    </div>

                    {/* PROGRESS */}

                    <div className="mt-6 w-full">

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
                                seek(Number(e.target.value))
                            }
                            className="
                                h-1
                                w-full
                                cursor-pointer
                                appearance-none
                                rounded-full
                                bg-white/15
                                accent-white
                            "
                        />

                        <div
                            className="
                                mt-2
                                flex
                                justify-between
                                text-[10px]
                                text-white/30
                            "
                        >
                            <span>
                                {formatTime(currentTime)}
                            </span>

                            <span>
                                {formatTime(duration)}
                            </span>
                        </div>

                    </div>

                    {/* CONTROLS */}

                    <div
                        className="
                            mt-5
                            flex
                            items-center
                            justify-center
                            gap-7
                        "
                    >

                        {/* PREVIOUS */}

                        <button
                            type="button"
                            onClick={prevSong}
                            aria-label="Previous"
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/10
                                bg-white/[0.03]
                                text-lg
                                text-white/60
                                transition
                                hover:scale-105
                                hover:bg-white/10
                                hover:text-white
                                active:scale-95
                            "
                        >
                            ⏮
                        </button>

                        {/* PLAY */}

                        <button
                            type="button"
                            onClick={togglePlay}
                            aria-label={
                                isPlaying
                                    ? "Pause"
                                    : "Play"
                            }
                            className="
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-xl
                                text-black
                                shadow-[0_0_50px_rgba(255,255,255,0.16)]
                                transition
                                hover:scale-105
                                active:scale-95
                            "
                        >
                            {isPlaying ? "Ⅱ" : "▶"}
                        </button>

                        {/* NEXT */}

                        <button
                            type="button"
                            onClick={nextSong}
                            aria-label="Next"
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/10
                                bg-white/[0.03]
                                text-lg
                                text-white/60
                                transition
                                hover:scale-105
                                hover:bg-white/10
                                hover:text-white
                                active:scale-95
                            "
                        >
                            ⏭
                        </button>

                    </div>

                    {/* VOLUME */}

                    <div
                        className="
                            mt-5
                            flex
                            w-full
                            max-w-[260px]
                            items-center
                            gap-3
                        "
                    >

                        <span className="text-[11px] opacity-40">
                            🔈
                        </span>

                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) =>
                                setVolume(Number(e.target.value))
                            }
                            className="
                                h-1
                                w-full
                                cursor-pointer
                                appearance-none
                                rounded-full
                                bg-white/15
                                accent-white
                            "
                            aria-label="Volume"
                        />

                        <span className="text-[11px] opacity-40">
                            🔊
                        </span>

                    </div>

                    {/* FOOTER */}

                    <p
                        className="
                            mt-5
                            text-[8px]
                            uppercase
                            tracking-[0.5em]
                            text-white/15
                        "
                    >
                        ALONE 3AM · LISTEN IN THE DARK
                    </p>

                </div>
            </div>
        </section>
    );
}