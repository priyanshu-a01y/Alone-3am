"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type Song = {
    src: string;
    mood: string;
};

type PlayerContextType = {
    currentSong: Song;
    isPlaying: boolean;

    currentTime: number;
    duration: number;

    togglePlay: () => Promise<void>;
    nextSong: () => void;
    prevSong: () => void;

    seek: (value: number) => void;

    volume: number;
    setVolume: (value: number) => void;
};

/* =========================================================
   SETTINGS
========================================================= */

const SONG_COUNT = 96;

/*
 * 7 seconds crossfade.
 *
 * Current song:
 * last 7 seconds -> fade OUT
 *
 * Next song:
 * first 7 seconds -> fade IN
 */
const FADE_SECONDS = 7;

const FADE_INTERVAL = 50;

/* =========================================================
   SONG LIST
   Names are intentionally hidden.
========================================================= */

const songs: Song[] = Array.from(
    { length: SONG_COUNT },
    (_, index) => ({
        src: `/music/${index + 1}.mp3`,
        mood: `Track ${String(index + 1).padStart(2, "0")}`,
    })
);

/* =========================================================
   CONTEXT
========================================================= */

const PlayerContext =
    createContext<PlayerContextType | null>(null);

/* =========================================================
   SHUFFLE
========================================================= */

function shuffleArray(length: number) {
    const array = Array.from(
        { length },
        (_, index) => index
    );

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {
        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [array[i], array[j]] = [
            array[j],
            array[i],
        ];
    }

    return array;
}

/* =========================================================
   PROVIDER
========================================================= */

export function PlayerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    /* =====================================================
       AUDIO DECKS

       A = current song
       B = next song

       Then they swap.
    ===================================================== */

    const audioARef =
        useRef<HTMLAudioElement>(null);

    const audioBRef =
        useRef<HTMLAudioElement>(null);

    const activeDeckRef =
        useRef<"A" | "B">("A");

    /* =====================================================
       PLAYLIST
    ===================================================== */

    const playlistRef =
        useRef<number[]>([]);

    const positionRef =
        useRef(0);

    const initializedRef =
        useRef(false);

    /* =====================================================
       PLAYBACK REFS

       These are refs instead of state because audio
       events happen extremely quickly.
    ===================================================== */

    const playingRef =
        useRef(false);

    const transitioningRef =
        useRef(false);

    const fadeTimerRef =
        useRef<ReturnType<
            typeof setInterval
        > | null>(null);

    const volumeRef =
        useRef(0.7);

    const indexRef =
        useRef(0);

    /*
     * Used only for the first play.
     *
     * First play gets 7 sec fade-in.
     * Resume after pause does NOT restart fade.
     */
    const firstPlayRef =
        useRef(true);

    /* =====================================================
       STATE
    ===================================================== */

    const [index, setIndex] =
        useState(0);

    const [isPlaying, setIsPlaying] =
        useState(false);

    const [currentTime, setCurrentTime] =
        useState(0);

    const [duration, setDuration] =
        useState(0);

    const [volume, setVolumeState] =
        useState(0.7);

    const currentSong =
        songs[index];

    /* =====================================================
       AUDIO HELPERS
    ===================================================== */

    const getActiveAudio = () => {
        return activeDeckRef.current === "A"
            ? audioARef.current
            : audioBRef.current;
    };

    const getInactiveAudio = () => {
        return activeDeckRef.current === "A"
            ? audioBRef.current
            : audioARef.current;
    };

    const setDeckVolume = (
        audio: HTMLAudioElement | null,
        value: number
    ) => {
        if (!audio) return;

        audio.volume = Math.max(
            0,
            Math.min(1, value)
        );
    };

    const stopFade = () => {
        if (fadeTimerRef.current) {
            clearInterval(
                fadeTimerRef.current
            );

            fadeTimerRef.current = null;
        }
    };

    /* =====================================================
       SET PLAYING STATE

       Centralized so an old audio deck cannot accidentally
       change isPlaying to false during crossfade.
    ===================================================== */

    const setPlayingState = (
        value: boolean
    ) => {
        playingRef.current = value;
        setIsPlaying(value);
    };

    /* =====================================================
       INITIALIZE PLAYLIST
    ===================================================== */

    useEffect(() => {
        if (initializedRef.current) {
            return;
        }

        initializedRef.current = true;

        const playlist =
            shuffleArray(SONG_COUNT);

        playlistRef.current =
            playlist;

        positionRef.current = 0;

        const first =
            playlist[0] ?? 0;

        indexRef.current =
            first;

        setIndex(first);
    }, []);

    /* =====================================================
       LOAD FIRST SONG
    ===================================================== */

    useEffect(() => {
        const audio =
            audioARef.current;

        const other =
            audioBRef.current;

        if (!audio || !other) {
            return;
        }

        stopFade();

        transitioningRef.current =
            false;

        audio.pause();
        other.pause();

        audio.removeAttribute("src");
        other.removeAttribute("src");

        audio.load();
        other.load();

        const src =
            songs[index]?.src;

        if (!src) {
            return;
        }

        activeDeckRef.current =
            "A";

        audio.src = src;

        audio.load();

        /*
         * First song starts silent.
         * When user presses play it fades in.
         */
        setDeckVolume(
            audio,
            0
        );

        setDeckVolume(
            other,
            0
        );

        setPlayingState(false);

        setCurrentTime(0);
        setDuration(0);

        firstPlayRef.current =
            true;
    }, []);

    /* =====================================================
       PLAY CURRENT AUDIO

       Handles browser loading safely.
    ===================================================== */

    const playAudio = async (
        audio: HTMLAudioElement
    ) => {
        try {
            await audio.play();

            return true;
        } catch (error) {
            if (
                error instanceof DOMException &&
                error.name ===
                "AbortError"
            ) {
                return false;
            }

            console.error(
                "Audio play error:",
                error
            );

            return false;
        }
    };

    /* =====================================================
       FIRST PLAY FADE-IN
    ===================================================== */

    const fadeInFirstSong = async (
        audio: HTMLAudioElement
    ) => {
        stopFade();

        /*
         * Start at zero.
         */
        setDeckVolume(
            audio,
            0
        );

        const started =
            await playAudio(audio);

        if (!started) {
            return;
        }

        setPlayingState(true);

        const steps = Math.max(
            1,
            Math.round(
                (FADE_SECONDS * 1000) /
                FADE_INTERVAL
            )
        );

        let step = 0;

        fadeTimerRef.current =
            setInterval(() => {
                step++;

                const progress =
                    Math.min(
                        1,
                        step / steps
                    );

                const newVolume =
                    volumeRef.current *
                    progress;

                setDeckVolume(
                    audio,
                    newVolume
                );

                if (
                    progress >= 1
                ) {
                    stopFade();

                    setDeckVolume(
                        audio,
                        volumeRef.current
                    );
                }
            }, FADE_INTERVAL);
    };

    /* =====================================================
       NORMAL PLAY
    ===================================================== */

    const playNormally = async (
        audio: HTMLAudioElement
    ) => {
        setDeckVolume(
            audio,
            volumeRef.current
        );

        const started =
            await playAudio(audio);

        if (started) {
            setPlayingState(true);
        }
    };

    /* =====================================================
       TOGGLE PLAY / PAUSE
    ===================================================== */

    const togglePlay =
        async () => {
            const audio =
                getActiveAudio();

            if (!audio) {
                return;
            }

            /*
             * PAUSE
             */
            if (!audio.paused) {
                stopFade();

                audio.pause();

                setPlayingState(false);

                return;
            }

            /*
             * PLAY
             */

            if (
                firstPlayRef.current
            ) {
                firstPlayRef.current =
                    false;

                await fadeInFirstSong(
                    audio
                );

                return;
            }

            await playNormally(audio);
        };

    /* =====================================================
       GET NEXT POSITION
    ===================================================== */

    const getNextPosition = () => {
        const playlist =
            playlistRef.current;

        if (!playlist.length) {
            return null;
        }

        let next =
            positionRef.current + 1;

        /*
         * End of shuffled playlist.
         * Create a new shuffle.
         */
        if (
            next >= playlist.length
        ) {
            const oldSong =
                playlist[
                positionRef.current
                ];

            const newPlaylist =
                shuffleArray(
                    SONG_COUNT
                );

            /*
             * Avoid immediate repeat.
             */
            if (
                newPlaylist.length >
                1 &&
                newPlaylist[0] ===
                oldSong
            ) {
                [
                    newPlaylist[0],
                    newPlaylist[1],
                ] = [
                        newPlaylist[1],
                        newPlaylist[0],
                    ];
            }

            playlistRef.current =
                newPlaylist;

            next = 0;
        }

        return next;
    };

    /* =====================================================
       CROSSFADE
    ===================================================== */

    const crossfadeTo = async (
        nextIndex: number,
        wasPlaying: boolean
    ) => {
        const outgoing =
            getActiveAudio();

        const incoming =
            getInactiveAudio();

        if (
            !outgoing ||
            !incoming
        ) {
            return;
        }

        stopFade();

        /*
         * Prevent double next presses while transition
         * is happening.
         */
        transitioningRef.current =
            true;

        /* =================================================
           IF CURRENT SONG IS PAUSED

           Just switch song.
           Do NOT start playback.
        ================================================= */

        if (!wasPlaying) {
            outgoing.pause();
            incoming.pause();

            incoming.src =
                songs[nextIndex].src;

            incoming.load();

            setDeckVolume(
                incoming,
                volumeRef.current
            );

            setDeckVolume(
                outgoing,
                0
            );

            /*
             * Switch active deck immediately.
             */
            activeDeckRef.current =
                activeDeckRef.current ===
                    "A"
                    ? "B"
                    : "A";

            indexRef.current =
                nextIndex;

            setIndex(nextIndex);

            setCurrentTime(0);
            setDuration(0);

            setPlayingState(false);

            transitioningRef.current =
                false;

            return;
        }

        /* =================================================
           PLAYING

           Prepare incoming song.
        ================================================= */

        incoming.pause();

        incoming.src =
            songs[nextIndex].src;

        incoming.load();

        /*
         * Incoming starts at zero volume.
         */
        setDeckVolume(
            incoming,
            0
        );

        /*
         * Wait until browser has enough data.
         *
         * This fixes the "next song pauses" problem.
         */
        const startIncoming =
            async () => {
                if (
                    !transitioningRef.current
                ) {
                    return;
                }

                /*
                 * Start incoming at 0 volume.
                 */
                const started =
                    await playAudio(
                        incoming
                    );

                if (!started) {
                    transitioningRef.current =
                        false;

                    /*
                     * Keep old song playing.
                     */
                    setDeckVolume(
                        outgoing,
                        volumeRef.current
                    );

                    return;
                }

                /*
                 * BOTH songs are now playing.
                 */
                setPlayingState(true);

                const steps =
                    Math.max(
                        1,
                        Math.round(
                            (FADE_SECONDS *
                                1000) /
                            FADE_INTERVAL
                        )
                    );

                let step = 0;

                fadeTimerRef.current =
                    setInterval(() => {
                        if (
                            !transitioningRef.current
                        ) {
                            stopFade();

                            return;
                        }

                        step++;

                        const progress =
                            Math.min(
                                1,
                                step / steps
                            );

                        /*
                         * OLD:
                         * 100 -> 0
                         *
                         * NEW:
                         * 0 -> 100
                         */
                        const outgoingVolume =
                            volumeRef.current *
                            (1 -
                                progress);

                        const incomingVolume =
                            volumeRef.current *
                            progress;

                        setDeckVolume(
                            outgoing,
                            outgoingVolume
                        );

                        setDeckVolume(
                            incoming,
                            incomingVolume
                        );

                        if (
                            progress >=
                            1
                        ) {
                            stopFade();

                            /*
                             * Stop old deck.
                             */
                            outgoing.pause();

                            outgoing.currentTime =
                                0;

                            setDeckVolume(
                                outgoing,
                                0
                            );

                            /*
                             * New deck becomes active.
                             */
                            setDeckVolume(
                                incoming,
                                volumeRef.current
                            );

                            activeDeckRef.current =
                                activeDeckRef.current ===
                                    "A"
                                    ? "B"
                                    : "A";

                            indexRef.current =
                                nextIndex;

                            setIndex(
                                nextIndex
                            );

                            setCurrentTime(
                                incoming.currentTime
                            );

                            if (
                                Number.isFinite(
                                    incoming.duration
                                )
                            ) {
                                setDuration(
                                    incoming.duration
                                );
                            }

                            setPlayingState(
                                true
                            );

                            transitioningRef.current =
                                false;
                        }
                    }, FADE_INTERVAL);
            };

        /*
         * If metadata is already available,
         * start immediately.
         */
        if (
            incoming.readyState >=
            HTMLMediaElement.HAVE_FUTURE_DATA
        ) {
            await startIncoming();

            return;
        }

        /*
         * Otherwise wait for canplay.
         */
        const handleCanPlay =
            async () => {
                incoming.removeEventListener(
                    "canplay",
                    handleCanPlay
                );

                await startIncoming();
            };

        incoming.addEventListener(
            "canplay",
            handleCanPlay,
            {
                once: true,
            }
        );

        /*
         * Safety fallback.
         */
        setTimeout(() => {
            incoming.removeEventListener(
                "canplay",
                handleCanPlay
            );

            if (
                transitioningRef.current
            ) {
                startIncoming();
            }
        }, 1500);
    };

    /* =====================================================
       NEXT
    ===================================================== */

    const nextSong = () => {
        /*
         * Ignore duplicate clicks while crossfading.
         */
        if (
            transitioningRef.current
        ) {
            return;
        }

        const nextPosition =
            getNextPosition();

        if (
            nextPosition === null
        ) {
            return;
        }

        positionRef.current =
            nextPosition;

        const nextIndex =
            playlistRef.current[
            nextPosition
            ];

        const active =
            getActiveAudio();

        const wasPlaying =
            !!active &&
            !active.paused;

        crossfadeTo(
            nextIndex,
            wasPlaying
        );
    };

    /* =====================================================
       PREVIOUS
    ===================================================== */

    const prevSong = () => {
        if (
            transitioningRef.current
        ) {
            return;
        }

        const playlist =
            playlistRef.current;

        if (!playlist.length) {
            return;
        }

        let previous =
            positionRef.current - 1;

        if (previous < 0) {
            previous =
                playlist.length - 1;
        }

        positionRef.current =
            previous;

        const previousIndex =
            playlist[previous];

        const active =
            getActiveAudio();

        const wasPlaying =
            !!active &&
            !active.paused;

        crossfadeTo(
            previousIndex,
            wasPlaying
        );
    };

    /* =====================================================
       AUDIO EVENTS
    ===================================================== */

    useEffect(() => {
        const audioA =
            audioARef.current;

        const audioB =
            audioBRef.current;

        if (
            !audioA ||
            !audioB
        ) {
            return;
        }

        /* -----------------------------------------------
           TIME UPDATE
        ----------------------------------------------- */

        const updateTime =
            () => {
                const active =
                    getActiveAudio();

                if (!active) {
                    return;
                }

                /*
                 * Ignore old deck during crossfade.
                 */
                if (
                    active.paused &&
                    transitioningRef.current
                ) {
                    return;
                }

                setCurrentTime(
                    active.currentTime ||
                    0
                );

                if (
                    Number.isFinite(
                        active.duration
                    )
                ) {
                    setDuration(
                        active.duration
                    );
                }
            };

        /* -----------------------------------------------
           PLAY
        ----------------------------------------------- */

        const handlePlay =
            (event: Event) => {
                const audio =
                    event.currentTarget as HTMLAudioElement;

                /*
                 * Only active or incoming deck during
                 * transition is allowed to affect state.
                 */
                if (
                    audio ===
                    getActiveAudio() ||
                    transitioningRef.current
                ) {
                    playingRef.current =
                        true;

                    setIsPlaying(
                        true
                    );
                }
            };

        /* -----------------------------------------------
           PAUSE

           IMPORTANT:
           Old deck pausing during crossfade must NOT
           make the player appear paused.
        ----------------------------------------------- */

        const handlePause =
            (event: Event) => {
                if (
                    transitioningRef.current
                ) {
                    return;
                }

                const audio =
                    event.currentTarget as HTMLAudioElement;

                const active =
                    getActiveAudio();

                if (
                    audio !== active
                ) {
                    return;
                }

                /*
                 * User genuinely paused.
                 */
                if (
                    audio.paused
                ) {
                    setPlayingState(
                        false
                    );
                }
            };

        /* -----------------------------------------------
           METADATA
        ----------------------------------------------- */

        const handleMetadata =
            () => {
                const active =
                    getActiveAudio();

                if (
                    active &&
                    Number.isFinite(
                        active.duration
                    )
                ) {
                    setDuration(
                        active.duration
                    );
                }
            };

        /* -----------------------------------------------
           ENDED

           Normally crossfade finishes before ended.
           But if the song is shorter than expected or
           the browser fires ended, automatically continue.
        ----------------------------------------------- */

        const handleEnded =
            (event: Event) => {
                if (
                    transitioningRef.current
                ) {
                    return;
                }

                const endedAudio =
                    event.currentTarget as HTMLAudioElement;

                const active =
                    getActiveAudio();

                if (
                    endedAudio !== active
                ) {
                    return;
                }

                nextSong();
            };

        /* -----------------------------------------------
           LISTENERS
        ----------------------------------------------- */

        audioA.addEventListener(
            "timeupdate",
            updateTime
        );

        audioB.addEventListener(
            "timeupdate",
            updateTime
        );

        audioA.addEventListener(
            "play",
            handlePlay
        );

        audioB.addEventListener(
            "play",
            handlePlay
        );

        audioA.addEventListener(
            "pause",
            handlePause
        );

        audioB.addEventListener(
            "pause",
            handlePause
        );

        audioA.addEventListener(
            "loadedmetadata",
            handleMetadata
        );

        audioB.addEventListener(
            "loadedmetadata",
            handleMetadata
        );

        audioA.addEventListener(
            "ended",
            handleEnded
        );

        audioB.addEventListener(
            "ended",
            handleEnded
        );

        return () => {
            audioA.removeEventListener(
                "timeupdate",
                updateTime
            );

            audioB.removeEventListener(
                "timeupdate",
                updateTime
            );

            audioA.removeEventListener(
                "play",
                handlePlay
            );

            audioB.removeEventListener(
                "play",
                handlePlay
            );

            audioA.removeEventListener(
                "pause",
                handlePause
            );

            audioB.removeEventListener(
                "pause",
                handlePause
            );

            audioA.removeEventListener(
                "loadedmetadata",
                handleMetadata
            );

            audioB.removeEventListener(
                "loadedmetadata",
                handleMetadata
            );

            audioA.removeEventListener(
                "ended",
                handleEnded
            );

            audioB.removeEventListener(
                "ended",
                handleEnded
            );
        };
    }, []);

    /* =====================================================
       AUTO CROSSFADE BEFORE END

       This is the important part.

       At last 7 seconds:
       Song A fades out
       Song B fades in

       User does NOT need to press Next.
    ===================================================== */

    useEffect(() => {
        const checkCrossfade =
            () => {
                if (
                    transitioningRef.current
                ) {
                    return;
                }

                const active =
                    getActiveAudio();

                if (!active) {
                    return;
                }

                if (
                    active.paused
                ) {
                    return;
                }

                if (
                    !Number.isFinite(
                        active.duration
                    ) ||
                    active.duration <= 0
                ) {
                    return;
                }

                const remaining =
                    active.duration -
                    active.currentTime;

                /*
                 * Automatically move to next song
                 * during final 7 seconds.
                 */
                if (
                    remaining <=
                    FADE_SECONDS
                ) {
                    nextSong();
                }
            };

        const timer =
            setInterval(
                checkCrossfade,
                250
            );

        return () => {
            clearInterval(timer);
        };
    }, []);

    /* =====================================================
       VOLUME

       IMPORTANT:
       Volume change NEVER reloads the song.
    ===================================================== */

    useEffect(() => {
        volumeRef.current =
            volume;

        const active =
            getActiveAudio();

        if (!active) {
            return;
        }

        /*
         * During crossfade, the timer controls both decks.
         */
        if (
            transitioningRef.current
        ) {
            return;
        }

        setDeckVolume(
            active,
            volume
        );
    }, [volume]);

    /* =====================================================
       SEEK
    ===================================================== */

    const seek = (
        value: number
    ) => {
        const audio =
            getActiveAudio();

        if (!audio) {
            return;
        }

        if (
            !Number.isFinite(
                audio.duration
            ) ||
            audio.duration <= 0
        ) {
            return;
        }

        const safeValue =
            Math.max(
                0,
                Math.min(
                    value,
                    audio.duration
                )
            );

        audio.currentTime =
            safeValue;

        setCurrentTime(
            safeValue
        );
    };

    /* =====================================================
       CLEANUP
    ===================================================== */

    useEffect(() => {
        return () => {
            stopFade();

            audioARef.current?.pause();
            audioBRef.current?.pause();
        };
    }, []);

    /* =====================================================
       PROVIDER
    ===================================================== */

    return (
        <PlayerContext.Provider
            value={{
                currentSong,
                isPlaying,

                currentTime,
                duration,

                togglePlay,
                nextSong,
                prevSong,

                seek,

                volume,
                setVolume:
                    setVolumeState,
            }}
        >
            {children}

            {/* AUDIO DECK A */}
            <audio
                ref={audioARef}
                data-alone-player="A"
                preload="auto"
            />

            {/* AUDIO DECK B */}
            <audio
                ref={audioBRef}
                data-alone-player="B"
                preload="auto"
            />
        </PlayerContext.Provider>
    );
}

/* =========================================================
   HOOK
========================================================= */

export function usePlayer() {
    const context =
        useContext(PlayerContext);

    if (!context) {
        throw new Error(
            "usePlayer must be used inside PlayerProvider"
        );
    }

    return context;
}