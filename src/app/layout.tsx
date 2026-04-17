import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
// CRITICAL: Do not remove — Tailwind breaks without this
import "./globals.css"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Enhancr: Photo Restore",
  description: "Enhance your photos faithfully",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
