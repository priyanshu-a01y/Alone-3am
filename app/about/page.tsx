"use client";

import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black px-6 pb-32 pt-40 text-white">

            <div className="mx-auto max-w-5xl">

                {/* Small intro */}
                <div className="mb-8">
                    <p
                        className="text-sm tracking-[0.35em] text-white/35"
                        style={{
                            fontFamily:
                                "'Noto Serif Devanagari', 'Nirmala UI', serif",
                        }}
                    >
                        एक छोटी सी जगह
                    </p>
                </div>

                {/* Main heading */}
                <h1
                    className="text-6xl font-semibold tracking-tight md:text-8xl"
                    style={{
                        fontFamily:
                            "'Noto Serif Devanagari', 'Nirmala UI', serif",
                    }}
                >
                    अकेले।
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/50 md:text-xl">
                    A quiet place for the hours when the world goes silent.
                </p>

                {/* Creator card */}
                <section className="mt-20 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl md:p-12">

                    <p className="text-xs uppercase tracking-[0.35em] text-white/35">
                        The person behind it
                    </p>

                    <h2 className="mt-5 text-3xl font-medium md:text-5xl">
                        Hi, I am Priyanshu.
                    </h2>

                    <p className="mt-6 max-w-2xl text-base leading-8 text-white/50 md:text-lg">
                        The creator of <span className="text-white/80">ALONE 3AM</span>.
                        <br />
                        I made this little corner for anyone who finds themselves
                        awake when everyone else is asleep.
                    </p>

                    <p
                        className="mt-8 text-2xl text-white/80"
                        style={{
                            fontFamily:
                                "'Noto Serif Devanagari', 'Nirmala UI', serif",
                        }}
                    >
                        कुछ रातें अकेले बिताने के लिए होती हैं।
                    </p>

                </section>

                {/* Links */}
                <section className="mt-8 grid gap-4 md:grid-cols-3">

                    <a
                        href="https://www.instagram.com/priyanshu.pp7?igsh=MWtsNGd2NGJtZm5iNw=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
                    >
                        <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                            Instagram
                        </p>

                        <p className="mt-3 text-lg text-white/80 transition group-hover:text-white">
                            @priyanshu.pp7
                        </p>
                    </a>

                    <a
                        href="https://youtube.com/@priyanshu-is-alive?si=5WT6Vs5t8eE7jv07"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
                    >
                        <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                            YouTube
                        </p>

                        <p className="mt-3 text-lg text-white/80 transition group-hover:text-white">
                            Priyanshu Is Alive
                        </p>
                    </a>

                    <a
                        href="https://www.instagram.com/_dear.light_?igsh=MXFkeWY3ZGx6N2ZoNg==&igsi=MXFkeWY3ZGx6N2ZoNg=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
                    >
                        <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                            Another little corner
                        </p>

                        <p className="mt-3 text-lg text-white/80 transition group-hover:text-white">
                            @_dear.light_
                        </p>
                    </a>

                </section>

                {/* Back */}
                <div className="mt-16">
                    <Link
                        href="/"
                        className="text-sm tracking-[0.2em] text-white/35 transition hover:text-white"
                    >
                        ← BACK TO THE NIGHT
                    </Link>
                </div>

            </div>

        </main>
    );
}