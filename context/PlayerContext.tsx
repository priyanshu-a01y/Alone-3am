"use client";

import {
    createContext,
    useContext,
    useRef,
    useState,
    useEffect,
} from "react";

type Song = {
    title: string;
    artist: string;
    src: string;
};

const playlist: Song[] = [
    {
        title: "After Midnight",
        artist: "Navjot Ahuja",
        src: "/music/after-midnight.mp3",
    },
    {
        title: "Enna Sona",
        artist: "Arijit Singh",
        src: "/music/enna-sona.mp3",
    },
];

type PlayerContextType = {
    audio: React.RefObject<HTMLAudioElement | null>;
    playlist: Song[];
    current: number;
    setCurrent: React.Dispatch<React.SetStateAction<number>>;
    playing: boolean;
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const audio = useRef<HTMLAudioElement>(null);

    const [current, setCurrent] = useState(0);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        if (!audio.current) return;

        audio.current.src = playlist[current].src;

        if (playing) {
            audio.current.play();
        }
    }, [current]);

    useEffect(() => {
        if (!audio.current) return;

        if (playing) {
            audio.current.play();
        } else {
            audio.current.pause();
        }
    }, [playing]);

    return (
        <PlayerContext.Provider
            value={{
                audio,
                playlist,
                current,
                setCurrent,
                playing,
                setPlaying,
            }}
        >
            <audio ref={audio} preload="auto" />
            {children}
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