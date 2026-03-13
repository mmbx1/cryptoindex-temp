import type { Metadata } from "next";
import { Michroma, Rajdhani, Azeret_Mono } from "next/font/google";
import "./globals.css";

// Load the "Quantum" Fonts
const michroma = Michroma({ weight: "400", subsets: ["latin"], variable: "--font-michroma" });
const rajdhani = Rajdhani({ weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], variable: "--font-rajdhani" });
const azeret = Azeret_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-azeret" });

export const metadata: Metadata = {
  title: "CryptoIndex.live | Quantum Architecture",
  description: "Institutional-grade Web3 infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${michroma.variable} ${rajdhani.variable} ${azeret.variable} bg-[#2C3539] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}