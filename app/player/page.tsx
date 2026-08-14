"use client";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const songs = [
    {
        title: "Khat",
        artist: "Navjot Ahuja",
        file: "/music/after-midnight.mp3",
    },
    {
        title: "Enna Sona",
        artist: "Arijit Singh",
        file: "/music/enna-sona.mp3",
    },
];

export default function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [current, setCurrent] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);

    const song = songs[current];
    const audio = document.getElementById(
        "global-audio"
    ) as HTMLAudioElement;
    audio.play();
    audio.pause();

    audio.play();
    // Load new song
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.load();
        audio.volume = volume;

        if (playing) {
            audio.play().catch(() => setPlaying(false));
        }
    }, [current]);

    // Volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Play / Pause
    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (playing) {
            audio.pause();
            setPlaying(false);
        } else {
            try {
                await audio.play();
                setPlaying(true);
            } catch {
                setPlaying(false);
            }
        }
    };

    // Next
    const nextSong = () => {
        setCurrent((prev) => (prev + 1) % songs.length);
        setProgress(0);
    };

    // Previous
    const previousSong = () => {
        setCurrent((prev) =>
            prev === 0 ? songs.length - 1 : prev - 1
        );
        setProgress(0);
    };

    // Time format
    const formatTime = (seconds: number) => {
        if (!seconds || Number.isNaN(seconds)) return "00:00";

        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);

        return `${String(min).padStart(2, "0")}:${String(sec).padStart(
            2,
            "0"
        )}`;
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
            <div className="fixed inset-0 bg-black/75" />

            {/* NIGHT GLOW */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(40,55,90,0.3),transparent_60%)]" />

            {/* HEADER */}
            <section className="relative z-10 px-6 pb-8 pt-8 text-center">

                <p className="text-[10px] tracking-[0.45em] text-white/35">
                    NOW BROADCASTING
                </p>

                <h1 className="mt-3 text-3xl font-semibold tracking-[0.18em] md:text-5xl">
                    MIDNIGHT RADIO
                </h1>

                <p className="mt-3 text-xs text-white/40">
                    Lo-fi • Rain • Silence
                </p>

            </section>

            {/* MAIN PLAYER */}
            <div className="relative z-10 mx-auto w-[82%] max-w-3xl overflow-hidden rounded-[26px] border border-white/10 bg-black/55 shadow-2xl backdrop-blur-xl">

                <div className="flex flex-col md:flex-row">

                    {/* VINYL */}
                    <div className="flex min-h-[250px] flex-1 items-center justify-center bg-black/25">

                        <div
                            className={`relative h-40 w-40 rounded-full border-[10px] border-white/5 bg-[#090909] shadow-[0_0_70px_rgba(0,0,0,0.9)] ${playing ? "vinyl-spin" : ""
                                }`}
                        >

                            {/* Vinyl grooves */}
                            <div className="absolute inset-4 rounded-full border border-white/10" />
                            <div className="absolute inset-8 rounded-full border border-white/10" />
                            <div className="absolute inset-12 rounded-full border border-white/10" />

                            {/* Center label */}
                            <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[#171717] text-center">

                                <span className="text-[7px] tracking-[0.3em] text-white/40">
                                    ALONE
                                </span>

                                <span className="mt-1 text-[6px] text-white/30">
                                    3AM RADIO
                                </span>

                                <span className="mt-2 h-2 w-2 rounded-full bg-white" />

                            </div>

                        </div>

                    </div>

                    {/* CONTROLS */}
                    <div className="flex flex-1 flex-col justify-center bg-[#090c14]/85 p-6 md:p-7">

                        <p className="text-[9px] tracking-[0.4em] text-white/30">
                            TRACK {String(current + 1).padStart(2, "0")}
                        </p>

                        <div className="mt-3 flex items-start justify-between">

                            <div>
                                <h2 className="text-2xl font-semibold">
                                    {song.title}
                                </h2>

                                <p className="mt-1 text-sm text-white/40">
                                    {song.artist}
                                </p>
                            </div>

                            <span className="text-xl text-white/30">
                                ♡
                            </span>

                        </div>

                        {/* PROGRESS */}
                        <div className="mt-7">

                            <div className="mb-2 flex justify-between text-[10px] text-white/30">
                                <span>{formatTime(progress)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>

                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={progress}
                                onChange={(e) => {
                                    const value = Number(e.target.value);

                                    if (audioRef.current) {
                                        audioRef.current.currentTime = value;
                                    }

                                    setProgress(value);
                                }}
                                className="music-range w-full"
                            />

                        </div>

                        {/* PLAY CONTROLS */}
                        <div className="mt-6 flex items-center justify-center gap-7">

                            <button
                                onClick={previousSong}
                                className="control-button"
                                aria-label="Previous song"
                            >
                                ◀
                            </button>

                            <button
                                onClick={togglePlay}
                                className="play-button"
                                aria-label={playing ? "Pause" : "Play"}
                            >
                                {playing ? "Ⅱ" : "▶"}
                            </button>

                            <button
                                onClick={nextSong}
                                className="control-button"
                                aria-label="Next song"
                            >
                                ▶
                            </button>

                        </div>

                        {/* VOLUME */}
                        <div className="mt-7">

                            <div className="mb-2 flex justify-between text-[10px] text-white/30">
                                <span>VOLUME</span>
                                <span>{Math.round(volume * 100)}%</span>
                            </div>

                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) =>
                                    setVolume(Number(e.target.value))
                                }
                                className="music-range w-full"
                            />

                        </div>

                    </div>

                </div>

            </div>

            {/* FOOTER */}
            <p className="relative z-10 py-10 text-center text-[10px] tracking-[0.35em] text-white/25">
                FOR THE ONES WHO HEAL AT NIGHT
            </p>

            {/* AUDIO */}
            <audio
                ref={audioRef}
                src={song.file}
                onTimeUpdate={(e) =>
                    setProgress(e.currentTarget.currentTime)
                }
                onLoadedMetadata={(e) =>
                    setDuration(e.currentTarget.duration)
                }
                onEnded={nextSong}
            />
            <Navbar />
        </main>
    );
}