"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useAuth } from "@/lib/context/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Shield, Sparkles, User, LogOut, Mail, Lock, ArrowRight, LockKeyhole, Loader2 } from "lucide-react"

function LoginForm() {
  const { currentRole, switchPersona, isSimulated, signOut } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [isLoginTab, setIsLoginTab] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)
  const [supabaseReady, setSupabaseReady] = useState(false)

  useEffect(() => {
    setSupabaseReady(isSupabaseConfigured())
  }, [])

  const redirectTo = searchParams.get("redirectTo") || ""

  const handleSuccessfulAuth = (role: string) => {
    toast({
      title: "Welcome to Wazi Wonderland",
      description: `Successfully signed in as ${role.replace("_", " ").toUpperCase()}`,
      variant: "gold",
    })

    if (redirectTo) {
      router.push(redirectTo)
    } else if (role === "customer" || role === "anonymous") {
      router.push("/account")
    } else {
      router.push("/admin")
    }
  }

  // Handle persona selection (for simulated mode)
  const handlePersonaClick = (role: "super_admin" | "content_manager" | "product_manager" | "customer" | "anonymous") => {
    switchPersona(role)
    if (role === "anonymous") {
      router.push("/")
    } else {
      handleSuccessfulAuth(role)
    }
  }

  // Handle submit (login or sign up)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!supabaseReady) {
        // Simulated Authentication Flow
        // Determine role based on email triggers
        let simulatedRole: "super_admin" | "content_manager" | "product_manager" | "customer" = "customer"
        const emailLower = email.toLowerCase()

        if (emailLower.includes("admin")) {
          simulatedRole = "super_admin"
        } else if (emailLower.includes("content")) {
          simulatedRole = "content_manager"
        } else if (emailLower.includes("product")) {
          simulatedRole = "product_manager"
        }

        switchPersona(simulatedRole)
        handleSuccessfulAuth(simulatedRole)
      } else {
        // Real Supabase Authentication Flow
        const supabase = createClient()

        if (isLoginTab) {
          // Real Login
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) throw error

          // Let context fetch real details, we redirect shortly after
          // Check role and redirect
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            // Read if they are staff
            const { data: staffData } = await supabase
              .from("staff")
              .select("role_id")
              .eq("id", user.id)
              .eq("status", "active")
              .single()

            const role = staffData?.role_id || "customer"
            handleSuccessfulAuth(role)
          }
        } else {
          // Real Sign Up
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: firstName,
                last_name: lastName,
              },
            },
          })

          if (error) throw error

          toast({
            title: "Verification Email Sent",
            description: "Please check your inbox to verify your account.",
            variant: "gold",
          })
          setIsLoginTab(true)
        }
      }
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Authentication Error",
        description: err.message || "Failed to authenticate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[600px]">
      
      {/* Auth Form Column */}
      <div className="lg:col-span-6 flex flex-col justify-center bg-neutral-950/80 border border-neutral-900 rounded-2xl p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mb-8 text-center md:text-left">
          <span className="font-serif text-xs font-semibold tracking-widest text-brand-gold uppercase">Wazi Wonderland</span>
          <h2 className="font-serif text-3xl font-bold text-white mt-1">
            {isLoginTab ? "Couture Login" : "Join the Wonderland"}
          </h2>
          <p className="text-xs text-neutral-400 mt-2 font-light">
            {isLoginTab 
              ? "Access your personalized luxury wigs dashboard, wishlist and track order shipments." 
              : "Register to manage orders, customize Wig specifications and save favorites."
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginTab && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-xs text-neutral-300 font-medium">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Naomi"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="bg-neutral-900 border-neutral-800 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-xs text-neutral-300 font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Campbell"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="bg-neutral-900 border-neutral-800 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs text-neutral-300 font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                id="email"
                type="email"
                placeholder="customer@waziwonderland.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-neutral-900 border-neutral-800 pl-10 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-xs text-neutral-300 font-medium">Password</Label>
              {isLoginTab && (
                <button
                  type="button"
                  onClick={() => {
                    toast({
                      title: "Password Reset Requested",
                      description: supabaseReady
                        ? "Check your email for reset instructions."
                        : "Simulated password reset email sent.",
                      variant: "gold",
                    })
                  }}
                  className="text-[10px] text-brand-gold hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-neutral-900 border-neutral-800 pl-10 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
              />
            </div>
          </div>

          <Button type="submit" variant="luxury" className="w-full mt-2 font-semibold tracking-wider uppercase text-xs h-11" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                {isLoginTab ? "Access Account" : "Create Account"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center border-t border-neutral-900 pt-4">
          <button
            type="button"
            onClick={() => setIsLoginTab(!isLoginTab)}
            className="text-xs text-neutral-400 hover:text-white"
          >
            {isLoginTab ? (
              <>
                Don&apos;t have an account? <span className="text-brand-gold font-medium">Register here</span>
              </>
            ) : (
              <>
                Already have an account? <span className="text-brand-gold font-medium">Login here</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulated Developer / QA Persona selector Column */}
      <div className="lg:col-span-6 flex flex-col justify-center bg-black/95 border border-brand-gold/15 rounded-2xl p-8 md:p-10 shadow-[0_0_35px_rgba(212,175,55,0.08)] backdrop-blur-md">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-brand-gold/20 bg-brand-gold/5 text-[10px] text-brand-gold uppercase tracking-wider font-semibold mb-2">
            <Shield className="h-3 w-3" />
            <span>Developer Sandbox / Simulation</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">QA Role Quick Access</h3>
          <p className="text-xs text-neutral-400 mt-2 font-light leading-relaxed">
            Supabase connection is currently running in <strong className="text-brand-gold">Simulated Sandbox Mode</strong>. 
            Select any profile below to bypass forms and authenticate instantly with custom credentials.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handlePersonaClick("customer")}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all hover:bg-neutral-900 group cursor-pointer ${
              currentRole === "customer" 
                ? "bg-brand-gold/10 border-brand-gold text-white" 
                : "bg-neutral-950 border-neutral-900 text-neutral-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-pink/10 text-brand-pink">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider group-hover:text-brand-gold transition-colors">Naomi (Customer)</h4>
                <p className="text-[10px] text-neutral-500 font-light mt-0.5">Test wig shopping, cart db sync, checkout receipts</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => handlePersonaClick("product_manager")}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all hover:bg-neutral-900 group cursor-pointer ${
              currentRole === "product_manager" 
                ? "bg-brand-gold/10 border-brand-gold text-white" 
                : "bg-neutral-950 border-neutral-900 text-neutral-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider group-hover:text-brand-gold transition-colors">Coco (Product Manager)</h4>
                <p className="text-[10px] text-neutral-500 font-light mt-0.5">Manage hair products, specifications, variants & stock</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => handlePersonaClick("content_manager")}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all hover:bg-neutral-900 group cursor-pointer ${
              currentRole === "content_manager" 
                ? "bg-brand-gold/10 border-brand-gold text-white" 
                : "bg-neutral-950 border-neutral-900 text-neutral-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider group-hover:text-brand-gold transition-colors">Audrey (Content Manager)</h4>
                <p className="text-[10px] text-neutral-500 font-light mt-0.5">Edit visual CMS canvas pages & blog compositions</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => handlePersonaClick("super_admin")}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all hover:bg-neutral-900 group cursor-pointer ${
              currentRole === "super_admin" 
                ? "bg-brand-gold/10 border-brand-gold text-white" 
                : "bg-neutral-950 border-neutral-900 text-neutral-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider group-hover:text-brand-gold transition-colors">Victoria (Super Admin)</h4>
                <p className="text-[10px] text-neutral-500 font-light mt-0.5">All staff management, permissions, and shop settings</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {currentRole !== "anonymous" && (
          <Button
            onClick={() => signOut()}
            variant="outline"
            className="w-full mt-4 border-neutral-900 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-xs font-medium cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            End Simulated Persona
          </Button>
        )}
      </div>

    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Background aesthetics */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header logo */}
      <div className="flex justify-center mb-8 relative z-10">
        <Link href="/" className="font-serif text-3xl font-extrabold tracking-widest text-gradient-gold">
          WAZI WONDERLAND
        </Link>
      </div>

      {/* Main Box */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 text-brand-gold animate-spin" />
            <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">Preparing Wazi Couture Auth...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-neutral-500 mt-12 relative z-10">
        <p>© {new Date().getFullYear()} Wazi Wonderland LLC. Handcrafted Luxury Wigs. All Rights Reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="/about" className="hover:text-brand-gold transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/about" className="hover:text-brand-gold transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-brand-gold transition-colors">Concierge Care</Link>
        </div>
      </div>
    </div>
  )
}
