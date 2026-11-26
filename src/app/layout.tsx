import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import LoadingScreen from "@/components/layout/LoadingScreen";
import { THEME_INIT_SCRIPT } from "@/lib/themeScript";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = "https://faneva-solomampionona.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Faneva Solomampionona — Full Stack Developer & AI Developer",
  description:
    "Portfolio de Faneva Solomampionona, développeur Full Stack et développeur IA spécialisé dans les applications web modernes et les solutions intelligentes.",
  openGraph: {
    title: "Faneva Solomampionona — Full Stack Developer & AI Developer",
    description:
      "Portfolio de Faneva Solomampionona, développeur Full Stack et développeur IA spécialisé dans les applications web modernes et les solutions intelligentes.",
    url: siteUrl,
    siteName: "Faneva Solomampionona",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Faneva Solomampionona — Full Stack Developer & AI Developer",
    description:
      "Portfolio de Faneva Solomampionona, développeur Full Stack et développeur IA spécialisé dans les applications web modernes et les solutions intelligentes.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      // The init script may set data-theme before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <LoadingScreen />
        <CustomCursor />
        <div className="grain" aria-hidden />
        <Navbar />
        {/* md:px-24 keeps content clear of the fixed side rails. */}
        <main className="flex-1 md:px-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
