import MusicCard from "@/components/MusicCard";

export default function PlayerPage() {
    return (
        <main
            className="relative min-h-screen overflow-hidden bg-cover bg-center px-6 pb-40 pt-44 text-white"
            style={{
                backgroundImage: "url('/quotes-bg.jpg')",
            }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/75" />

            {/* Soft gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-6xl">

                <p
                    className="text-sm tracking-[0.45em] text-white/40"
                    style={{
                        fontFamily:
                            "'Noto Serif Devanagari', 'Nirmala UI', serif",
                    }}
                >
                    रात का संगीत
                </p>

                <h1
                    className="mt-3 text-7xl font-bold text-white md:text-9xl"
                    style={{
                        fontFamily:
                            "'Noto Serif Devanagari', 'Nirmala UI', serif",
                    }}
                >
                    सुनो।
                </h1>

                <p className="mt-5 max-w-lg text-base text-white/50">
                    Close your eyes.
                    <br />
                    Let the night play.
                </p>

                <MusicCard />

            </div>
        </main>
    );
}