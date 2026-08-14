"use client";

import { useState, useEffect } from "react";

export default function JournalPage() {
    const [text, setText] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("journal");
        if (saved) setText(saved);
    }, []);

    function save() {
        localStorage.setItem("journal", text);
        alert("Saved.");
    }

    return (
        <main
            className="min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: "url('/quotes-bg.jpg')" }}
        >
            <div className="w-full max-w-3xl rounded-2xl bg-black/70 p-8 backdrop-blur-md">
                <h1 className="mb-6 text-center text-4xl font-bold text-white">
                    3 AM Journal
                </h1>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write what you can't tell anyone..."
                    className="h-80 w-full rounded-xl bg-white/10 p-5 text-white outline-none"
                />

                <button
                    onClick={save}
                    className="mt-5 rounded-xl bg-white px-6 py-3 text-black font-semibold"
                >
                    Save
                </button>
            </div>
        </main>
    );
}