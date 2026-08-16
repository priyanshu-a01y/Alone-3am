import "./globals.css";
import type { Metadata } from "next";

import { PlayerProvider } from "@/context/PlayerContext";
import MiniPlayer from "@/components/MiniPlayer";

export const metadata: Metadata = {
  title: "ALONE · 3AM",
  description: "कुछ रातें सिर्फ़ महसूस करने के लिए होती हैं।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <PlayerProvider>
          {children}

          <MiniPlayer />
        </PlayerProvider>
      </body>
    </html>
  );
}