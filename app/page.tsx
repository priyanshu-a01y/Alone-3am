"use client";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* BACKGROUND */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/home-bg.jpg')",
        }}
      />
      <Navbar />
      {/* CINEMATIC DARKNESS */}
      <div className="fixed inset-0 bg-black/65" />

      {/* TOP DARK GRADIENT */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-transparent to-black" />

      {/* BLUE NIGHT LIGHT */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(45,60,100,0.25),transparent_55%)]" />

      {/* STARS */}
      <div className="stars fixed inset-0">

        {Array.from({ length: 70 }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${(i * 47) % 100}%`,
              top: `${(i * 67) % 75}%`,
              animationDelay: `${(i % 6) * 0.5}s`,
            }}
          />
        ))}

      </div>



      {/* HERO */}
      <section className="relative z-10 flex min-h-[calc(100vh-90px)] flex-col items-center justify-center px-6 pb-16 text-center">


        {/* STATUS */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 backdrop-blur-md">

          <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />

          <span className="text-[9px] tracking-[0.3em] text-white/45">
            THE NIGHT IS QUIET
          </span>

        </div>


        {/* MOON */}
        <div className="moon relative mb-9">

          <div className="absolute inset-0 rounded-full bg-white/20 blur-3xl" />

          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-white via-gray-200 to-gray-500 shadow-[0_0_90px_25px_rgba(255,255,255,0.18)] md:h-28 md:w-28">

            <div className="absolute left-5 top-7 h-4 w-4 rounded-full bg-gray-400/25" />

            <div className="absolute left-14 top-14 h-5 w-5 rounded-full bg-gray-500/20" />

            <div className="absolute left-8 top-17 h-3 w-3 rounded-full bg-gray-500/25" />

          </div>

        </div>


        {/* TITLE */}
        <h1 className="home-title text-5xl font-black tracking-[0.16em] drop-shadow-[0_0_35px_rgba(255,255,255,0.25)] sm:text-6xl md:text-8xl">

          ALONE 3AM

        </h1>


        {/* TAGLINE */}
        <p className="mt-7 max-w-lg text-sm leading-7 text-white/55 md:text-base">

          For anyone who finds peace after midnight.

        </p>


        {/* BUTTON */}
        <Link
          href="/player"
          className="group mt-10 rounded-full border border-white/20 bg-white/[0.08] px-9 py-3.5 text-xs tracking-[0.2em] text-white/80 backdrop-blur-md transition duration-500 hover:scale-105 hover:border-white/40 hover:bg-white hover:text-black"
        >
          ENTER THE NIGHT
        </Link>


        {/* TIME */}
        <div className="mt-8">

          <p className="text-[9px] tracking-[0.45em] text-white/25">
            LOCAL TIME
          </p>

          <p className="mt-2 text-sm tracking-[0.25em] text-white/40">
            {time}
          </p>

        </div>


      </section>


      {/* RAIN */}
      <div className="rain pointer-events-none fixed inset-0 z-20" />

    </main>
  );
}