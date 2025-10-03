import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../components/AuthProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Trivib - Battle Trivia Game by Zefra",
  description: "Join Trivib, the ultimate trivia battle game where knowledge meets competition. Play, challenge friends, earn, and dominate the leaderboard!",
  keywords: "trivia, quiz game, battle trivia, multiplayer quiz, Zefra, Trivib",
  authors: [{ name: "Zefra Global LTD", url: "https://trivib.app" }],
  metadataBase: new URL("https://trivib.app"),
  openGraph: {
    title: "Trivib - Ultimate Trivia Battle",
    description: "Compete in live trivia battles and show off your knowledge with Trivib.",
    url: "https://trivib.app",
    siteName: "Trivib",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Trivib by Zefra",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@trivib",
    creator: "@zefra",
    title: "Trivib - Ultimate Trivia Game",
    description: "Compete in live trivia battles and climb the leaderboard!",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://trivib.app",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Manifest & PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e1b4b" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Extra SEO tags */}
        <meta name="author" content="Zefra Labs" />
        <meta name="robots" content="index, follow" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Header />
          <main style={{ flexGrow: 1 }}>
            <AuthProvider>{children}</AuthProvider>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
