import "./globals.css";
import type { Metadata } from "next";
import { PlayerProvider } from "@/context/PlayerContext";
export const metadata: Metadata = {
  title: "ALONE · 3AM",
  description: "Main website nahi, 3 baje raat ka mood."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PlayerProvider>
          {children}
        </PlayerProvider>
      </body>
    </html>
  );
}