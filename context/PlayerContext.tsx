"use client";

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
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

const PlayerContext =
    createContext<PlayerContextType | null>(null);

const SONG_COUNT = 96;
const CROSSFADE_SECONDS = 7;

const getSongPath = (index: number) =>
    `/music/${index + 1}.mp3`;

export function PlayerProvider({
    children,
}: {
    children: ReactNode;
}) {
    /*
     * -------------------------------------------------------
     * AUDIO ENGINES
     * -------------------------------------------------------
     *
     * We intentionally use TWO audio elements.
     *
     * A = current song
     * B = next song
     *
     * During the final 7 seconds:
     *
     * A volume: 100% -> 0%
     * B volume:   0% -> 100%
     *
     * This creates a real crossfade.
     */

    const audioARef =
        useRef<HTMLAudioElement | null>(null);

    const audioBRef =
        useRef<HTMLAudioElement | null>(null);

    const activeSlotRef =
        useRef<"A" | "B">("A");

    const currentIndexRef =
        useRef(0);

    const volumeRef =
        useRef(0.8);

    const switchingRef =
        useRef(false);

    const crossfadeStartedRef =
        useRef(false);

    const mountedRef =
        useRef(false);

    const rafRef =
        useRef<number | null>(null);

    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [isPlaying, setIsPlaying] =
        useState(false);

    const [currentTime, setCurrentTime] =
        useState(0);

    const [duration, setDuration] =
        useState(0);

    const [volume, setVolumeState] =
        useState(0.8);

    /*
     * -------------------------------------------------------
     * INITIAL SONG
     * -------------------------------------------------------
     *
     * Refresh:
     * last song -> next song
     *
     * So the same song doesn't start every time.
     */

    const getInitialIndex = () => {
        if (typeof window === "undefined") {
            return 0;
        }

        try {
            const saved =
                localStorage.getItem(
                    "alone3am-last-song"
                );

            if (saved !== null) {
                const last = Number(saved);

                if (
                    Number.isInteger(last) &&
                    last >= 0 &&
                    last < SONG_COUNT
                ) {
                    return (
                        (last + 1) %
                        SONG_COUNT
                    );
                }
            }
        } catch { }

        return 0;
    };

    /*
     * -------------------------------------------------------
     * ACTIVE AUDIO
     * -------------------------------------------------------
     */

    const getActiveAudio =
        useCallback(() => {
            return activeSlotRef.current === "A"
                ? audioARef.current
                : audioBRef.current;
        }, []);

    const getInactiveAudio =
        useCallback(() => {
            return activeSlotRef.current === "A"
                ? audioBRef.current
                : audioARef.current;
        }, []);

    /*
     * -------------------------------------------------------
     * CREATE AUDIO ELEMENTS
     * -------------------------------------------------------
     */

    useEffect(() => {
        const audioA =
            new Audio();

        const audioB =
            new Audio();

        audioA.preload = "auto";
        audioB.preload = "auto";

        audioA.volume =
            volumeRef.current;

        audioB.volume = 0;

        audioARef.current = audioA;
        audioBRef.current = audioB;

        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            if (rafRef.current !== null) {
                cancelAnimationFrame(
                    rafRef.current
                );
            }

            audioA.pause();
            audioB.pause();

            audioA.src = "";
            audioB.src = "";

            audioARef.current = null;
            audioBRef.current = null;
        };
    }, []);

    /*
     * -------------------------------------------------------
     * LOAD INITIAL SONG
     * -------------------------------------------------------
     */

    useEffect(() => {
        const audio =
            audioARef.current;

        if (!audio) return;

        const initialIndex =
            getInitialIndex();

        currentIndexRef.current =
            initialIndex;

        setCurrentIndex(
            initialIndex
        );

        audio.src =
            getSongPath(initialIndex);

        audio.load();

        try {
            localStorage.setItem(
                "alone3am-last-song",
                String(initialIndex)
            );
        } catch { }
    }, []);

    /*
     * -------------------------------------------------------
     * UPDATE PLAYER UI
     * -------------------------------------------------------
     */

    useEffect(() => {
        const tick = () => {
            if (!mountedRef.current) {
                return;
            }

            const audio =
                getActiveAudio();

            if (audio) {
                setCurrentTime(
                    audio.currentTime || 0
                );

                if (
                    Number.isFinite(
                        audio.duration
                    )
                ) {
                    setDuration(
                        audio.duration
                    );
                }
            }

            rafRef.current =
                requestAnimationFrame(tick);
        };

        rafRef.current =
            requestAnimationFrame(tick);

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(
                    rafRef.current
                );
            }
        };
    }, [getActiveAudio]);

    /*
     * -------------------------------------------------------
     * SAVE CURRENT SONG
     * -------------------------------------------------------
     */

    const saveIndex = (
        index: number
    ) => {
        currentIndexRef.current =
            index;

        setCurrentIndex(index);

        try {
            localStorage.setItem(
                "alone3am-last-song",
                String(index)
            );
        } catch { }
    };

    /*
     * -------------------------------------------------------
     * CROSSFADE
     * -------------------------------------------------------
     */

    const crossfadeTo = useCallback(
        async (
            nextIndex: number
        ) => {
            if (
                switchingRef.current ||
                !mountedRef.current
            ) {
                return;
            }

            const current =
                getActiveAudio();

            const next =
                getInactiveAudio();

            if (!current || !next) {
                return;
            }

            switchingRef.current = true;
            crossfadeStartedRef.current = true;

            try {
                const targetVolume =
                    volumeRef.current;

                /*
                 * Prepare next song.
                 */

                next.pause();
                next.src =
                    getSongPath(nextIndex);

                next.currentTime = 0;
                next.volume = 0;

                /*
                 * Load next track.
                 */

                next.load();

                /*
                 * Wait until browser has
                 * enough information to play.
                 */

                await new Promise<void>(
                    (resolve, reject) => {
                        let finished = false;

                        const cleanup = () => {
                            next.removeEventListener(
                                "canplay",
                                onCanPlay
                            );

                            next.removeEventListener(
                                "error",
                                onError
                            );
                        };

                        const onCanPlay =
                            () => {
                                if (finished)
                                    return;

                                finished = true;
                                cleanup();
                                resolve();
                            };

                        const onError =
                            () => {
                                if (finished)
                                    return;

                                finished = true;
                                cleanup();
                                reject(
                                    new Error(
                                        "Next song could not load"
                                    )
                                );
                            };

                        next.addEventListener(
                            "canplay",
                            onCanPlay,
                            { once: true }
                        );

                        next.addEventListener(
                            "error",
                            onError,
                            { once: true }
                        );

                        /*
                         * Some browsers may already
                         * have enough data.
                         */

                        if (
                            next.readyState >= 3
                        ) {
                            onCanPlay();
                        }
                    }
                );

                /*
                 * Start next song.
                 */

                await next.play();

                const start =
                    performance.now();

                const startVolume =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            current.volume
                        )
                    );

                /*
                 * 7 SECOND REAL CROSSFADE
                 */

                await new Promise<void>(
                    (resolve) => {
                        const animate =
                            (now: number) => {
                                const elapsed =
                                    now - start;

                                const progress =
                                    Math.min(
                                        elapsed /
                                        (CROSSFADE_SECONDS *
                                            1000),
                                        1
                                    );

                                /*
                                 * Smooth easing.
                                 */

                                const eased =
                                    progress *
                                    progress *
                                    (3 -
                                        2 *
                                        progress);

                                current.volume =
                                    Math.max(
                                        0,
                                        startVolume *
                                        (1 -
                                            eased)
                                    );

                                next.volume =
                                    Math.min(
                                        targetVolume,
                                        targetVolume *
                                        eased
                                    );

                                if (
                                    progress <
                                    1
                                ) {
                                    requestAnimationFrame(
                                        animate
                                    );
                                } else {
                                    resolve();
                                }
                            };

                        requestAnimationFrame(
                            animate
                        );
                    }
                );

                /*
                 * Stop OLD song.
                 */

                current.pause();
                current.currentTime = 0;
                current.volume = 0;

                /*
                 * Make next audio active.
                 */

                activeSlotRef.current =
                    activeSlotRef.current ===
                        "A"
                        ? "B"
                        : "A";

                saveIndex(nextIndex);

                setCurrentTime(0);

                if (
                    Number.isFinite(
                        next.duration
                    )
                ) {
                    setDuration(
                        next.duration
                    );
                }

                next.volume =
                    targetVolume;

                setIsPlaying(true);
            } catch (error) {
                console.error(
                    "Crossfade error:",
                    error
                );

                /*
                 * Recovery:
                 * Stop next if something failed.
                 */

                next.pause();
                next.src = "";
                next.volume = 0;

                /*
                 * Keep current song alive.
                 */

                current.volume =
                    volumeRef.current;

                if (
                    !current.paused
                ) {
                    setIsPlaying(true);
                }
            } finally {
                switchingRef.current =
                    false;

                /*
                 * Allow another crossfade.
                 */

                setTimeout(() => {
                    crossfadeStartedRef.current =
                        false;
                }, 300);
            }
        },
        [
            getActiveAudio,
            getInactiveAudio,
        ]
    );

    /*
     * -------------------------------------------------------
     * AUDIO EVENTS
     * -------------------------------------------------------
     */

    useEffect(() => {
        const audioA =
            audioARef.current;

        const audioB =
            audioBRef.current;

        if (!audioA || !audioB) {
            return;
        }

        const checkCrossfade = (
            audio: HTMLAudioElement
        ) => {
            if (
                switchingRef.current ||
                crossfadeStartedRef.current
            ) {
                return;
            }

            if (
                !audio.duration ||
                !Number.isFinite(
                    audio.duration
                )
            ) {
                return;
            }

            const remaining =
                audio.duration -
                audio.currentTime;

            /*
             * Start crossfade in final 7 sec.
             */

            if (
                remaining <=
                CROSSFADE_SECONDS &&
                remaining > 0.15
            ) {
                crossfadeStartedRef.current =
                    true;

                const nextIndex =
                    (
                        currentIndexRef.current +
                        1
                    ) % SONG_COUNT;

                crossfadeTo(
                    nextIndex
                );
            }
        };

        const onTimeA = () => {
            checkCrossfade(audioA);
        };

        const onTimeB = () => {
            checkCrossfade(audioB);
        };

        const onEndedA = () => {
            if (
                !switchingRef.current
            ) {
                const nextIndex =
                    (
                        currentIndexRef.current +
                        1
                    ) % SONG_COUNT;

                crossfadeStartedRef.current =
                    false;

                crossfadeTo(
                    nextIndex
                );
            }
        };

        const onEndedB = () => {
            if (
                !switchingRef.current
            ) {
                const nextIndex =
                    (
                        currentIndexRef.current +
                        1
                    ) % SONG_COUNT;

                crossfadeStartedRef.current =
                    false;

                crossfadeTo(
                    nextIndex
                );
            }
        };

        const onPlay = () => {
            setIsPlaying(true);
        };

        const onPause = () => {
            /*
             * During crossfade one audio can pause
             * while the other is playing.
             */

            if (
                switchingRef.current
            ) {
                return;
            }

            const active =
                getActiveAudio();

            if (
                active?.paused
            ) {
                setIsPlaying(false);
            }
        };

        audioA.addEventListener(
            "timeupdate",
            onTimeA
        );

        audioB.addEventListener(
            "timeupdate",
            onTimeB
        );

        audioA.addEventListener(
            "ended",
            onEndedA
        );

        audioB.addEventListener(
            "ended",
            onEndedB
        );

        audioA.addEventListener(
            "play",
            onPlay
        );

        audioB.addEventListener(
            "play",
            onPlay
        );

        audioA.addEventListener(
            "pause",
            onPause
        );

        audioB.addEventListener(
            "pause",
            onPause
        );

        return () => {
            audioA.removeEventListener(
                "timeupdate",
                onTimeA
            );

            audioB.removeEventListener(
                "timeupdate",
                onTimeB
            );

            audioA.removeEventListener(
                "ended",
                onEndedA
            );

            audioB.removeEventListener(
                "ended",
                onEndedB
            );

            audioA.removeEventListener(
                "play",
                onPlay
            );

            audioB.removeEventListener(
                "play",
                onPlay
            );

            audioA.removeEventListener(
                "pause",
                onPause
            );

            audioB.removeEventListener(
                "pause",
                onPause
            );
        };
    }, [
        crossfadeTo,
        getActiveAudio,
    ]);

    /*
     * -------------------------------------------------------
     * PLAY / PAUSE
     * -------------------------------------------------------
     */

    const togglePlay = async () => {
        const audio =
            getActiveAudio();

        if (
            !audio ||
            switchingRef.current
        ) {
            return;
        }

        try {
            if (audio.paused) {
                audio.volume =
                    volumeRef.current;

                await audio.play();

                setIsPlaying(true);
            } else {
                audio.pause();

                setIsPlaying(false);
            }
        } catch (error) {
            console.error(
                "Playback error:",
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
        if (
            switchingRef.current
        ) {
            return;
        }

        const nextIndex =
            (
                currentIndexRef.current +
                1
            ) % SONG_COUNT;

        crossfadeStartedRef.current =
            true;

        await crossfadeTo(
            nextIndex
        );
    };

    /*
     * -------------------------------------------------------
     * PREVIOUS
     * -------------------------------------------------------
     */

    const prevSong = async () => {
        if (
            switchingRef.current
        ) {
            return;
        }

        const previousIndex =
            (
                currentIndexRef.current -
                1 +
                SONG_COUNT
            ) % SONG_COUNT;

        crossfadeStartedRef.current =
            true;

        await crossfadeTo(
            previousIndex
        );
    };

    /*
     * -------------------------------------------------------
     * SEEK
     * -------------------------------------------------------
     */

    const seek = (
        time: number
    ) => {
        const audio =
            getActiveAudio();

        if (!audio) return;

        if (
            !Number.isFinite(
                audio.duration
            )
        ) {
            return;
        }

        /*
         * If user seeks away from the final 7 sec,
         * cancel pending automatic crossfade.
         */

        if (
            audio.duration -
            time >
            CROSSFADE_SECONDS
        ) {
            crossfadeStartedRef.current =
                false;
        }

        audio.currentTime =
            Math.max(
                0,
                Math.min(
                    time,
                    audio.duration
                )
            );

        setCurrentTime(
            audio.currentTime
        );
    };

    /*
     * -------------------------------------------------------
     * VOLUME
     * -------------------------------------------------------
     */

    const setVolume = (
        value: number
    ) => {
        const clean =
            Math.max(
                0,
                Math.min(
                    1,
                    value
                )
            );

        volumeRef.current =
            clean;

        setVolumeState(clean);

        const active =
            getActiveAudio();

        const inactive =
            getInactiveAudio();

        /*
         * Only change active audio directly.
         *
         * During crossfade, inactive audio is
         * controlled by the crossfade engine.
         */

        if (
            active &&
            !switchingRef.current
        ) {
            active.volume =
                clean;
        }

        /*
         * If inactive audio isn't playing,
         * keep it silent.
         */

        if (
            inactive &&
            inactive.paused
        ) {
            inactive.volume = 0;
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
    const context =
        useContext(
            PlayerContext
        );

    if (!context) {
        throw new Error(
            "usePlayer must be used inside PlayerProvider"
        );
    }

    return context;
}