"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

function getNightStatus() {
  const hour = new Date().getHours();

  if (hour >= 0 && hour < 4) return "AFTER MIDNIGHT";
  if (hour >= 4 && hour < 7) return "BEFORE SUNRISE";
  if (hour >= 19) return "LATE NIGHT";
  return "THE NIGHT IS WAITING";
}

export default function Home() {
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("AFTER MIDNIGHT");

  useEffect(() => {
    const update = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );

      setStatus(getNightStatus());
    };

    update();

    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="home-page relative min-h-[100svh] overflow-hidden bg-black text-white">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
          bg-no-repeat
          scale-[1.02]
        "
        style={{
          backgroundImage: "url('/quotes-bg.jpg')",
        }}
      />

      {/* Main darkness */}
      <div className="absolute inset-0 bg-black/62" />

      {/* Cinematic gradient */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-black/85
          via-black/30
          to-black
        "
      />

      {/* =====================================================
          AMBIENT LIGHT
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[34%]
          h-[520px]
          w-[520px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-slate-400/[0.055]
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-120px]
          top-[18%]
          h-[360px]
          w-[360px]
          rounded-full
          bg-indigo-400/[0.025]
          blur-[100px]
        "
      />

      {/* =====================================================
          GRAIN
      ===================================================== */}

      <div className="noise-overlay pointer-events-none absolute inset-0 z-[1]" />

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <div className="relative z-50">
        <Navbar />
      </div>

      {/* =====================================================
          STARS
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 z-[2]">
        {Array.from({ length: 55 }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${(i * 47) % 100}%`,
              top: `${(i * 67) % 78}%`,
              animationDelay: `${(i % 6) * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative
          z-10
          flex
          min-h-[100svh]
          flex-col
          items-center
          justify-center
          px-5
          pb-24
          pt-32
          text-center
        "
      >

        {/* =================================================
            LIVE STATUS
        ================================================= */}

        <div className="night-status mb-8">

          <span className="night-status-dot" />

          <span>{status}</span>

          <span className="night-status-line" />

          <span className="hidden sm:inline">
            ALONE 3AM
          </span>

        </div>

        {/* =================================================
            SMALL LABEL
        ================================================= */}

        <div className="mb-5 flex items-center gap-3">

          <span className="h-px w-8 bg-white/10" />

          <p className="text-[8px] uppercase tracking-[0.6em] text-white/25">
            THE HOURS BETWEEN
          </p>

          <span className="h-px w-8 bg-white/10" />

        </div>

        {/* =================================================
            MAIN TITLE
        ================================================= */}

        <div className="relative">

          {/* subtle glow behind title */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-40
              w-[420px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-white/[0.035]
              blur-[70px]
            "
          />

          <h1 className="home-title relative">

            <span className="home-title-main">
              ALONE
            </span>

            <span className="home-title-time">
              3AM
            </span>

          </h1>

        </div>

        {/* =================================================
            TITLE LINE
        ================================================= */}

        <div className="mt-6 flex items-center gap-3">

          <span className="h-px w-12 bg-white/[0.08]" />

          <span className="home-symbol">
            ·
          </span>

          <span className="h-px w-12 bg-white/[0.08]" />

        </div>

        {/* =================================================
            TAGLINE
        ================================================= */}

        <p className="mt-7 max-w-md text-sm leading-7 text-white/50 md:text-base">

          For anyone who finds peace
          <br className="sm:hidden" />
          {" "}after midnight.

        </p>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div
          className="
            mt-10
            flex
            w-full
            max-w-[470px]
            flex-col
            gap-3
            sm:flex-row
          "
        >

          {/* ENTER */}

          <Link
            href="/player"
            className="
              group
              relative
              flex
              flex-1
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-white/20
              bg-white/[0.08]
              px-8
              py-4
              text-[10px]
              font-medium
              tracking-[0.28em]
              text-white/80
              backdrop-blur-xl
              transition-all
              duration-500
              hover:border-white/40
              hover:bg-white
              hover:text-black
              hover:shadow-[0_0_50px_rgba(255,255,255,0.10)]
            "
          >

            <span className="relative z-10">
              ENTER THE NIGHT
            </span>

            <span
              className="
                ml-3
                translate-x-[-6px]
                opacity-0
                transition-all
                duration-500
                group-hover:translate-x-0
                group-hover:opacity-100
              "
            >
              →
            </span>

          </Link>

          {/* JOURNAL */}

          <Link
            href="/journal"
            className="
              flex
              flex-1
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.10]
              bg-black/25
              px-8
              py-4
              text-[10px]
              tracking-[0.28em]
              text-white/40
              backdrop-blur-xl
              transition-all
              duration-500
              hover:border-white/20
              hover:bg-white/[0.06]
              hover:text-white/75
            "
          >
            READ THE JOURNAL
          </Link>

        </div>

        {/* =================================================
            LOCAL TIME
        ================================================= */}

        <div className="mt-10">

          <div className="flex items-center justify-center gap-3">

            <span className="h-px w-8 bg-white/[0.07]" />

            <p className="text-[7px] uppercase tracking-[0.6em] text-white/20">
              LOCAL TIME
            </p>

            <span className="h-px w-8 bg-white/[0.07]" />

          </div>

          <p className="home-time mt-3">
            {time}
          </p>

          <div className="mt-2 flex items-center justify-center gap-2">

            <span className="h-1 w-1 animate-pulse rounded-full bg-white/40" />

            <span className="text-[7px] uppercase tracking-[0.4em] text-white/15">
              YOU ARE HERE
            </span>

          </div>

        </div>

        {/* =================================================
            BOTTOM HINT
        ================================================= */}

        <div
          className="
            absolute
            bottom-7
            left-1/2
            -translate-x-1/2
          "
        >

          <div className="flex flex-col items-center">

            <p className="text-[7px] tracking-[0.55em] text-white/15">
              STAY A WHILE
            </p>

            <div
              className="
                mt-3
                h-8
                w-px
                bg-gradient-to-b
                from-white/20
                to-transparent
              "
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          RAIN
      ===================================================== */}

      <div
        className="
          rain
          pointer-events-none
          fixed
          inset-0
          z-[3]
        "
      />

      {/* =====================================================
          BOTTOM VIGNETTE
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          z-30
          h-40
          bg-gradient-to-t
          from-black
          via-black/40
          to-transparent
        "
      />

    </main>
  );
}