export default function Rain() {
    const drops = Array.from({ length: 80 });

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {drops.map((_, i) => (
                <span
                    key={i}
                    className="absolute w-[1px] h-10 bg-white/20 animate-pulse"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                />
            ))}
        </div>
    );
}