"use client";

import { useState } from "react";

const thoughts = [
    {
        hi: "कुछ रातें सिर्फ़ महसूस करने के लिए होती हैं।",
        en: "Some nights are meant to be felt, not understood.",
    },
    {
        hi: "ख़ामोशी भी कभी-कभी जवाब होती है।",
        en: "Silence can be an answer too.",
    },
    {
        hi: "हर अकेलापन उदासी नहीं होता।",
        en: "Not every solitude is sadness.",
    },
    {
        hi: "रात जितनी गहरी होती है, ख़याल उतने साफ़ होते हैं।",
        en: "The deeper the night, the clearer the thoughts.",
    },
    {
        hi: "कुछ बातें सिर्फ़ रात समझती है।",
        en: "Some things are understood only by the night.",
    },
];

export default function QuotesPage() {
    const [index, setIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [direction, setDirection] = useState<"next" | "prev">(
        "next"
    );

    const thought = thoughts[index];

    const goTo = (newIndex: number) => {
        setIndex(
            (newIndex + thoughts.length) %
            thoughts.length
        );
    };

    const nextThought = () => {
        setDirection("next");

        goTo(index + 1);
    };

    const previousThought = () => {
        setDirection("prev");

        goTo(index - 1);
    };

    const randomThought = () => {
        let random = Math.floor(
            Math.random() * thoughts.length
        );

        while (
            thoughts.length > 1 &&
            random === index
        ) {
            random = Math.floor(
                Math.random() * thoughts.length
            );
        }

        setDirection(
            random > index
                ? "next"
                : "prev"
        );

        setIndex(random);
    };

    const copyThought = async () => {
        try {
            await navigator.clipboard.writeText(
                `"${thought.hi}"\n${thought.en}`
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1800);
        } catch {
            setCopied(false);
        }
    };

    return (
        <main
            className="
                relative
                h-[100svh]
                w-full
                overflow-hidden
                bg-black
                text-white
            "
        >
            {/* =====================================================
                BACKGROUND
            ===================================================== */}

            <div
                className="
                    absolute
                    inset-0
                    scale-[1.03]
                    bg-cover
                    bg-center
                "
                style={{
                    backgroundImage:
                        "url('/quotes-bg.jpg')",
                }}
            />

            {/* Darkness */}

            <div
                className="
                    absolute
                    inset-0
                    bg-black/72
                "
            />

            {/* Cinematic gradient */}

            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-b
                    from-black/70
                    via-black/35
                    to-black
                "
            />

            {/* Center light */}

            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    h-[500px]
                    w-[500px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-white/[0.025]
                    blur-[120px]
                "
            />

            {/* =====================================================
                CONTENT
            ===================================================== */}

            <div
                className="
                    relative
                    z-10
                    flex
                    h-full
                    flex-col
                    items-center
                    px-5
                    pb-8
                    pt-32
                    sm:px-8
                    sm:pt-36
                "
            >

                {/* =================================================
                    TOP LABEL
                ================================================= */}

                <div className="shrink-0 text-center">

                    <p
                        className="
                            text-[9px]
                            uppercase
                            tracking-[0.6em]
                            text-white/35
                        "
                        style={{
                            fontFamily:
                                "'Noto Serif Devanagari', 'Nirmala UI', serif",
                        }}
                    >
                        रात के ख़याल
                    </p>

                    <div
                        className="
                            mt-3
                            flex
                            items-center
                            justify-center
                            gap-3
                        "
                    >

                        <span className="h-px w-8 bg-white/10" />

                        <span
                            className="
                                text-[8px]
                                tracking-[0.35em]
                                text-white/25
                            "
                        >
                            THOUGHTS
                        </span>

                        <span className="h-px w-8 bg-white/10" />

                    </div>

                </div>

                {/* =================================================
                    QUOTE AREA
                ================================================= */}

                <div
                    className="
                        flex
                        min-h-0
                        flex-1
                        w-full
                        items-center
                        justify-center
                    "
                >

                    <div
                        key={index}
                        className={`
                            w-full
                            max-w-5xl
                            text-center
                            ${direction === "next"
                                ? "thought-enter-next"
                                : "thought-enter-prev"
                            }
                        `}
                    >

                        {/* Counter */}

                        <p
                            className="
                                mb-7
                                text-[9px]
                                font-medium
                                tracking-[0.5em]
                                text-white/20
                            "
                        >
                            {String(
                                index + 1
                            ).padStart(2, "0")}
                            {" "}
                            /{" "}
                            {String(
                                thoughts.length
                            ).padStart(2, "0")}
                        </p>

                        {/* Hindi */}

                        <h1
                            className="
                                mx-auto
                                max-w-4xl
                                text-[2.35rem]
                                font-medium
                                leading-[1.35]
                                text-white
                                sm:text-5xl
                                md:text-6xl
                                lg:text-7xl
                            "
                            style={{
                                fontFamily:
                                    "'Noto Serif Devanagari', 'Nirmala UI', serif",
                            }}
                        >
                            “{thought.hi}”
                        </h1>

                        {/* English */}

                        <p
                            className="
                                mx-auto
                                mt-7
                                max-w-2xl
                                text-sm
                                font-light
                                leading-7
                                text-white/40
                                sm:text-base
                                md:text-lg
                            "
                        >
                            {thought.en}
                        </p>

                    </div>

                </div>

                {/* =================================================
                    CONTROLS
                ================================================= */}

                <div className="shrink-0">

                    {/* Progress */}

                    <div
                        className="
                            mb-6
                            flex
                            items-center
                            justify-center
                            gap-1.5
                        "
                    >
                        {thoughts.map(
                            (_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                        setDirection(
                                            i >
                                                index
                                                ? "next"
                                                : "prev"
                                        );

                                        setIndex(i);
                                    }}
                                    aria-label={`Go to thought ${i + 1
                                        }`}
                                    className={`
                                        h-[2px]
                                        rounded-full
                                        transition-all
                                        duration-500
                                        ${i ===
                                            index
                                            ? "w-8 bg-white/70"
                                            : "w-2 bg-white/15 hover:bg-white/35"
                                        }
                                    `}
                                />
                            )
                        )}
                    </div>

                    {/* Buttons */}

                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >

                        {/* Previous */}

                        <button
                            type="button"
                            onClick={
                                previousThought
                            }
                            aria-label="Previous thought"
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/10
                                bg-white/[0.025]
                                text-white/45
                                transition-all
                                duration-300
                                hover:border-white/20
                                hover:bg-white/[0.07]
                                hover:text-white
                                active:scale-90
                            "
                        >
                            ←
                        </button>

                        {/* Random */}

                        <button
                            type="button"
                            onClick={
                                randomThought
                            }
                            className="
                                flex
                                h-11
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-white/10
                                bg-white/[0.025]
                                px-5
                                text-[8px]
                                uppercase
                                tracking-[0.35em]
                                text-white/40
                                transition-all
                                duration-300
                                hover:border-white/20
                                hover:bg-white/[0.07]
                                hover:text-white
                                active:scale-95
                            "
                        >
                            <span className="text-sm">
                                ✦
                            </span>

                            RANDOM
                        </button>

                        {/* Copy */}

                        <button
                            type="button"
                            onClick={
                                copyThought
                            }
                            aria-label="Copy thought"
                            className="
                                flex
                                h-11
                                min-w-11
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/10
                                bg-white/[0.025]
                                px-4
                                text-[8px]
                                uppercase
                                tracking-[0.25em]
                                text-white/40
                                transition-all
                                duration-300
                                hover:border-white/20
                                hover:bg-white/[0.07]
                                hover:text-white
                                active:scale-95
                            "
                        >
                            {copied
                                ? "COPIED"
                                : "COPY"}
                        </button>

                        {/* Next */}

                        <button
                            type="button"
                            onClick={
                                nextThought
                            }
                            aria-label="Next thought"
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/10
                                bg-white/[0.025]
                                text-white/45
                                transition-all
                                duration-300
                                hover:border-white/20
                                hover:bg-white/[0.07]
                                hover:text-white
                                active:scale-90
                            "
                        >
                            →
                        </button>

                    </div>

                    {/* Footer */}

                    <p
                        className="
                            mt-5
                            text-center
                            text-[7px]
                            uppercase
                            tracking-[0.55em]
                            text-white/15
                        "
                    >
                        SOMEWHERE BETWEEN THOUGHT
                        AND SILENCE
                    </p>

                </div>

            </div>
        </main>
    );
}