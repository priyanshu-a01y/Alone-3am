"use client";

import { useEffect, useState } from "react";

export default function Stars() {
    const [stars, setStars] = useState<
        { left: number; top: number; size: number }[]
    >([]);

    useEffect(() => {
        const data = Array.from({ length: 120 }, () => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 3 + 1,
        }));

        setStars(data);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden">
            {stars.map((star, i) => (
                <span
                    key={i}
                    className="absolute rounded-full bg-white animate-pulse"
                    style={{
                        left: `${star.left}%`,
                        top: `${star.top}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                    }}
                />
            ))}
        </div>
    );
}