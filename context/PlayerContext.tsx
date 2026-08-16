"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import { songs } from "@/data/song";

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

export function PlayerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const audioRef =
        useRef<HTMLAudioElement>(null);

    const playlistRef =
        useRef<number[]>([]);

    const positionRef =
        useRef(0);

    const initializedRef =
        useRef(false);

    const shouldPlayRef =
        useRef(false);

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

    /* ----------------------------------
       INITIALIZE PLAYLIST
    ---------------------------------- */

    useEffect(() => {
        if (initializedRef.current) return;

        initializedRef.current = true;

        const playlist =
            shuffleArray(songs.length);

        playlistRef.current =
            playlist;

        positionRef.current = 0;

        setIndex(playlist[0]);
    }, []);

    /* ----------------------------------
       LOAD SONG
    ---------------------------------- */

    useEffect(() => {
        const audio =
            audioRef.current;

        if (!audio) return;

        const src =
            songs[index]?.src;

        if (!src) return;

        audio.pause();

        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);

        audio.src = src;
        audio.volume = volume;

        /*
         * load() starts loading the new
         * audio without waiting for
         * duration before play().
         */
        audio.load();

        if (shouldPlayRef.current) {
            shouldPlayRef.current = false;

            /*
             * Calling play immediately after
             * changing the source allows the
             * browser to handle loading itself.
             */
            const promise =
                audio.play();

            if (promise) {
                promise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((error) => {
                        if (
                            error?.name !==
                            "AbortError"
                        ) {
                            console.error(
                                "Next song play error:",
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
        const audio =
            audioRef.current;

        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(
                audio.currentTime || 0
            );
        };

        const handleLoadedMetadata = () => {
            if (
                Number.isFinite(audio.duration)
            ) {
                setDuration(audio.duration);
            }
        };

        const handleDurationChange = () => {
            if (
                Number.isFinite(audio.duration)
            ) {
                setDuration(audio.duration);
            }
        };

        const handleLoadedData = () => {
            if (
                Number.isFinite(audio.duration)
            ) {
                setDuration(audio.duration);
            }
        };

        const handlePlay = () => {
            setIsPlaying(true);
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        const handleEnded = () => {
            nextSong();
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
            "durationchange",
            handleDurationChange
        );

        audio.addEventListener(
            "loadeddata",
            handleLoadedData
        );

        audio.addEventListener(
            "play",
            handlePlay
        );

        audio.addEventListener(
            "pause",
            handlePause
        );

        audio.addEventListener(
            "ended",
            handleEnded
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
                "durationchange",
                handleDurationChange
            );

            audio.removeEventListener(
                "loadeddata",
                handleLoadedData
            );

            audio.removeEventListener(
                "play",
                handlePlay
            );

            audio.removeEventListener(
                "pause",
                handlePause
            );

            audio.removeEventListener(
                "ended",
                handleEnded
            );
        };
    }, []);

    /* ----------------------------------
       VOLUME
  
       IMPORTANT:
       Changing volume must NOT reload
       the audio.
    ---------------------------------- */

    useEffect(() => {
        const audio =
            audioRef.current;

        if (!audio) return;

        audio.volume = volume;
    }, [volume]);

    /* ----------------------------------
       PLAY / PAUSE
    ---------------------------------- */

    const togglePlay = async () => {
        const audio =
            audioRef.current;

        if (!audio) return;

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
                error instanceof DOMException &&
                error.name === "AbortError"
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
       NEXT
    ---------------------------------- */

    const nextSong = () => {
        const playlist =
            playlistRef.current;

        if (!playlist.length) return;

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
                shuffleArray(songs.length);

            /*
             * Prevent immediate repeat.
             */
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

        positionRef.current =
            nextPosition;

        const nextIndex =
            playlistRef.current[
            nextPosition
            ];

        /*
         * Next was manually pressed,
         * therefore keep playing.
         */
        shouldPlayRef.current = true;

        setIndex(nextIndex);
    };

    /* ----------------------------------
       PREVIOUS
    ---------------------------------- */

    const prevSong = () => {
        const playlist =
            playlistRef.current;

        if (!playlist.length) return;

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

        shouldPlayRef.current = true;

        setIndex(previousIndex);
    };

    /* ----------------------------------
       SEEK
    ---------------------------------- */

    const seek = (value: number) => {
        const audio =
            audioRef.current;

        if (!audio) return;

        if (
            !Number.isFinite(audio.duration) ||
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

            <audio
                ref={audioRef}
                data-alone-player="true"
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