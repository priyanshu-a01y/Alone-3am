"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import { songs } from "@/data/song";

type Song = (typeof songs)[number];

type PlayerContextType = {
    currentSong: Song;
    isPlaying: boolean;
    togglePlay: () => Promise<void>;
    nextSong: () => void;
    prevSong: () => void;
    volume: number;
    setVolume: (value: number) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

function createShuffle(length: number) {
    const order = Array.from({ length }, (_, index) => index);

    for (let index = order.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
    }

    return order;
}

function isExpectedPlaybackError(error: unknown) {
    return error instanceof DOMException && error.name === "AbortError";
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const shuffleRef = useRef<number[]>([]);
    const positionRef = useRef(0);
    const initializedRef = useRef(false);
    const wantsPlaybackRef = useRef(false);
    const playRequestRef = useRef(0);

    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(0.7);

    const currentSong = songs[index] ?? songs[0];

    useEffect(() => {
        if (initializedRef.current || songs.length === 0) return;

        initializedRef.current = true;
        shuffleRef.current = createShuffle(songs.length);
        positionRef.current = 0;
        setIndex(shuffleRef.current[0]);
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const requestId = ++playRequestRef.current;
        const shouldPlay = wantsPlaybackRef.current;

        audio.pause();
        audio.currentTime = 0;
        audio.src = currentSong.src;
        audio.load();

        if (!shouldPlay) return;

        void audio.play()
            .then(() => {
                if (playRequestRef.current === requestId) {
                    setIsPlaying(true);
                }
            })
            .catch((error: unknown) => {
                if (playRequestRef.current !== requestId || isExpectedPlaybackError(error)) {
                    return;
                }

                console.error("Audio play error:", error);
                setIsPlaying(false);
            });
    }, [currentSong.src]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) audio.volume = volume;
    }, [volume]);

    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        const requestId = ++playRequestRef.current;

        if (wantsPlaybackRef.current) {
            wantsPlaybackRef.current = false;
            audio.pause();
            setIsPlaying(false);
            return;
        }

        wantsPlaybackRef.current = true;

        try {
            await audio.play();

            if (playRequestRef.current === requestId) {
                setIsPlaying(true);
            }
        } catch (error) {
            if (playRequestRef.current !== requestId || isExpectedPlaybackError(error)) {
                return;
            }

            wantsPlaybackRef.current = false;
            console.error("Play/pause error:", error);
            setIsPlaying(false);
        }
    };

    const selectPosition = (nextPosition: number, autoplay = false) => {
        positionRef.current = nextPosition;
        wantsPlaybackRef.current = autoplay || !audioRef.current?.paused;
        setIndex(shuffleRef.current[nextPosition]);
    };

    const nextSong = (autoplay = false) => {
        if (shuffleRef.current.length === 0) return;

        let nextPosition = positionRef.current + 1;

        if (nextPosition >= shuffleRef.current.length) {
            const previousLast = shuffleRef.current.at(-1);
            const nextShuffle = createShuffle(songs.length);

            if (nextShuffle.length > 1 && nextShuffle[0] === previousLast) {
                [nextShuffle[0], nextShuffle[1]] = [nextShuffle[1], nextShuffle[0]];
            }

            shuffleRef.current = nextShuffle;
            nextPosition = 0;
        }

        selectPosition(nextPosition, autoplay);
    };

    const prevSong = () => {
        if (shuffleRef.current.length === 0) return;

        const previousPosition =
            positionRef.current === 0
                ? shuffleRef.current.length - 1
                : positionRef.current - 1;

        selectPosition(previousPosition);
    };

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
                data-alone-player
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => nextSong(true)}
            />
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);

    if (!context) {
        throw new Error("usePlayer must be used inside PlayerProvider");
    }

    return context;
}
