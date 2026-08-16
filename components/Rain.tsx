const rainDrops = Array.from({ length: 70 }, (_, index) => ({
    id: index,
    left: (index * 37 + 11) % 100,
    delay: (index % 11) * 0.43,
    duration: 5 + ((index * 7) % 40) / 10,
    opacity: 0.2 + ((index * 13) % 30) / 100,
}));

export default function Rain() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {rainDrops.map((drop) => (
                <span
                    key={drop.id}
                    className="rain-drop"
                    style={{
                        left: `${drop.left}%`,
                        animationDelay: `${drop.delay}s`,
                        animationDuration: `${drop.duration}s`,
                        opacity: drop.opacity,
                    }}
                />
            ))}
        </div>
    );
}
