import { Inter, Merriweather } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./providers"
import { AuthProvider } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata = {
  title: "WolfDire - Join the Pack, Find Your Tribe",
  description:
    "A community-driven platform where ideas thrive, communities flourish, and voices are heard. Join WolfDire and connect with your tribe.",
    generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${merriweather.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="dark" storageKey="wolfdire-theme">
          <Providers>
            <AuthProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </AuthProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}

