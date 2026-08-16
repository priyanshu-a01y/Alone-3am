"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [time, setTime] =
    useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      );
    };

    updateTime();

    const timer =
      setInterval(
        updateTime,
        1000
      );

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <main
      className="
        relative
        min-h-[100svh]
        overflow-hidden
        bg-black
        text-white
      "
    >
      {/* BACKGROUND */}

      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage:
            "url('/quotes-bg.jpg')",
        }}
      />

      {/* DARKNESS */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-black/65
        "
      />

      {/* TOP / BOTTOM GRADIENT */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-b
          from-black/80
          via-transparent
          to-black
        "
      />

      {/* NIGHT LIGHT */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
        "
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(45, 60, 100, 0.25), transparent 55%)",
        }}
      />

      {/* NAVBAR */}

      <div className="relative z-50">
        <Navbar />
      </div>

      {/* STARS */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[2]
        "
      >
        {Array.from({
          length: 70,
        }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left:
                `${(i * 47) % 100}%`,
              top:
                `${(i * 67) % 75}%`,
              animationDelay:
                `${(i % 6) * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* HERO */}

      <section
        className="
          relative
          z-10
          flex
          min-h-[100svh]
          flex-col
          items-center
          justify-center
          px-6
          pb-24
          pt-28
          text-center
        "
      >
        {/* STATUS */}

        <div
          className="
            mb-8
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-black/30
            px-4
            py-2
            backdrop-blur-md
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              animate-pulse
              rounded-full
              bg-white
              shadow-[0_0_10px_white]
            "
          />

          <span
            className="
              text-[9px]
              tracking-[0.3em]
              text-white/45
            "
          >
            THE NIGHT IS QUIET
          </span>
        </div>

        {/* SMALL HEADING */}

        <p
          className="
            mb-5
            text-[9px]
            uppercase
            tracking-[0.5em]
            text-white/25
          "
        >
          AFTER MIDNIGHT
        </p>

        {/* TITLE */}

        <h1
          className="
            home-title
            text-5xl
            font-black
            tracking-[0.12em]
            drop-shadow-[0_0_35px_rgba(255,255,255,0.25)]
            sm:text-6xl
            sm:tracking-[0.16em]
            md:text-8xl
          "
        >
          ALONE 3AM
        </h1>

        {/* DIVIDER */}

        <div
          className="
            mt-7
            flex
            items-center
            gap-4
          "
        >
          <span className="h-px w-10 bg-white/10" />

          <span
            className="
              text-[8px]
              tracking-[0.45em]
              text-white/20
            "
          >
            THE HOURS BETWEEN
          </span>

          <span className="h-px w-10 bg-white/10" />
        </div>

        {/* TAGLINE */}

        <p
          className="
            mt-7
            max-w-lg
            text-sm
            leading-7
            text-white/55
            md:text-base
          "
        >
          For anyone who finds peace
          after midnight.
        </p>

        {/* BUTTONS */}

        <div
          className="
            mt-10
            flex
            flex-col
            items-center
            gap-3
            sm:flex-row
          "
        >
          <Link
            href="/player"
            className="
              rounded-full
              border
              border-white/20
              bg-white/[0.08]
              px-9
              py-3.5
              text-xs
              tracking-[0.2em]
              text-white/80
              backdrop-blur-md
              transition
              duration-500
              hover:scale-105
              hover:border-white/40
              hover:bg-white
              hover:text-black
            "
          >
            ENTER THE NIGHT
          </Link>

          <Link
            href="/journal"
            className="
              rounded-full
              border
              border-white/10
              bg-black/30
              px-8
              py-3.5
              text-xs
              tracking-[0.2em]
              text-white/45
              backdrop-blur-md
              transition
              duration-500
              hover:border-white/25
              hover:bg-white/[0.08]
              hover:text-white
            "
          >
            READ THE JOURNAL
          </Link>
        </div>

        {/* TIME */}

        <div className="mt-9">
          <p
            className="
              text-[8px]
              tracking-[0.55em]
              text-white/20
            "
          >
            LOCAL TIME
          </p>

          <p
            className="
              mt-2
              text-sm
              tracking-[0.3em]
              text-white/40
            "
          >
            {time}
          </p>
        </div>

        {/* BOTTOM HINT */}

        <div
          className="
            absolute
            bottom-7
            left-1/2
            -translate-x-1/2
          "
        >
          <p
            className="
              text-[8px]
              tracking-[0.5em]
              text-white/15
            "
          >
            STAY A WHILE
          </p>

          <div
            className="
              mx-auto
              mt-3
              h-7
              w-px
              bg-gradient-to-b
              from-white/20
              to-transparent
            "
          />
        </div>
      </section>

      {/* RAIN */}

      <div
        className="
          rain
          pointer-events-none
          fixed
          inset-0
          z-20
        "
      />

      {/* BOTTOM FADE */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          z-30
          h-32
          bg-gradient-to-t
          from-black
          to-transparent
        "
      />
    </main>
  );
}