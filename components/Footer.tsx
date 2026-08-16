import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black px-6 py-12 text-white">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row">

                <Link href="/" className="text-center md:text-left">
                    <p className="text-xl font-bold tracking-[0.3em]">
                        ALONE
                    </p>

                    <p
                        className="mt-1 text-sm text-white/40"
                        style={{
                            fontFamily:
                                "'Noto Serif Devanagari', 'Nirmala UI', serif",
                        }}
                    >
                        अकेले।
                    </p>
                </Link>

                <div className="flex gap-6 text-sm text-white/40">
                    <Link
                        href="/quotes"
                        className="transition hover:text-white"
                    >
                        ख़याल
                    </Link>

                    <Link
                        href="/journal"
                        className="transition hover:text-white"
                    >
                        डायरी
                    </Link>

                    <Link
                        href="/about"
                        className="transition hover:text-white"
                    >
                        कहानी
                    </Link>
                </div>

                <p className="text-xs text-white/25">
                    Made after midnight · © 2026
                </p>

            </div>
        </footer>
    );
}