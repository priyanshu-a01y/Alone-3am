"use client";

import { useRef, useEffect } from "react";

export default function GlobalPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 0.7;
    }, []);

    return (
        <audio
            ref={audioRef}
            id="global-audio"
            src="/music/after-midnight.mp3"
            preload="auto"
        />
    );
}