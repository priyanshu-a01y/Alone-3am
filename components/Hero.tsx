import Link from "next/link";

export default function Hero() {
    return (
        <section className="flex min-h-screen flex-col items-center justify-center text-center text-white">

            <h1 className="text-7xl font-black tracking-[12px]">
                ALONE 3AM
            </h1>

            <p className="mt-6 max-w-xl text-xl text-white/70">
                For anyone who finds peace after midnight.
            </p>

            <Link
                href="/player"
                className="mt-12 rounded-full border border-white/30 px-10 py-4 transition hover:bg-white hover:text-black"
            >
                Enter the Night
            </Link>

        </section>
    );
}