"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="bg-black text-white min-h-screen py-16 space-y-20">
      
      {/* Hero Narrative */}
      <section className="mx-auto max-w-4xl px-4 text-center space-y-6">
        <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-wide text-gradient-gold">
          OUR STORY
        </h1>
        <p className="text-neutral-400 text-xs md:text-sm uppercase tracking-widest leading-relaxed">
          The Craftsmanship, Beauty, and Pure Luxury Behind Wazi Wonderland.
        </p>
        <div className="section-divider mt-4" />
        <p className="pt-6 text-sm md:text-lg text-neutral-300 leading-relaxed font-light">
          Founded with a simple yet powerful vision: to redefine the luxury wig experience. Wazi Wonderland was born in New Jersey, USA out of a passion for artisan craftsmanship and flawless beauty. We believe that a premium wig is not just an accessory—it is an extension of your confidence, style, and unique persona.
        </p>
      </section>

      {/* Grid: Narrative + Image */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gradient-gold">
              ARTISAN CRAFTSMANSHIP
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed font-light">
              Every single piece in our boutique is individually hand-knotted by master artisans. By selecting only the finest 100% human virgin cuticle-aligned hair, we guarantee a natural fall, gorgeous movement, and hair that remains soft, tangle-free, and healthy for years.
            </p>
            <p className="text-neutral-400 text-sm leading-relaxed font-light">
              Our signature contribution is the Wazi Invisible Melt: using ultra-thin, high-definition Swiss lace that blends completely into any skin tone, eliminating the need for heavy adhesives or makeup tinting. A natural hairline is no longer an aspiration—it is our guarantee.
            </p>
          </div>

          <div className="relative h-[300px] md:h-[450px] overflow-hidden rounded-xl border border-brand-gold/15">
            <img
              src="https://images.unsplash.com/photo-1595959183075-c1d09e57ad44?w=800&auto=format&fit=crop&q=80"
              alt="Artisan Craftsmanship"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

        </div>
      </section>

      {/* Values Banner */}
      <section className="bg-neutral-950 border-t border-b border-neutral-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-wider text-white">
            THE WAZI PROMISE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-4">
              <span className="text-brand-gold font-serif text-3xl font-bold">01</span>
              <h3 className="text-white font-serif font-bold text-base">Uncompromising Quality</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                We never compromise on the density, volume, or origin of our hair. From root to tip, expect perfection.
              </p>
            </div>
            <div className="space-y-3 p-4">
              <span className="text-brand-gold font-serif text-3xl font-bold">02</span>
              <h3 className="text-white font-serif font-bold text-base">Empowerment</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                We create styles that empower women to embrace their inner queens and express their individuality fearlessly.
              </p>
            </div>
            <div className="space-y-3 p-4">
              <span className="text-brand-gold font-serif text-3xl font-bold">03</span>
              <h3 className="text-white font-serif font-bold text-base">Exceptional Care</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Our support team is dedicated to offering personalized hair matching, styling consultations, and lifetime care support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-8">
        <div className="space-y-6 max-w-lg mx-auto px-4">
          <h2 className="font-serif text-2xl font-bold text-white">Step Into Wazi Wonderland</h2>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            Indulge in our exquisite collections and find your signature look today.
          </p>
          <Link href="/shop" className="inline-block">
            <Button variant="luxury" size="lg">Shop Wazi Boutique</Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
