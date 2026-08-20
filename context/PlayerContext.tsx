"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from "react";

type PlayerContextType = {
    isPlaying: boolean;
    currentIndex: number;
    currentTime: number;
    duration: number;
    volume: number;

    togglePlay: () => Promise<void>;
    nextSong: () => Promise<void>;
    prevSong: () => Promise<void>;

    seek: (time: number) => void;
    setVolume: (value: number) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

const SONG_COUNT = 96;
const FADE_TIME = 7;

const getSongPath = (index: number) =>
    `/music/${index + 1}.mp3`;

export function PlayerProvider({
    children,
}: {
    children: ReactNode;
}) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const fadeTimerRef = useRef<number | null>(null);
    const switchingRef = useRef(false);
    const mountedRef = useRef(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(0.8);

    /*
     * -------------------------------------------------------
     * CREATE ONE AUDIO ELEMENT ONLY
     * -------------------------------------------------------
     */

    useEffect(() => {
        const audio = new Audio();

        audio.preload = "auto";
        audio.volume = 0.8;

        audioRef.current = audio;
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            if (fadeTimerRef.current) {
                window.clearInterval(fadeTimerRef.current);
            }

            audio.pause();
            audio.src = "";
            audioRef.current = null;
        };
    }, []);

    /*
     * -------------------------------------------------------
     * LOAD INITIAL SONG
     * -------------------------------------------------------
     */

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        let savedIndex = 0;

        try {
            const saved = localStorage.getItem(
                "alone3am-last-song"
            );

            if (saved !== null) {
                const parsed = Number(saved);

                if (
                    Number.isInteger(parsed) &&
                    parsed >= 0 &&
                    parsed < SONG_COUNT
                ) {
                    /*
                     * Start from the NEXT song after refresh.
                     * This prevents the same song every time.
                     */
                    savedIndex =
                        (parsed + 1) % SONG_COUNT;
                }
            }
        } catch {
            savedIndex = 0;
        }

        setCurrentIndex(savedIndex);

        audio.src = getSongPath(savedIndex);
        audio.load();

        try {
            localStorage.setItem(
                "alone3am-last-song",
                String(savedIndex)
            );
        } catch { }
    }, []);

    /*
     * -------------------------------------------------------
     * AUDIO EVENTS
     * -------------------------------------------------------
     */

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            if (Number.isFinite(audio.duration)) {
                setDuration(audio.duration);
            }
        };

        const handleEnded = async () => {
            if (switchingRef.current) return;

            await changeSong(
                (currentIndex + 1) % SONG_COUNT,
                true
            );
        };

        const handlePlay = () => {
            setIsPlaying(true);
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        audio.addEventListener(
            "timeupdate",
            handleTimeUpdate
        );

        audio.addEventListener(
            "loadedmetadata",
            handleLoadedMetadata
        );

        audio.addEventListener(
            "ended",
            handleEnded
        );

        audio.addEventListener(
            "play",
            handlePlay
        );

        audio.addEventListener(
            "pause",
            handlePause
        );

        return () => {
            audio.removeEventListener(
                "timeupdate",
                handleTimeUpdate
            );

            audio.removeEventListener(
                "loadedmetadata",
                handleLoadedMetadata
            );

            audio.removeEventListener(
                "ended",
                handleEnded
            );

            audio.removeEventListener(
                "play",
                handlePlay
            );

            audio.removeEventListener(
                "pause",
                handlePause
            );
        };
    }, [currentIndex]);

    /*
     * -------------------------------------------------------
     * FADE ENGINE
     * -------------------------------------------------------
     */

    const fadeVolume = (
        from: number,
        to: number,
        duration: number,
        callback?: () => void
    ) => {
        const audio = audioRef.current;

        if (!audio) return;

        if (fadeTimerRef.current) {
            window.clearInterval(fadeTimerRef.current);
        }

        const start = performance.now();

        audio.volume = Math.max(
            0,
            Math.min(1, from)
        );

        fadeTimerRef.current =
            window.setInterval(() => {
                const elapsed =
                    performance.now() - start;

                const progress = Math.min(
                    elapsed / duration,
                    1
                );

                const value =
                    from + (to - from) * progress;

                audio.volume = Math.max(
                    0,
                    Math.min(1, value)
                );

                if (progress >= 1) {
                    if (fadeTimerRef.current) {
                        window.clearInterval(
                            fadeTimerRef.current
                        );
                    }

                    fadeTimerRef.current = null;

                    callback?.();
                }
            }, 40);
    };

    /*
     * -------------------------------------------------------
     * CHANGE SONG
     * -------------------------------------------------------
     */

    const changeSong = async (
        nextIndex: number,
        automatic = false
    ) => {
        const audio = audioRef.current;

        if (!audio || switchingRef.current) {
            return;
        }

        switchingRef.current = true;

        try {
            const wasPlaying =
                !audio.paused || automatic;

            /*
             * Fade current song out.
             */

            if (!audio.paused) {
                await new Promise<void>((resolve) => {
                    fadeVolume(
                        audio.volume,
                        0,
                        FADE_TIME * 1000,
                        resolve
                    );
                });
            }

            /*
             * IMPORTANT:
             * Stop the old song completely before
             * changing source.
             *
             * This prevents two songs playing together.
             */

            audio.pause();
            audio.currentTime = 0;

            const finalIndex =
                (nextIndex + SONG_COUNT) %
                SONG_COUNT;

            setCurrentIndex(finalIndex);

            try {
                localStorage.setItem(
                    "alone3am-last-song",
                    String(finalIndex)
                );
            } catch { }

            setCurrentTime(0);
            setDuration(0);

            audio.src = getSongPath(finalIndex);
            audio.load();

            if (wasPlaying) {
                await audio.play();

                /*
                 * Fade new song in.
                 */

                fadeVolume(
                    0,
                    volume,
                    FADE_TIME * 1000
                );
            }
        } catch (error) {
            console.error(
                "Song change error:",
                error
            );
        } finally {
            switchingRef.current = false;
        }
    };

    /*
     * -------------------------------------------------------
     * PLAY / PAUSE
     * -------------------------------------------------------
     */

    const togglePlay = async () => {
        const audio = audioRef.current;

        if (!audio) return;

        try {
            if (audio.paused) {
                /*
                 * Start at zero and fade in.
                 */

                audio.volume = 0;

                await audio.play();

                fadeVolume(
                    0,
                    volume,
                    FADE_TIME * 1000
                );
            } else {
                /*
                 * Fade out before pausing.
                 */

                await new Promise<void>((resolve) => {
                    fadeVolume(
                        audio.volume,
                        0,
                        FADE_TIME * 1000,
                        resolve
                    );
                });

                audio.pause();
                audio.volume = volume;
            }
        } catch (error) {
            console.error(
                "Play/pause error:",
                error
            );
        }
    };

    /*
     * -------------------------------------------------------
     * NEXT
     * -------------------------------------------------------
     */

    const nextSong = async () => {
        await changeSong(
            (currentIndex + 1) % SONG_COUNT
        );
    };

    /*
     * -------------------------------------------------------
     * PREVIOUS
     * -------------------------------------------------------
     */

    const prevSong = async () => {
        await changeSong(
            (currentIndex - 1 + SONG_COUNT) %
            SONG_COUNT
        );
    };

    /*
     * -------------------------------------------------------
     * SEEK
     * -------------------------------------------------------
     */

    const seek = (time: number) => {
        const audio = audioRef.current;

        if (!audio) return;

        audio.currentTime = Math.max(
            0,
            Math.min(
                time,
                audio.duration || 0
            )
        );

        setCurrentTime(audio.currentTime);
    };

    /*
     * -------------------------------------------------------
     * VOLUME
     * -------------------------------------------------------
     */

    const setVolume = (value: number) => {
        const clean = Math.max(
            0,
            Math.min(1, value)
        );

        setVolumeState(clean);

        const audio = audioRef.current;

        if (audio) {
            audio.volume = clean;
        }
    };

    return (
        <PlayerContext.Provider
            value={{
                isPlaying,
                currentIndex,
                currentTime,
                duration,
                volume,

                togglePlay,
                nextSong,
                prevSong,

                seek,
                setVolume,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);

    if (!context) {
        throw new Error(
            "usePlayer must be used inside PlayerProvider"
        );
    }

    return context;
}