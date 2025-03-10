import type { Metadata } from "next"
import { Cinzel } from "next/font/google"
import localFont from "next/font/local"

import "./globals.css"

const notepen = localFont({
  src: "../../public/fonts/notepen.otf",
  display: "swap",
  variable: "--font-notepen",
})

const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cinzel",
})

export const metadata: Metadata = {
  title: "Vanish Vote",
  description: "Simple | Annonymous | Awesome - polling app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${notepen.variable} ${cinzel.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
