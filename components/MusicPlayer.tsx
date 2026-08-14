"use client";

import { usePlayer } from "@/context/PlayerContext";

export default function MusicPlayer() {
    const {
        playlist,
        current,
        setCurrent,
        playing,
        setPlaying,
    } = usePlayer();

    const song = playlist[current];

    function nextSong() {
        setCurrent((prev) => (prev + 1) % playlist.length);
    }

    function prevSong() {
        setCurrent((prev) =>
            prev === 0 ? playlist.length - 1 : prev - 1
        );
    }

    return (
        <div>
            <h2>{song.title}</h2>
            <p>{song.artist}</p>

            <button onClick={prevSong}>◀</button>

            <button onClick={() => setPlaying(!playing)}>
                {playing ? "Pause" : "Play"}
            </button>

            <button onClick={nextSong}>▶</button>
        </div>
    );
}