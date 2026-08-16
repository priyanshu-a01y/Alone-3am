"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/context/PlayerContext";

export default function MusicCard() {
    const {
        isPlaying,
        togglePlay,
        nextSong,
        prevSong,
        volume,
        setVolume,
    } = usePlayer();

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    /* --------------------------------
       FIND GLOBAL AUDIO
    -------------------------------- */

    useEffect(() => {
        const audio = document.querySelector(
            "audio[data-alone-player]"
        ) as HTMLAudioElement | null;

        if (!audio) return;

        audioRef.current = audio;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const updateDuration = () => {
            if (
                Number.isFinite(audio.duration) &&
                audio.duration > 0
            ) {
                setDuration(audio.duration);
            }
        };

        const resetProgress = () => {
            setCurrentTime(0);
            setDuration(0);
        };

        audio.addEventListener(
            "timeupdate",
            updateTime
        );

        audio.addEventListener(
            "loadedmetadata",
            updateDuration
        );

        audio.addEventListener(
            "durationchange",
            updateDuration
        );

        audio.addEventListener(
            "emptied",
            resetProgress
        );

        updateDuration();

        return () => {
            audio.removeEventListener(
                "timeupdate",
                updateTime
            );

            audio.removeEventListener(
                "loadedmetadata",
                updateDuration
            );

            audio.removeEventListener(
                "durationchange",
                updateDuration
            );

            audio.removeEventListener(
                "emptied",
                resetProgress
            );
        };
    }, []);

    /* --------------------------------
       SEEK
    -------------------------------- */

    const seek = (value: number) => {
        const audio = audioRef.current;

        if (!audio) return;

        if (
            !Number.isFinite(audio.duration) ||
            audio.duration <= 0
        ) {
            return;
        }

        audio.currentTime = value;
        setCurrentTime(value);
    };

    /* --------------------------------
       FORMAT TIME
    -------------------------------- */

    const formatTime = (time: number) => {
        if (
            !Number.isFinite(time) ||
            time <= 0
        ) {
            return "0:00";
        }

        const minutes = Math.floor(time / 60);

        const seconds = Math.floor(
            time % 60
        );

        return `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <section className="mt-14">
            <div
                className="
                    mx-auto
                    max-w-5xl
                    rounded-[36px]
                    border
                    border-white/10
                    bg-white/[0.045]
                    p-8
                    backdrop-blur-2xl
                    md:p-12
                "
            >
                {/* =================================
                    VINYL
                ================================= */}

                <div className="flex justify-center">
                    <div
                        className={`
                            relative
                            h-64
                            w-64
                            rounded-full
                            bg-[repeating-radial-gradient(circle,#111_0,#111_2px,#1c1c1c_3px,#111_5px)]
                            shadow-[0_0_80px_rgba(255,255,255,0.07)]
                            transition-all
                            duration-1000
                            ${isPlaying
                                ? "animate-spin"
                                : ""
                            }
                        `}
                        style={{
                            animationDuration:
                                "12s",
                        }}
                    >
                        {/* Vinyl rings */}
                        <div className="absolute inset-8 rounded-full border border-white/[0.06]" />

                        <div className="absolute inset-12 rounded-full border border-white/[0.06]" />

                        <div className="absolute inset-16 rounded-full border border-white/[0.07]" />

                        <div className="absolute inset-20 rounded-full border border-white/10" />

                        {/* Center */}
                        <div
                            className="
                                absolute
                                left-1/2
                                top-1/2
                                h-8
                                w-8
                                -translate-x-1/2
                                -translate-y-1/2
                                rounded-full
                                bg-white
                                shadow-[0_0_25px_rgba(255,255,255,0.18)]
                            "
                        />
                    </div>
                </div>

                {/* =================================
                    NIGHT MESSAGE
                ================================= */}

                <div className="mt-12 text-center">
                    <p
                        className="
                            text-sm
                            tracking-[0.5em]
                            text-white/30
                        "
                    >
                        THE NIGHT IS YOURS
                    </p>

                    <p
                        className="
                            mt-4
                            text-2xl
                            text-white/65
                        "
                        style={{
                            fontFamily:
                                "'Noto Serif Devanagari', 'Nirmala UI', serif",
                        }}
                    >
                        बस सुनो।
                    </p>
                </div>

                {/* =================================
                    PROGRESS
                ================================= */}

                <div className="mt-12">
                    <input
                        type="range"
                        min="0"
                        max={duration || 1}
                        value={Math.min(
                            currentTime,
                            duration || 1
                        )}
                        onChange={(event) =>
                            seek(
                                Number(
                                    event.target.value
                                )
                            )
                        }
                        className="
                            w-full
                            cursor-pointer
                            accent-white
                        "
                    />

                    <div
                        className="
                            mt-2
                            flex
                            justify-between
                            text-xs
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

                {/* =================================
                    CONTROLS
                ================================= */}

                <div
                    className="
                        mt-10
                        flex
                        items-center
                        justify-center
                        gap-6
                    "
                >
                    {/* PREVIOUS */}

                    <button
                        type="button"
                        onClick={prevSong}
                        aria-label="Previous"
                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/10
                            bg-white/[0.04]
                            text-lg
                            text-white/60
                            transition-all
                            duration-300
                            hover:scale-105
                            hover:border-white/20
                            hover:bg-white/[0.09]
                            hover:text-white
                        "
                    >
                        ⏮
                    </button>

                    {/* PLAY / PAUSE */}

                    <button
                        type="button"
                        onClick={togglePlay}
                        aria-label={
                            isPlaying
                                ? "Pause"
                                : "Play"
                        }
                        className={`
                            play-heartbeat

                            ${isPlaying
                                ? "is-playing"
                                : ""
                            }

                            flex
                            h-20
                            w-20
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
                        <span
                            className="
                                play-icon
                                flex
                                items-center
                                justify-center
                                text-xl
                                font-medium
                            "
                        >
                            {isPlaying
                                ? "Ⅱ"
                                : "▶"}
                        </span>
                    </button>

                    {/* NEXT */}

                    <button
                        type="button"
                        onClick={() => nextSong()}
                        aria-label="Next"
                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/10
                            bg-white/[0.04]
                            text-lg
                            text-white/60
                            transition-all
                            duration-300
                            hover:scale-105
                            hover:border-white/20
                            hover:bg-white/[0.09]
                            hover:text-white
                        "
                    >
                        ⏭
                    </button>
                </div>

                {/* =================================
                    VOLUME
                ================================= */}

                <div
                    className="
                        mx-auto
                        mt-10
                        flex
                        max-w-xs
                        items-center
                        gap-4
                    "
                >
                    <span className="text-white/30">
                        🔈
                    </span>

                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(event) =>
                            setVolume(
                                Number(
                                    event.target.value
                                )
                            )
                        }
                        className="
                            w-full
                            cursor-pointer
                            accent-white
                        "
                    />

                    <span className="text-white/30">
                        🔊
                    </span>
                </div>

                {/* =================================
                    BOTTOM LINE
                ================================= */}

                <div className="mt-10 text-center">
                    <p
                        className="
                            text-[10px]
                            tracking-[0.45em]
                            text-white/20
                        "
                    >
                        3 AM • NO NAMES • JUST FEEL
                    </p>
                </div>
            </div>
        </section>
    );
}
