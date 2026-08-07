import type React from "react";
import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/shared/footer";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

// Titres (`font-heading`). Le mono reste la police par défaut du site — voir
// `font-mono` sur `<body>` plus bas — Archivo et Plex Sans ne s'appliquent
// qu'aux titres et au texte courant explicitement marqués comme tels.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-archivo",
});

// Texte courant (`font-text`).
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  title: "Yoann Corgnet",
  description:
    "Portfolio de développeur full-stack orienté backend - Performance, fiabilité et architecture propre",
  // Ordered from best to last resort: a browser that understands SVG takes the
  // first entry and never rasterises anything. The .ico is only there for the
  // ones that still ask for /favicon.ico by name.
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48 32x32 16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${jetbrainsMono.variable} ${archivo.variable} ${ibmPlexSans.variable}`}
    >
      <body className="font-mono antialiased">
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
