import './globals.css'
import type { Metadata } from "next"; // Add this line

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Master your daily routine",
  manifest: "/manifest.json", // This tells the browser to look in /public/manifest.json
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-[#121212]">
      <body className="antialiased">{children}</body>
    </html>
  )
}