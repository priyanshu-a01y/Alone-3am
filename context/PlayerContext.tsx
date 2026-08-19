"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

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

/* ----------------------------------
   SETTINGS
---------------------------------- */

const CROSSFADE_SECONDS = 7;
const FADE_INTERVAL = 50;

/* ----------------------------------
   SONGS
   Actual names are intentionally hidden.
---------------------------------- */

const songs: Song[] = Array.from(
    { length: 96 },
    (_, index) => ({
        src: `/music/${index + 1}.mp3`,
        mood: `Track ${String(index + 1).padStart(2, "0")}`,
    })
);

/* ----------------------------------
   CONTEXT
---------------------------------- */

const PlayerContext =
    createContext<PlayerContextType | null>(null);

/* ----------------------------------
   SHUFFLE
---------------------------------- */

function shuffleArray(length: number) {
    const array = Array.from(
        { length },
        (_, i) => i
    );

    for (let i = array.length - 1; i > 0; i--) {
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

/* ----------------------------------
   PROVIDER
---------------------------------- */

export function PlayerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    /* ----------------------------------
       TWO AUDIO DECKS
    ---------------------------------- */

    const audioARef =
        useRef<HTMLAudioElement>(null);

    const audioBRef =
        useRef<HTMLAudioElement>(null);

    const activeDeckRef =
        useRef<"A" | "B">("A");

    /* ----------------------------------
       PLAYLIST
    ---------------------------------- */

    const playlistRef =
        useRef<number[]>([]);

    const positionRef =
        useRef(0);

    const initializedRef =
        useRef(false);

    const shouldPlayRef =
        useRef(false);

    const crossfadingRef =
        useRef(false);

    const fadeTimerRef =
        useRef<ReturnType<typeof setInterval> | null>(
            null
        );

    /* ----------------------------------
       STATE
    ---------------------------------- */

    const [index, setIndex] =
        useState(0);

    const indexRef =
        useRef(0);

    const [isPlaying, setIsPlaying] =
        useState(false);

    const [currentTime, setCurrentTime] =
        useState(0);

    const [duration, setDuration] =
        useState(0);

    const [volume, setVolumeState] =
        useState(0.7);

    const volumeRef =
        useRef(0.7);

    const currentSong =
        songs[index];

    /* ----------------------------------
       HELPERS
    ---------------------------------- */

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

    const stopFadeTimer = () => {
        if (fadeTimerRef.current) {
            clearInterval(
                fadeTimerRef.current
            );

            fadeTimerRef.current = null;
        }
    };

    const setDeckVolume = (
        audio: HTMLAudioElement,
        value: number
    ) => {
        audio.volume = Math.max(
            0,
            Math.min(1, value)
        );
    };

    /* ----------------------------------
       INITIALIZE PLAYLIST
    ---------------------------------- */

    useEffect(() => {
        if (initializedRef.current) {
            return;
        }

        initializedRef.current = true;

        const playlist =
            shuffleArray(songs.length);

        playlistRef.current =
            playlist;

        positionRef.current = 0;

        const firstIndex =
            playlist[0] ?? 0;

        indexRef.current =
            firstIndex;

        setIndex(firstIndex);
    }, []);

    /* ----------------------------------
       LOAD CURRENT SONG
    ---------------------------------- */

    useEffect(() => {
        const audioA =
            audioARef.current;

        const audioB =
            audioBRef.current;

        if (!audioA || !audioB) {
            return;
        }

        stopFadeTimer();

        crossfadingRef.current =
            false;

        audioA.pause();
        audioB.pause();

        audioA.currentTime = 0;
        audioB.currentTime = 0;

        const src =
            songs[index]?.src;

        if (!src) {
            return;
        }

        /*
         * Always load the current song
         * into the active deck.
         */
        const activeAudio =
            activeDeckRef.current === "A"
                ? audioA
                : audioB;

        const inactiveAudio =
            activeDeckRef.current === "A"
                ? audioB
                : audioA;

        activeAudio.src = src;
        activeAudio.load();

        inactiveAudio.removeAttribute(
            "src"
        );

        inactiveAudio.load();

        setDeckVolume(
            activeAudio,
            volumeRef.current
        );

        setDeckVolume(
            inactiveAudio,
            0
        );

        setCurrentTime(0);
        setDuration(0);

        /*
         * If Next / Previous was pressed
         * while music was playing,
         * continue playing the new song.
         */
        if (shouldPlayRef.current) {
            shouldPlayRef.current =
                false;

            const playPromise =
                activeAudio.play();

            if (playPromise) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((error) => {
                        if (
                            error?.name !==
                            "AbortError"
                        ) {
                            console.error(
                                "Audio play error:",
                                error
                            );
                        }

                        setIsPlaying(false);
                    });
            }
        }
    }, [index]);

    /* ----------------------------------
       AUDIO EVENTS
    ---------------------------------- */

    useEffect(() => {
        const audioA =
            audioARef.current;

        const audioB =
            audioBRef.current;

        if (!audioA || !audioB) {
            return;
        }

        const updateTime = () => {
            const audio =
                getActiveAudio();

            if (!audio) {
                return;
            }

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
        };

        const handlePlay = () => {
            setIsPlaying(true);
        };

        const handlePause = () => {
            /*
             * During crossfade the old deck
             * pauses intentionally.
             *
             * Do not change React state here
             * if the other deck is still playing.
             */
            const active =
                getActiveAudio();

            if (
                active &&
                !active.paused
            ) {
                return;
            }

            if (
                !crossfadingRef.current
            ) {
                setIsPlaying(false);
            }
        };

        const handleLoadedMetadata = () => {
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

        const handleEnded = () => {
            /*
             * Crossfade normally changes
             * the song before the actual
             * ended event.
             */
            if (
                crossfadingRef.current
            ) {
                return;
            }

            nextSong();
        };

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
            handleLoadedMetadata
        );

        audioB.addEventListener(
            "loadedmetadata",
            handleLoadedMetadata
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
                handleLoadedMetadata
            );

            audioB.removeEventListener(
                "loadedmetadata",
                handleLoadedMetadata
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

    /* ----------------------------------
       VOLUME

       Changing volume NEVER reloads
       the audio.
    ---------------------------------- */

    useEffect(() => {
        volumeRef.current =
            volume;

        const active =
            getActiveAudio();

        if (!active) {
            return;
        }

        /*
         * Only change the currently
         * audible deck.
         */
        if (
            !crossfadingRef.current
        ) {
            setDeckVolume(
                active,
                volume
            );
        }
    }, [volume]);

    /* ----------------------------------
       CROSSFADE
    ---------------------------------- */

    const crossfadeTo = (
        nextIndex: number,
        continuePlaying: boolean
    ) => {
        const active =
            getActiveAudio();

        const incoming =
            getInactiveAudio();

        if (!active || !incoming) {
            return;
        }

        stopFadeTimer();

        /*
         * If paused, simply load the next
         * song without starting playback.
         */
        if (!continuePlaying) {
            active.pause();
            incoming.pause();

            incoming.src =
                songs[nextIndex].src;

            incoming.load();

            setDeckVolume(
                incoming,
                volumeRef.current
            );

            activeDeckRef.current =
                activeDeckRef.current === "A"
                    ? "B"
                    : "A";

            const newActive =
                getActiveAudio();

            if (newActive) {
                newActive.pause();
                setDeckVolume(
                    newActive,
                    volumeRef.current
                );
            }

            setIndex(nextIndex);
            indexRef.current =
                nextIndex;

            setCurrentTime(0);
            setDuration(0);

            return;
        }

        /*
         * Prepare incoming song.
         */
        incoming.src =
            songs[nextIndex].src;

        incoming.load();

        setDeckVolume(
            incoming,
            0
        );

        crossfadingRef.current =
            true;

        /*
         * Start incoming song.
         *
         * Browser autoplay permission is
         * already granted because the user
         * is currently playing audio.
         */
        const incomingPlay =
            incoming.play();

        if (incomingPlay) {
            incomingPlay.catch((error) => {
                console.error(
                    "Crossfade play error:",
                    error
                );

                crossfadingRef.current =
                    false;
            });
        }

        const fadeDuration =
            Math.min(
                CROSSFADE_SECONDS,
                Number.isFinite(
                    active.duration
                ) &&
                    active.duration > 0
                    ? active.duration
                    : CROSSFADE_SECONDS
            );

        const steps = Math.max(
            1,
            Math.ceil(
                (fadeDuration * 1000) /
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

                const masterVolume =
                    volumeRef.current;

                /*
                 * Smooth linear crossfade.
                 */
                const outgoingVolume =
                    masterVolume *
                    (1 - progress);

                const incomingVolume =
                    masterVolume *
                    progress;

                setDeckVolume(
                    active,
                    outgoingVolume
                );

                setDeckVolume(
                    incoming,
                    incomingVolume
                );

                if (progress >= 1) {
                    stopFadeTimer();

                    active.pause();

                    active.currentTime = 0;

                    setDeckVolume(
                        active,
                        0
                    );

                    setDeckVolume(
                        incoming,
                        masterVolume
                    );

                    activeDeckRef.current =
                        activeDeckRef.current ===
                            "A"
                            ? "B"
                            : "A";

                    positionRef.current =
                        positionRef.current;

                    indexRef.current =
                        nextIndex;

                    setIndex(nextIndex);

                    setIsPlaying(true);

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

                    crossfadingRef.current =
                        false;
                }
            }, FADE_INTERVAL);
    };

    /* ----------------------------------
       FIND NEXT POSITION
    ---------------------------------- */

    const getNextPosition = () => {
        const playlist =
            playlistRef.current;

        if (!playlist.length) {
            return null;
        }

        let nextPosition =
            positionRef.current + 1;

        if (
            nextPosition >=
            playlist.length
        ) {
            const oldSong =
                playlist[
                positionRef.current
                ];

            const newPlaylist =
                shuffleArray(
                    songs.length
                );

            if (
                newPlaylist.length > 1 &&
                newPlaylist[0] === oldSong
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

            nextPosition = 0;
        }

        return nextPosition;
    };

    /* ----------------------------------
       NEXT
    ---------------------------------- */

    const nextSong = () => {
        if (
            crossfadingRef.current
        ) {
            return;
        }

        const playlist =
            playlistRef.current;

        if (!playlist.length) {
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

        const currentlyPlaying =
            !getActiveAudio()?.paused;

        indexRef.current =
            nextIndex;

        /*
         * Important:
         * Do NOT setIndex before crossfade.
         * The two audio decks need to overlap.
         */
        crossfadeTo(
            nextIndex,
            currentlyPlaying
        );
    };

    /* ----------------------------------
       PREVIOUS
    ---------------------------------- */

    const prevSong = () => {
        if (
            crossfadingRef.current
        ) {
            return;
        }

        const playlist =
            playlistRef.current;

        if (!playlist.length) {
            return;
        }

        let previousPosition =
            positionRef.current - 1;

        if (previousPosition < 0) {
            previousPosition =
                playlist.length - 1;
        }

        positionRef.current =
            previousPosition;

        const previousIndex =
            playlist[
            previousPosition
            ];

        const currentlyPlaying =
            !getActiveAudio()?.paused;

        indexRef.current =
            previousIndex;

        crossfadeTo(
            previousIndex,
            currentlyPlaying
        );
    };

    /* ----------------------------------
       PLAY / PAUSE
    ---------------------------------- */

    const togglePlay =
        async () => {
            const audio =
                getActiveAudio();

            if (!audio) {
                return;
            }

            try {
                if (audio.paused) {
                    await audio.play();

                    setIsPlaying(true);
                } else {
                    audio.pause();

                    setIsPlaying(false);
                }
            } catch (error) {
                if (
                    error instanceof
                    DOMException &&
                    error.name ===
                    "AbortError"
                ) {
                    return;
                }

                console.error(
                    "Play/Pause error:",
                    error
                );
            }
        };

    /* ----------------------------------
       SEEK
    ---------------------------------- */

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

    /* ----------------------------------
       CLEANUP
    ---------------------------------- */

    useEffect(() => {
        return () => {
            stopFadeTimer();

            audioARef.current?.pause();
            audioBRef.current?.pause();
        };
    }, []);

    /* ----------------------------------
       PROVIDER
    ---------------------------------- */

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
                preload="metadata"
            />

            {/* AUDIO DECK B */}
            <audio
                ref={audioBRef}
                data-alone-player="B"
                preload="metadata"
            />
        </PlayerContext.Provider>
    );
}

/* ----------------------------------
   HOOK
---------------------------------- */

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