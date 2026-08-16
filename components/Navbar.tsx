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

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500
      ${scrolled
                    ? "top-3 w-[92%] max-w-6xl scale-[0.97]"
                    : "top-6 w-[96%] max-w-7xl"
                }`}
        >
            <div
                className="
        relative
        overflow-hidden
        rounded-full
        border border-white/10
        bg-black/40
        backdrop-blur-3xl
        shadow-[0_0_60px_rgba(255,255,255,0.05)]
        transition-all
        duration-500
        "
            >
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-60" />

                <div className="relative flex items-center justify-between px-8 py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-4 group">
                        <span className="text-3xl transition duration-500 group-hover:rotate-12 group-hover:scale-110">
                            🌙
                        </span>

                        <div>
                            <h1 className="text-xl font-black tracking-[10px] text-white">
                                ALONE
                            </h1>

                            <p
                                className="text-xs text-white/50"
                                style={{
                                    fontFamily: "'Noto Serif Devanagari', serif",
                                }}
                            >
                                अकेले।
                            </p>
                        </div>
                    </Link>

                    {/* Menu */}
                    <nav className="flex items-center gap-3">
                        {links.map((item) => {
                            const active = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                  relative
                  rounded-full
                  px-5
                  py-3
                  transition-all
                  duration-300
                  ${active
                                            ? "bg-white/10 text-white shadow-lg"
                                            : "text-white/60 hover:bg-white/5 hover:text-white"
                                        }
                `}
                                >
                                    <div className="text-center">
                                        <p className="text-sm font-medium">{item.en}</p>

                                        <p
                                            className="text-[10px] text-white/45"
                                            style={{
                                                fontFamily: "'Noto Serif Devanagari', serif",
                                            }}
                                        >
                                            {item.hi}
                                        </p>
                                    </div>

                                    {active && (
                                        <span className="absolute left-1/2 bottom-1 h-1 w-8 -translate-x-1/2 rounded-full bg-white" />
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