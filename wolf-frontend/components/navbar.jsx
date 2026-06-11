"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useAuth } from "@/lib/auth-context"
import { Sun, Moon, Menu, X, Search, PenSquare, ChevronDown, User, Settings, LogOut, LayoutDashboard, FileText, Users } from "lucide-react"
import NotificationDropdown from "./NotificationDropdown"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSearch, setOpenSearch] = useState(false)
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenSearch((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const guestNavigation = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Pricing", href: "/pricing" },
  ]

  const userNavigation = [
    { name: "Home", href: "/" },
    { name: "Feed", href: "/feed" },
    { name: "Explore", href: "/explore" },
    { name: "Communities", href: "/communities" },
  ]

  const navigation = isAuthenticated ? userNavigation : guestNavigation

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <img src="/Logo-WOlfdire.png" alt="WolfDire" className="h-9 w-auto" />
              {/* <span className="text-xl font-bold text-foreground">WolfDire</span> */}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {item.name}
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1 text-muted-foreground">
                    More <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link href="/about">About</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/careers">Careers</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/contact">Contact</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Button 
              variant="outline" 
              className="hidden sm:flex items-center gap-2 text-muted-foreground w-48 justify-between px-3"
              onClick={() => setOpenSearch(true)}
            >
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="text-sm font-normal">Search...</span>
              </span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem onSelect={() => { setOpenSearch(false); router.push("/explore"); }}>
                    <Search className="mr-2 h-4 w-4" />
                    <span>Explore Posts</span>
                  </CommandItem>
                  <CommandItem onSelect={() => { setOpenSearch(false); router.push("/communities"); }}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Browse Communities</span>
                  </CommandItem>
                </CommandGroup>
                {isAuthenticated && (
                  <CommandGroup heading="Quick Actions">
                    <CommandItem onSelect={() => { setOpenSearch(false); router.push("/write"); }}>
                      <PenSquare className="mr-2 h-4 w-4" />
                      <span>Write a Post</span>
                    </CommandItem>
                    <CommandItem onSelect={() => { setOpenSearch(false); router.push("/profile"); }}>
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </CommandItem>
                    <CommandItem onSelect={() => { setOpenSearch(false); router.push("/settings"); }}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </CommandDialog>

            {isAuthenticated && <NotificationDropdown />}
            
            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Write button */}
            {isAuthenticated && (
              <Button asChild variant="ghost" className="hidden sm:flex gap-2">
                <Link href="/write">
                  <PenSquare className="h-4 w-4" />
                  Write
                </Link>
              </Button>
            )}

            {/* Auth buttons */}
            <div className="hidden md:flex md:items-center md:gap-2">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        {user?.firstName?.charAt(0) || <User className="h-5 w-5" />}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <hr className="my-1 border-border" />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" /> Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <hr className="my-1 border-border" />
                    <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive focus:text-destructive">
                      <LogOut className="h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <Link
                    href="/write"
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <PenSquare className="h-4 w-4" /> Write
                  </Link>
                  <hr className="my-2 border-border" />
                  <div className="px-4">
                    <Button onClick={() => { logout(); setMobileMenuOpen(false); }} variant="destructive" className="w-full justify-start gap-2">
                      <LogOut className="h-4 w-4" /> Log out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2 px-4">
                  <Button asChild variant="outline" className="flex-1 bg-transparent">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
