import Link from 'next/link'
import { Gem, Globe, Share2, Rss, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-midnight-900/80 backdrop-blur-sm mt-20">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Gem className="w-7 h-7 text-gold-400 group-hover:text-gold-500 transition-colors" />
              <span className="font-display text-xl font-bold text-white group-hover:text-gold-400 transition-colors">GemLore</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              Discover the science, beauty, and mythology of Earth&apos;s most extraordinary minerals.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Website" className="text-white/40 hover:text-gold-400 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Social" className="text-white/40 hover:text-gold-400 transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" aria-label="RSS" className="text-white/40 hover:text-gold-400 transition-colors">
                <Rss className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">Explore</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/gemstones', label: 'Gemstones' },
                { href: '/articles', label: 'Articles' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-gold-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">Gemstone Types</h3>
            <ul className="space-y-2">
              {['Precious Stones', 'Semi-precious', 'Organic Gems', 'Birthstones', 'Gemstone Care'].map((item) => (
                <li key={item}>
                  <Link href="/gemstones" className="text-sm text-white/50 hover:text-gold-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/50">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>hello@gemlore.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/50">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>+1 (555) 000-GEMS</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; 2026 GemLore. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/about" className="text-xs text-white/30 hover:text-white/60 transition-colors">About</Link>
            <Link href="/contact" className="text-xs text-white/30 hover:text-white/60 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
