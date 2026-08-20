"use client";

import { usePathname } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";

function WaveBars() {
    const heights = [4, 8, 14, 22, 14, 8, 4];

    return (
        <div className="flex h-8 items-center gap-[3px]">
            {heights.map((height, index) => (
                <span
                    key={index}
                    className="heartbeat-bar w-[3px] rounded-full bg-white/55"
                    style={{
                        height: `${height}px`,
                        "--delay": `${index * 0.08}s`,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
}

export default function MiniPlayer() {

    const pathname = usePathname();

    /*
     * Full player already exists on /player.
     * Therefore don't show the floating mini player there.
     */
    if (pathname === "/player") {
        return null;
    }

    const {
        isPlaying,
        togglePlay,
        nextSong,
        prevSong,
    } = usePlayer();

    return (
        <div
            className="
                pointer-events-none
                fixed
                bottom-4
                left-1/2
                z-[100]
                -translate-x-1/2
                sm:bottom-6
            "
            data-playing={isPlaying}
        >
            <div
                className="
                    pointer-events-auto
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border
                    border-white/10
                    bg-black/80
                    px-3
                    py-2
                    backdrop-blur-xl
                    shadow-[0_10px_40px_rgba(0,0,0,0.55)]
                    sm:gap-3
                    sm:px-5
                    sm:py-3
                "
            >

                <div className="hidden sm:block">
                    <WaveBars />
                </div>

                <button
                    type="button"
                    onClick={prevSong}
                    aria-label="Previous song"
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        text-white/45
                        transition
                        hover:bg-white/10
                        hover:text-white
                    "
                >
                    ⏮
                </button>

                <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-black
                        shadow-[0_0_35px_rgba(255,255,255,0.15)]
                        transition
                        hover:scale-105
                        active:scale-95
                    "
                >
                    {isPlaying ? "Ⅱ" : "▶"}
                </button>

                <button
                    type="button"
                    onClick={nextSong}
                    aria-label="Next song"
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        text-white/45
                        transition
                        hover:bg-white/10
                        hover:text-white
                    "
                >
                    ⏭
                </button>

                <div className="hidden sm:block">
                    <WaveBars />
                </div>

            </div>
        </div>
    );
}