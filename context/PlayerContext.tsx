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
    togglePlay: () => Promise<void>;
    nextSong: () => void;
    prevSong: () => void;
    volume: number;
    setVolume: (value: number) => void;
};

const PlayerContext =
    createContext<PlayerContextType | null>(null);

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

    const playlistRef = useRef<number[]>([]);
    const positionRef = useRef(0);

    const initializedRef = useRef(false);
    const shouldPlayRef = useRef(false);
    const loadingSongRef = useRef(false);

    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] =
        useState(false);

    const [volume, setVolumeState] =
        useState(0.7);

    const currentSong = songs[index];

    /*
     * -----------------------------
     * INITIAL PLAYLIST
     * -----------------------------
     */

    useEffect(() => {
        if (initializedRef.current) return;

        initializedRef.current = true;

        const playlist =
            shuffleArray(songs.length);

        playlistRef.current = playlist;
        positionRef.current = 0;

        setIndex(playlist[0]);
    }, []);

    /*
     * -----------------------------
     * LOAD SONG
     * -----------------------------
     */

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        const src = songs[index]?.src;

        if (!src) return;

        loadingSongRef.current = true;

        audio.pause();

        audio.src = src;
        audio.volume = volume;

        const shouldPlay =
            shouldPlayRef.current;

        shouldPlayRef.current = false;

        const playWhenReady = async () => {
            if (!shouldPlay) {
                loadingSongRef.current = false;
                return;
            }

            try {
                await audio.play();
                setIsPlaying(true);
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                console.error(
                    "Audio play error:",
                    error
                );

                setIsPlaying(false);
            } finally {
                loadingSongRef.current = false;
            }
        };

        const handleCanPlay = () => {
            audio.removeEventListener(
                "canplay",
                handleCanPlay
            );

            void playWhenReady();
        };

        audio.addEventListener(
            "canplay",
            handleCanPlay
        );

        audio.load();

        /*
         * If browser already has enough data.
         */
        if (audio.readyState >= 3) {
            void playWhenReady();
        }

        return () => {
            audio.removeEventListener(
                "canplay",
                handleCanPlay
            );
        };
    }, [index, volume]);

    /*
     * -----------------------------
     * VOLUME
     * -----------------------------
     */

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    /*
     * -----------------------------
     * PLAY / PAUSE
     * -----------------------------
     */

    const togglePlay = async () => {
        const audio = audioRef.current;

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

    /*
     * -----------------------------
     * NEXT
     * -----------------------------
     */

    const nextSong = () => {
        const playlist = playlistRef.current;

        if (!playlist.length) return;

        let nextPosition =
            positionRef.current + 1;

        if (nextPosition >= playlist.length) {
            const oldSong =
                playlist[positionRef.current];

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
            playlistRef.current[nextPosition];

        /*
         * Tell loader to autoplay
         * after audio becomes ready.
         */
        shouldPlayRef.current = true;

        setIndex(nextIndex);
    };

    /*
     * -----------------------------
     * PREVIOUS
     * -----------------------------
     */

    const prevSong = () => {
        const playlist = playlistRef.current;

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
            playlist[previousPosition];

        shouldPlayRef.current = true;

        setIndex(previousIndex);
    };

    /*
     * -----------------------------
     * SONG ENDED
     * -----------------------------
     */

    const handleEnded = () => {
        nextSong();
    };

    /*
     * -----------------------------
     * AUDIO ERROR
     * -----------------------------
     */

    const handleAudioError = () => {
        console.error(
            "Audio failed to load:",
            songs[index]?.src
        );

        setIsPlaying(false);
        loadingSongRef.current = false;
    };

    /*
     * -----------------------------
     * PROVIDER
     * -----------------------------
     */

    return (
        <PlayerContext.Provider
            value={{
                currentSong,
                isPlaying,
                togglePlay,
                nextSong,
                prevSong,
                volume,
                setVolume: setVolumeState,
            }}
        >
            {children}

            <audio
                ref={audioRef}
                preload="auto"
                onPlay={() => {
                    setIsPlaying(true);
                }}
                onPause={() => {
                    setIsPlaying(false);
                }}
                onEnded={handleEnded}
                onError={handleAudioError}
            />
        </PlayerContext.Provider>
    );
}

/*
 * -----------------------------
 * HOOK
 * -----------------------------
 */

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