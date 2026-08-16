const stars = Array.from({ length: 120 }, (_, index) => ({
    id: index,
    size: 1 + ((index * 7) % 20) / 10,
    left: (index * 47 + 13) % 100,
    top: (index * 67 + 7) % 100,
    opacity: 0.2 + ((index * 19) % 70) / 100,
    duration: 2 + ((index * 11) % 40) / 10,
}));

export default function Stars() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {stars.map((star) => (
                <span
                    key={star.id}
                    className="absolute animate-pulse rounded-full bg-white"
                    style={{
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        left: `${star.left}%`,
                        top: `${star.top}%`,
                        opacity: star.opacity,
                        animationDuration: `${star.duration}s`,
                    }}
                />
            ))}
        </div>
    );
}
