import "./globals.css";
import type { Metadata } from "next";
import GlobalPlayer from "@/components/GlobalPlayer";

export const metadata: Metadata = {
  title: "ALONE 3AM",
  description: "For anyone who finds peace after midnight.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GlobalPlayer />
        {children}
      </body>
    </html>
  );
}
