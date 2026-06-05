"use client"

import React, { useState } from "react"
import { useAuth } from "@/lib/context/AuthContext"
import { Shield, Sparkles, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function QaSelector() {
  const { currentRole, switchPersona, isSimulated, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!isSimulated) return null // Hide if using production Supabase credentials

  const personas = [
    { id: "anonymous", name: "Anonymous Customer", icon: <User className="h-4 w-4" /> },
    { id: "customer", name: "Naomi (Customer)", icon: <Sparkles className="h-4 w-4 text-brand-pink" /> },
    { id: "content_manager", name: "Audrey (Content Staff)", icon: <Shield className="h-4 w-4 text-yellow-500" /> },
    { id: "product_manager", name: "Coco (Catalog Staff)", icon: <Shield className="h-4 w-4 text-orange-500" /> },
    { id: "super_admin", name: "Victoria (Super Admin)", icon: <Shield className="h-4 w-4 text-red-500" /> },
  ] as const

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold bg-black text-brand-gold shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:scale-105 active:scale-95 duration-300 cursor-pointer"
        title="QA Persona Switcher"
      >
        <Shield className="h-5 w-5 animate-pulse" />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute bottom-14 left-0 w-64 rounded-xl border border-brand-gold/25 bg-black/95 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md animate-fade-in-up space-y-3">
          <div className="border-b border-neutral-800 pb-2">
            <h4 className="font-serif text-sm text-gradient-gold font-bold">QA Persona Switcher</h4>
            <p className="text-[10px] text-neutral-400">Simulate different user roles instantly</p>
          </div>
          <div className="space-y-1.5">
            {personas.map((p) => {
              const active = currentRole === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    switchPersona(p.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer text-left ${
                    active
                      ? "bg-brand-gold/15 text-brand-gold border border-brand-gold/30"
                      : "text-neutral-300 hover:bg-neutral-900 border border-transparent"
                  }`}
                >
                  {p.icon}
                  <span className="font-medium">{p.name}</span>
                </button>
              );
            })}
          </div>
          {currentRole !== "anonymous" && (
            <button
              onClick={() => {
                signOut()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Sign Out</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
