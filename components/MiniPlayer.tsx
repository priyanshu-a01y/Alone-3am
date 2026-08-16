"use client";

import { usePlayer } from "@/context/PlayerContext";

function WaveBars({ reverse = false }: { reverse?: boolean }) {
    const heights = reverse
        ? [4, 8, 14, 22, 14, 8, 4]
        : [4, 8, 14, 22, 14, 8, 4];

    return (
        <div className="flex h-8 items-center gap-[3px]">
            {heights.map((height, index) => (
                <span
                    key={index}
                    className="heartbeat-bar w-[3px] rounded-full bg-white/55"
                    style={
                        {
                            height: `${height}px`,
                            "--delay": `${index * 0.08}s`,
                        } as React.CSSProperties
                    }
                />
            ))}
        </div>
    );
}

export default function MiniPlayer() {
    const {
        isPlaying,
        togglePlay,
        nextSong,
        prevSong,
    } = usePlayer();

    return (
        <div
            className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2"
            data-playing={isPlaying}
        >
            {/* Compact Music Bar */}
            <div
                className="
                    flex items-center justify-center
                    gap-3
                    rounded-full
                    border border-white/10
                    bg-black/80
                    px-5 py-3
                    backdrop-blur-xl
                    shadow-[0_10px_40px_rgba(0,0,0,0.55)]
                "
            >

                {/* Left heartbeat */}
                <WaveBars />

                {/* Previous */}
                <button
                    onClick={prevSong}
                    aria-label="Previous song"
                    className="
                        flex h-9 w-9
                        items-center justify-center
                        rounded-full
                        text-white/45
                        transition-all duration-200
                        hover:bg-white/10
                        hover:text-white
                        hover:scale-110
                    "
                >
                    ⏮
                </button>

                {/* Main Play / Pause */}
                <button
                    onClick={togglePlay}
                    className={`
        play-heartbeat
        ${isPlaying ? "is-playing" : ""}
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-white
        text-black
        transition-all
        duration-500
        hover:scale-105
        active:scale-95
    `}
                >
                    <span className="play-icon">
                        {isPlaying ? "Ⅱ" : "▶"}
                    </span>
                </button>

                {/* Next */}
                <button
                    onClick={() => nextSong()}
                    aria-label="Next song"
                    className="
                        flex h-9 w-9
                        items-center justify-center
                        rounded-full
                        text-white/45
                        transition-all duration-200
                        hover:bg-white/10
                        hover:text-white
                        hover:scale-110
                    "
                >
                    ⏭
                </button>

                {/* Right heartbeat */}
                <WaveBars reverse />

            </div>
        </div>
    );
}
