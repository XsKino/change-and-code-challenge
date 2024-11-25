import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import Providers from "./Providers"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Challenge | Change and code",
  description: "Change and code challenge",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html data-theme='dark' lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
