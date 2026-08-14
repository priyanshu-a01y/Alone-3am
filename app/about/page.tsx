"use client";

import Link from "next/link";

export default function About() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-black text-white">

            {/* BACKGROUND */}
            <div
                className="fixed inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/player-bg.jpg')",
                }}
            />

            {/* DARK OVERLAY */}
            <div className="fixed inset-0 bg-black/85" />

            {/* NIGHT GLOW */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(40,55,90,0.25),transparent_60%)]" />


            {/* NAVBAR */}
            <nav className="relative z-20 flex items-center justify-between px-7 py-5 md:px-12">

                <Link
                    href="/"
                    className="text-sm font-bold tracking-[0.35em]"
                >
                    ALONE 3AM
                </Link>

                <Link
                    href="/"
                    className="text-xs text-white/40 transition hover:text-white"
                >
                    ← Home
                </Link>

            </nav>


            {/* CONTENT */}
            <section className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">

                <div className="w-full max-w-3xl text-center">

                    {/* LABEL */}

                    <p className="text-[10px] tracking-[0.5em] text-white/30">
                        AFTER MIDNIGHT
                    </p>


                    {/* TITLE */}

                    <h1 className="mt-5 text-5xl font-semibold tracking-[0.15em] md:text-7xl">
                        ALONE 3AM
                    </h1>


                    {/* INTRO */}

                    <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-white/45">
                        A quiet place for the hours when everyone else seems
                        to be asleep.
                    </p>


                    {/* STORY */}

                    <div className="mt-12 rounded-[28px] border border-white/10 bg-black/45 p-7 text-left shadow-2xl backdrop-blur-xl md:p-10">

                        <p className="text-xs tracking-[0.35em] text-white/25">
                            WHY THIS EXISTS
                        </p>

                        <p className="mt-6 leading-8 text-white/60">
                            Some nights feel different.
                        </p>

                        <p className="mt-5 leading-8 text-white/60">
                            The room gets quieter. The city slows down.
                            And somehow, the thoughts you've been avoiding
                            become impossible to ignore.
                        </p>

                        <p className="mt-5 leading-8 text-white/60">
                            ALONE 3AM is a small space built for those moments.
                            Put on some music. Read a thought. Write something.
                            Or simply stay here for a while.
                        </p>

                        <p className="mt-5 leading-8 text-white/60">
                            You don't have to explain anything here.
                        </p>

                    </div>


                    {/* FEATURES */}

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">

                        <Link
                            href="/player"
                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.08]"
                        >
                            <p className="text-lg">♫</p>

                            <p className="mt-3 text-xs tracking-[0.2em] text-white/70">
                                RADIO
                            </p>

                            <p className="mt-2 text-[10px] text-white/30">
                                Stay with the music.
                            </p>
                        </Link>


                        <Link
                            href="/quotes"
                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.08]"
                        >
                            <p className="text-lg">“</p>

                            <p className="mt-3 text-xs tracking-[0.2em] text-white/70">
                                THOUGHTS
                            </p>

                            <p className="mt-2 text-[10px] text-white/30">
                                Read what others feel.
                            </p>
                        </Link>


                        <Link
                            href="/journal"
                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.08]"
                        >
                            <p className="text-lg">✎</p>

                            <p className="mt-3 text-xs tracking-[0.2em] text-white/70">
                                JOURNAL
                            </p>

                            <p className="mt-2 text-[10px] text-white/30">
                                Write what you can't say.
                            </p>
                        </Link>

                    </div>


                    {/* FOOTER */}

                    <p className="mt-12 text-[9px] tracking-[0.4em] text-white/20">
                        FOR ANYONE WHO FINDS PEACE AFTER MIDNIGHT
                    </p>

                </div>

            </section>

        </main>
    );
}