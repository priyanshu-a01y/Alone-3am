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

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () =>
            window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-500
        ${scrolled
                    ? "top-3 w-[94%] max-w-6xl"
                    : "top-5 w-[96%] max-w-7xl"
                }`}
        >
            <div
                className="
          relative overflow-hidden
          rounded-full
          border border-white/10
          bg-black/45
          backdrop-blur-3xl
          shadow-[0_0_60px_rgba(255,255,255,0.05)]
        "
            >
                {/* Glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                <div
                    className="
            relative flex items-center
            px-3 py-2
            sm:px-6 sm:py-3
            md:px-8 md:py-4
          "
                >
                    {/* LOGO */}
                    <Link
                        href="/"
                        className="group flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4"
                    >
                        <span className="text-2xl transition duration-500 group-hover:rotate-12 sm:text-3xl">
                            🌙
                        </span>

                        <div>
                            <h1
                                className="
                  text-sm font-black tracking-[4px]
                  text-white
                  sm:text-lg sm:tracking-[7px]
                  md:text-xl md:tracking-[10px]
                "
                            >
                                ALONE
                            </h1>

                            <p
                                className="text-[8px] text-white/50 sm:text-[10px]"
                                style={{
                                    fontFamily:
                                        "'Noto Serif Devanagari', serif",
                                }}
                            >
                                अकेले।
                            </p>
                        </div>
                    </Link>

                    {/* MENU */}
                    <nav
                        className="
              ml-auto flex items-center
              gap-0.5
              sm:gap-1
              md:gap-3
            "
                    >
                        {links.map((item) => {
                            const active = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    relative shrink-0
                    rounded-full
                    px-2 py-2
                    sm:px-3 sm:py-2.5
                    md:px-5 md:py-3
                    transition-all duration-300
                    ${active
                                            ? "bg-white/10 text-white shadow-lg"
                                            : "text-white/60 hover:bg-white/5 hover:text-white"
                                        }
                  `}
                                >
                                    <div className="text-center">
                                        <p
                                            className="
                        text-[9px] font-medium
                        sm:text-[11px]
                        md:text-sm
                      "
                                        >
                                            {item.en}
                                        </p>

                                        <p
                                            className="
                        text-[7px] text-white/45
                        sm:text-[8px]
                        md:text-[10px]
                      "
                                            style={{
                                                fontFamily:
                                                    "'Noto Serif Devanagari', serif",
                                            }}
                                        >
                                            {item.hi}
                                        </p>
                                    </div>

                                    {active && (
                                        <span
                                            className="
                        absolute bottom-1 left-1/2
                        h-0.5 w-5
                        -translate-x-1/2
                        rounded-full bg-white
                        sm:h-1 sm:w-7
                      "
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </header>
    );
}