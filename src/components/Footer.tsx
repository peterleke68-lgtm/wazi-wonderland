"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Send, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="9.7 15 9.7 9 15 12 9.7 15" />
  </svg>
)

export default function Footer() {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setSubmitting(true)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    toast({
      title: "Subscribed Successfully",
      description: "Welcome to the Wazi Wonderland VIP Club! Enjoy exclusive drops and luxury hair guides.",
      variant: "gold",
    })
    setEmail("")
    setSubmitting(false)
  }

  return (
    <footer className="bg-black text-neutral-300 border-t border-brand-gold/15">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 md:grid-cols-2">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold tracking-wider text-gradient-gold">
              WAZI WONDERLAND
            </h2>
            <p className="text-sm leading-relaxed text-neutral-400">
              Crafting confidence through premium, hand-tied human hair wigs, HD lace closures, and couture-colored masterpieces. Unmatched quality, designed for royalty.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors duration-300">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-serif font-semibold text-base mb-6 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/shop" className="hover:text-brand-gold transition-colors duration-300">
                  Shop All Wigs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-gold transition-colors duration-300">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-gold transition-colors duration-300">
                  Beauty Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-gold transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-serif font-semibold text-base mb-6 tracking-wide">
              Customer Support
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <span className="text-neutral-400">New Jersey, USA</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-gold shrink-0" />
                <span className="text-neutral-400">+1 (800) WAZI-HAIR</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-gold shrink-0" />
                <a href="mailto:support@waziwonderland.com" className="hover:text-brand-gold transition-colors duration-300">
                  support@waziwonderland.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-white font-serif font-semibold text-base tracking-wide">
              VIP Wonderland Club
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Subscribe to receive updates on exclusive collection drops, seasonal sales, and hair care tips.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-md pl-4 pr-12 py-2.5 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all duration-300"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="absolute right-1.5 top-1.5 p-1.5 bg-brand-gold hover:bg-gold-600 text-black rounded transition-colors duration-300 disabled:opacity-50 cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Wazi Wonderland LLC. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-neutral-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-neutral-400">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-neutral-400">Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
