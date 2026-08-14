"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
    { name: "Home", href: "/" },
    { name: "Radio", href: "/player" },
    { name: "Quotes", href: "/quotes" },
    { name: "Journal", href: "/journal" },
    { name: "About", href: "/about" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="fixed left-0 top-0 z-50 w-full px-6 py-5 md:px-12">

            <div className="mx-auto flex max-w-7xl items-center justify-between">

                {/* LOGO */}
                <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-bold tracking-[0.35em] text-white"
                >
                    ALONE 3AM
                </Link>

                {/* DESKTOP */}
                <div className="hidden items-center gap-8 md:flex">

                    {links.map((link) => {
                        const active = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-xs transition duration-300 ${active
                                        ? "text-white"
                                        : "text-white/40 hover:text-white"
                                    }`}
                            >
                                {link.name}

                                {active && (
                                    <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white" />
                                )}
                            </Link>
                        );
                    })}

                </div>

                {/* MOBILE BUTTON */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-md md:hidden"
                    aria-label="Open menu"
                >
                    {menuOpen ? "×" : "☰"}
                </button>

            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
                <div className="mx-auto mt-4 max-w-7xl rounded-2xl border border-white/10 bg-black/80 p-3 shadow-2xl backdrop-blur-xl md:hidden">

                    {links.map((link) => {
                        const active = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={`block rounded-xl px-4 py-3 text-sm transition ${active
                                        ? "bg-white/10 text-white"
                                        : "text-white/50 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}

                </div>
            )}

        </nav>
    );
}