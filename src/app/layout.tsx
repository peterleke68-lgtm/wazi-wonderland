import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import Providers from "@/components/Providers"
import QaSelector from "@/components/QaSelector"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Wazi Wonderland | Luxury Wigs & Hair Products",
  description: "Step into pure luxury. Explore premium human hair wigs, HD lace closures, custom-colored collections, and flawless lace frontals at Wazi Wonderland.",
  keywords: "luxury wigs, human hair wigs, HD lace frontal, lace closure wig, custom colored hair, Wazi Wonderland",
  openGraph: {
    title: "Wazi Wonderland | Luxury Wigs & Hair Products",
    description: "Discover the ultimate in luxury hair systems. Crafted for natural melt, premium volume, and elegance.",
    url: "https://waziwonderland.com",
    siteName: "Wazi Wonderland",
    locale: "en_US",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-background text-foreground antialiased selection:bg-brand-gold/30 selection:text-black`}
      >
        <Providers>
          {children}
          <QaSelector />
        </Providers>
      </body>
    </html>
  )
}
