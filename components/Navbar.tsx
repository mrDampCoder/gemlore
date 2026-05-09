'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Gem, Menu, X, ChevronDown, User, Heart, Shield, LogOut } from 'lucide-react'

interface NavUser {
  id: string
  name: string
  email: string
  role: string
}

interface NavbarProps {
  user: NavUser | null
}

export default function Navbar({ user }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/gemstones', label: 'Gemstones' },
    { href: '/articles', label: 'Articles' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-midnight-900/95 backdrop-blur-md border-b border-white/10 shadow-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 text-gold-400 group-hover:text-gold-500 transition-colors">
              <Gem className="w-full h-full" />
            </div>
            <span className="font-display text-xl font-bold text-white group-hover:text-gold-400 transition-colors">
              GemLore
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-gold-400 relative pb-1 ${
                  isActive(link.href) && link.href !== '/'
                    ? 'text-gold-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold-400 after:rounded-full'
                    : pathname === '/' && link.href === '/'
                    ? 'text-gold-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold-400 after:rounded-full'
                    : 'text-white/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors">
                  Log in
                </Link>
                <Link href="/signup" className="btn-primary text-sm py-2 px-4">
                  Sign up
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 rounded-full px-3 py-2 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-midnight-900 font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-white/90 max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass-card py-2 shadow-2xl animate-fade-in">
                    <div className="px-4 py-2 border-b border-white/10 mb-1">
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      <p className="text-xs text-white/50 truncate">{user.email}</p>
                    </div>

                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link href="/favorites" className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                      <Heart className="w-4 h-4" /> Favorites
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-gold-400 hover:text-gold-300 hover:bg-white/5 transition-colors">
                        <Shield className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-white/10 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-midnight-900/98 backdrop-blur-md z-40 flex flex-col animate-fade-in">
          <div className="page-container py-6 flex flex-col gap-2 flex-1 overflow-y-auto">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg py-3 border-b border-white/10 transition-colors ${
                  isActive(link.href) ? 'text-gold-400' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <>
                <Link href="/favorites" className="flex items-center gap-3 text-lg py-3 border-b border-white/10 text-white/80 hover:text-white transition-colors">
                  <Heart className="w-5 h-5" /> Favorites
                </Link>
                <Link href="/profile" className="flex items-center gap-3 text-lg py-3 border-b border-white/10 text-white/80 hover:text-white transition-colors">
                  <User className="w-5 h-5" /> Profile
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="flex items-center gap-3 text-lg py-3 border-b border-white/10 text-gold-400 hover:text-gold-300 transition-colors">
                    <Shield className="w-5 h-5" /> Admin Dashboard
                  </Link>
                )}
              </>
            )}

            <div className="mt-6 flex flex-col gap-3">
              {!user ? (
                <>
                  <Link href="/login" className="btn-secondary text-center">Log in</Link>
                  <Link href="/signup" className="btn-primary text-center">Sign up</Link>
                </>
              ) : (
                <button onClick={handleLogout} className="btn-danger text-center flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
