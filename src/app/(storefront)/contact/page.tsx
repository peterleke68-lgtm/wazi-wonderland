"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Phone, MapPin, Send, MessageSquareCode } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Message Sent",
      description: "Thank you for reaching out. A Wazi concierge stylist will contact you within 12 hours.",
      variant: "gold",
    })

    setForm({ name: "", email: "", subject: "", message: "" })
    setLoading(false)
  }

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide text-gradient-gold">
            CONTACT CONCIERGE
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm uppercase tracking-widest leading-relaxed">
            Personalized consultations, product inquiries, and custom orders.
          </p>
          <div className="section-divider mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8 bg-neutral-950/40 border border-neutral-900 p-8 rounded-xl">
            <h2 className="font-serif text-xl font-bold text-white tracking-wide">Get In Touch</h2>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Have questions about cap sizing, hair density, or custom lace tinting? Our dedicated customer care stylists are here to assist you in selecting your perfect crown.
            </p>

            <ul className="space-y-6 text-sm font-light">
              <li className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">Headquarters</span>
                  <span className="text-neutral-400 text-xs mt-0.5 block">New Jersey, USA</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">Phone Consultation</span>
                  <span className="text-neutral-400 text-xs mt-0.5 block">+1 (800) WAZI-HAIR (Mon-Fri 9am-6pm EST)</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">Stylist Concierge Email</span>
                  <a href="mailto:concierge@waziwonderland.com" className="text-brand-gold text-xs hover:underline mt-0.5 block">
                    concierge@waziwonderland.com
                  </a>
                </div>
              </li>
            </ul>

            <Separator className="bg-neutral-900" />

            <div className="flex items-center gap-2 text-xs text-brand-gold/70 bg-brand-gold/5 p-3 rounded border border-brand-gold/25">
              <MessageSquareCode className="h-4 w-4 shrink-0 text-brand-gold" />
              <span>Looking for custom color layouts? Email us your inspo pics!</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-neutral-950/40 border border-neutral-900 p-8 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Alexandra Vance"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="alex@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Custom wig coloring request"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about the hair length, lace type, or color goals you have in mind..."
                  className="h-32"
                />
              </div>
              <Button type="submit" variant="luxury" className="w-full" disabled={loading}>
                <Send className="mr-2 h-4 w-4" />
                {loading ? "Sending inquiry..." : "Send Message"}
              </Button>
            </form>
          </div>

        </div>

      </div>
    </div>
  )
}

// Small helper since separator was referenced but not explicitly declared
const Separator = ({ className }: { className?: string }) => (
  <div className={`h-[1px] w-full bg-neutral-900 ${className}`} />
)
