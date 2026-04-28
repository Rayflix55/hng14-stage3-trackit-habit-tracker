import './globals.css'

export const metadata = {
  title: 'Track-it',
  description: 'Minimalist Habit Tracker',
}

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