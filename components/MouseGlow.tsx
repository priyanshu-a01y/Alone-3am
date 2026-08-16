"use client";

import { useEffect, useState } from "react";

export default function MouseGlow() {
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const move = (e: MouseEvent) => {
            setPos({
                x: e.clientX,
                y: e.clientY,
            });
        };

        window.addEventListener("mousemove", move);

        return () => window.removeEventListener("mousemove", move);
    }, []);

    return (
        <div
            className="pointer-events-none fixed z-0 h-[350px] w-[350px] rounded-full blur-3xl transition-all duration-300"
            style={{
                left: pos.x - 175,
                top: pos.y - 175,
                background:
                    "radial-gradient(circle, rgba(255,255,255,.08), transparent 70%)",
            }}
        />
    );
}