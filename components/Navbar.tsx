"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
    { href: "/", en: "Home", hi: "घर" },
    { href: "/player", en: "Listen", hi: "सुनो" },
    { href: "/quotes", en: "Thoughts", hi: "ख़याल" },
    { href: "/journal", en: "Journal", hi: "डायरी" },
    { href: "/about", en: "About", hi: "हम" },
];

function MoonMark() {
    return (
        <span
            className="
                relative
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                sm:h-10
                sm:w-10
            "
        >
            {/* orbit */}

            <span
                className="
                    absolute
                    inset-1
                    rounded-full
                    border
                    border-white/[0.12]
                    rotate-[-25deg]
                "
            />

            {/* crescent */}

            <span
                className="
                    relative
                    h-5
                    w-5
                    overflow-hidden
                    rounded-full
                    bg-white
                    shadow-[0_0_18px_rgba(255,255,255,0.18)]
                "
            >
                <span
                    className="
                        absolute
                        -right-[4px]
                        -top-[2px]
                        h-5
                        w-5
                        rounded-full
                        bg-black
                    "
                />
            </span>

            {/* tiny star */}

            <span
                className="
                    absolute
                    right-0
                    top-0
                    h-1
                    w-1
                    rounded-full
                    bg-white/70
                    shadow-[0_0_8px_rgba(255,255,255,0.7)]
                "
            />
        </span>
    );
}

export default function Navbar() {
    const pathname = usePathname();

    const [scrolled, setScrolled] =
        useState(false);

    const [mobileOpen, setMobileOpen] =
        useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(
                window.scrollY > 20
            );
        };

        handleScroll();

        window.addEventListener(
            "scroll",
            handleScroll,
            { passive: true }
        );

        return () =>
            window.removeEventListener(
                "scroll",
                handleScroll
            );
    }, []);

    /*
     * Close mobile menu when route changes.
     */

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    /*
     * Prevent background scrolling
     * while mobile menu is open.
     */

    useEffect(() => {
        if (!mobileOpen) {
            document.body.style.overflow = "";
            return;
        }

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    return (
        <>
            {/* =====================================================
                DESKTOP / TABLET NAVBAR
            ===================================================== */}

            <header
                className={`
                    fixed
                    left-1/2
                    z-[100]
                    -translate-x-1/2
                    transition-all
                    duration-500
                    ${scrolled
                        ? "top-3 w-[92%] max-w-5xl"
                        : "top-5 w-[94%] max-w-6xl"
                    }
                `}
            >
                <div
                    className={`
                        relative
                        overflow-hidden
                        rounded-full
                        border
                        border-white/[0.10]
                        bg-black/45
                        backdrop-blur-2xl
                        transition-all
                        duration-500
                        ${scrolled
                            ? "shadow-[0_15px_60px_rgba(0,0,0,0.45)]"
                            : "shadow-[0_10px_50px_rgba(0,0,0,0.30)]"
                        }
                    `}
                >
                    {/* subtle moving highlight */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-gradient-to-r
                            from-transparent
                            via-white/[0.045]
                            to-transparent
                            opacity-70
                        "
                    />

                    <div
                        className="
                            relative
                            flex
                            h-[58px]
                            items-center
                            px-3
                            sm:h-[64px]
                            sm:px-5
                            md:h-[68px]
                            md:px-6
                        "
                    >

                        {/* =================================================
                            LOGO
                        ================================================= */}

                        <Link
                            href="/"
                            className="
                                group
                                flex
                                shrink-0
                                items-center
                                gap-2.5
                                sm:gap-3
                            "
                        >
                            <MoonMark />

                            <div className="leading-none">

                                <div className="flex items-baseline gap-1">

                                    <span
                                        className="
                                            text-[15px]
                                            font-semibold
                                            tracking-[0.22em]
                                            text-white
                                            sm:text-[17px]
                                        "
                                    >
                                        ALONE
                                    </span>

                                    <span
                                        className="
                                            text-[8px]
                                            font-medium
                                            tracking-[0.12em]
                                            text-white/25
                                        "
                                    >
                                        3AM
                                    </span>

                                </div>

                                <p
                                    className="
                                        mt-1
                                        text-[7px]
                                        tracking-[0.22em]
                                        text-white/30
                                    "
                                    style={{
                                        fontFamily:
                                            "'Noto Serif Devanagari', serif",
                                    }}
                                >
                                    अकेले।
                                </p>

                            </div>
                        </Link>

                        {/* =================================================
                            DESKTOP MENU
                        ================================================= */}

                        <nav
                            className="
                                ml-auto
                                hidden
                                items-center
                                gap-1
                                md:flex
                            "
                        >
                            {links.map((item) => {
                                const active =
                                    pathname ===
                                    item.href;

                                return (
                                    <Link
                                        key={
                                            item.href
                                        }
                                        href={
                                            item.href
                                        }
                                        className={`
                                            group
                                            relative
                                            flex
                                            min-w-[72px]
                                            flex-col
                                            items-center
                                            justify-center
                                            rounded-full
                                            px-3
                                            py-2
                                            transition-all
                                            duration-300
                                            ${active
                                                ? "text-white"
                                                : "text-white/45 hover:text-white/85"
                                            }
                                        `}
                                    >

                                        {/* active glow */}

                                        {active && (
                                            <span
                                                className="
                                                    absolute
                                                    inset-1
                                                    -z-10
                                                    rounded-full
                                                    bg-white/[0.07]
                                                    shadow-[inset_0_0_20px_rgba(255,255,255,0.025)]
                                                "
                                            />
                                        )}

                                        <span
                                            className="
                                                text-[10px]
                                                font-medium
                                                tracking-[0.08em]
                                            "
                                        >
                                            {item.en}
                                        </span>

                                        <span
                                            className="
                                                mt-0.5
                                                text-[7px]
                                                text-white/30
                                                transition
                                                group-hover:text-white/45
                                            "
                                            style={{
                                                fontFamily:
                                                    "'Noto Serif Devanagari', serif",
                                            }}
                                        >
                                            {item.hi}
                                        </span>

                                        {/* active line */}

                                        <span
                                            className={`
                                                absolute
                                                bottom-[5px]
                                                h-[2px]
                                                rounded-full
                                                bg-white
                                                transition-all
                                                duration-300
                                                ${active
                                                    ? "w-5 opacity-80"
                                                    : "w-0 opacity-0"
                                                }
                                            `}
                                        />

                                    </Link>
                                );
                            })}
                        </nav>

                        {/* =================================================
                            MOBILE MENU BUTTON
                        ================================================= */}

                        <button
                            type="button"
                            onClick={() =>
                                setMobileOpen(
                                    !mobileOpen
                                )
                            }
                            aria-label={
                                mobileOpen
                                    ? "Close menu"
                                    : "Open menu"
                            }
                            aria-expanded={
                                mobileOpen
                            }
                            className="
                                ml-auto
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/10
                                bg-white/[0.03]
                                transition
                                active:scale-90
                                md:hidden
                            "
                        >
                            <span className="relative h-3.5 w-4">

                                <span
                                    className={`
                                        absolute
                                        left-0
                                        top-0
                                        h-px
                                        w-4
                                        bg-white/70
                                        transition-all
                                        duration-300
                                        ${mobileOpen
                                            ? "top-[6px] rotate-45"
                                            : ""
                                        }
                                    `}
                                />

                                <span
                                    className={`
                                        absolute
                                        left-0
                                        top-[6px]
                                        h-px
                                        w-3
                                        bg-white/50
                                        transition-all
                                        duration-300
                                        ${mobileOpen
                                            ? "opacity-0"
                                            : "opacity-100"
                                        }
                                    `}
                                />

                                <span
                                    className={`
                                        absolute
                                        left-0
                                        top-3
                                        h-px
                                        w-4
                                        bg-white/70
                                        transition-all
                                        duration-300
                                        ${mobileOpen
                                            ? "top-[6px] -rotate-45"
                                            : ""
                                        }
                                    `}
                                />

                            </span>
                        </button>

                    </div>
                </div>
            </header>

            {/* =========================================================
                MOBILE FULLSCREEN MENU
            ========================================================= */}

            <div
                className={`
                    fixed
                    inset-0
                    z-[90]
                    bg-black/95
                    backdrop-blur-3xl
                    transition-all
                    duration-500
                    md:hidden
                    ${mobileOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                    }
                `}
            >

                {/* ambient glow */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-[30%]
                        h-80
                        w-80
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-white/[0.025]
                        blur-[100px]
                    "
                />

                <div className="flex h-full flex-col items-center justify-center px-8">

                    {/* branding */}

                    <div
                        className={`
                            mb-12
                            flex
                            flex-col
                            items-center
                            transition-all
                            duration-700
                            ${mobileOpen
                                ? "translate-y-0 opacity-100"
                                : "translate-y-5 opacity-0"
                            }
                        `}
                    >
                        <MoonMark />

                        <p
                            className="
                                mt-3
                                text-[11px]
                                font-medium
                                tracking-[0.4em]
                                text-white
                            "
                        >
                            ALONE 3AM
                        </p>

                        <p
                            className="
                                mt-2
                                text-[7px]
                                uppercase
                                tracking-[0.45em]
                                text-white/20
                            "
                        >
                            THE NIGHT IS QUIET
                        </p>
                    </div>

                    {/* links */}

                    <nav className="flex flex-col items-center gap-5">

                        {links.map(
                            (
                                item,
                                index
                            ) => {
                                const active =
                                    pathname ===
                                    item.href;

                                return (
                                    <Link
                                        key={
                                            item.href
                                        }
                                        href={
                                            item.href
                                        }
                                        className={`
                                            group
                                            flex
                                            items-center
                                            gap-4
                                            transition-all
                                            duration-500
                                            ${mobileOpen
                                                ? "translate-y-0 opacity-100"
                                                : "translate-y-6 opacity-0"
                                            }
                                        `}
                                        style={{
                                            transitionDelay:
                                                mobileOpen
                                                    ? `${120 + index * 55}ms`
                                                    : "0ms",
                                        }}
                                    >

                                        <span
                                            className={`
                                                text-2xl
                                                font-medium
                                                tracking-tight
                                                ${active
                                                    ? "text-white"
                                                    : "text-white/35 group-hover:text-white"
                                                }
                                            `}
                                        >
                                            {
                                                item.en
                                            }
                                        </span>

                                        <span
                                            className="
                                                text-xs
                                                text-white/20
                                            "
                                            style={{
                                                fontFamily:
                                                    "'Noto Serif Devanagari', serif",
                                            }}
                                        >
                                            {
                                                item.hi
                                            }
                                        </span>

                                        {active && (
                                            <span className="h-1 w-1 rounded-full bg-white shadow-[0_0_10px_white]" />
                                        )}

                                    </Link>
                                );
                            }
                        )}

                    </nav>

                    {/* bottom text */}

                    <p
                        className="
                            absolute
                            bottom-10
                            text-[7px]
                            uppercase
                            tracking-[0.55em]
                            text-white/15
                        "
                    >
                        SOMEWHERE IN THE NIGHT
                    </p>

                </div>
            </div>
        </>
    );
}