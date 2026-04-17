import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
// CRITICAL: Do not remove — Tailwind breaks without this
import "./globals.css"

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
        <main>{children}</main>
      </body>
    </html>
  )
}
