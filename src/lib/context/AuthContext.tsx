"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Profile, Staff, RoleId } from "@/types"
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: any | null // Supabase Auth User
  profile: Profile | null
  staff: Staff | null
  loading: boolean
  isSimulated: boolean
  currentRole: RoleId | "customer" | "anonymous"
  switchPersona: (role: RoleId | "customer" | "anonymous") => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const SIMULATED_PROFILES: Record<string, { profile: Profile; staff: Staff | null }> = {
  super_admin: {
    profile: {
      id: "sim-admin-id",
      first_name: "Victoria",
      last_name: "Wazi",
      phone: "+1 (800) 555-0199",
      shipping_address: {
        address_line1: "100 Luxury Way",
        city: "Hoboken",
        state: "NJ",
        postal_code: "07030",
        country: "USA",
      },
      created_at: new Date().toISOString(),
    },
    staff: {
      id: "sim-admin-id",
      role_id: "super_admin",
      status: "active",
      created_at: new Date().toISOString(),
    },
  },
  content_manager: {
    profile: {
      id: "sim-content-id",
      first_name: "Audrey",
      last_name: "Hepburn",
      phone: "+1 (800) 555-0155",
      shipping_address: null,
      created_at: new Date().toISOString(),
    },
    staff: {
      id: "sim-content-id",
      role_id: "content_manager",
      status: "active",
      created_at: new Date().toISOString(),
    },
  },
  product_manager: {
    profile: {
      id: "sim-product-id",
      first_name: "Coco",
      last_name: "Chanel",
      phone: "+1 (800) 555-0122",
      shipping_address: null,
      created_at: new Date().toISOString(),
    },
    staff: {
      id: "sim-product-id",
      role_id: "product_manager",
      status: "active",
      created_at: new Date().toISOString(),
    },
  },
  customer: {
    profile: {
      id: "sim-customer-id",
      first_name: "Naomi",
      last_name: "Campbell",
      phone: "+1 (800) 555-0111",
      shipping_address: {
        address_line1: "45 Fifth Avenue",
        address_line2: "Apt 12B",
        city: "New York",
        state: "NY",
        postal_code: "10003",
        country: "USA",
      },
      created_at: new Date().toISOString(),
    },
    staff: null,
  },
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [staff, setStaff] = useState<Staff | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSimulated, setIsSimulated] = useState(true)
  const [currentRole, setCurrentRole] = useState<RoleId | "customer" | "anonymous">("anonymous")
  const { toast } = useToast()

  useEffect(() => {
    // 1. If Supabase is configured, use real Auth
    if (isSupabaseConfigured()) {
      setIsSimulated(false)
      const supabase = createClient()

      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user)
          fetchRealUserData(session.user.id)
        } else {
          setLoading(false)
        }
      })

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(session.user)
          await fetchRealUserData(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
          setStaff(null)
          setCurrentRole("anonymous")
          setLoading(false)
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    } else {
      // 2. If Supabase is offline/unconfigured, load simulated persona from localStorage
      const savedPersona = localStorage.getItem("wazi_persona") as RoleId | "customer" | "anonymous"
      if (savedPersona && savedPersona !== "anonymous") {
        applySimulatedPersona(savedPersona)
      } else {
        setLoading(false)
      }
    }
  }, [])

  const fetchRealUserData = async (userId: string) => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      // Get profile
      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()
      
      if (!profErr && prof) {
        setProfile(prof)
        setCurrentRole("customer")

        // Check if staff
        const { data: stf, error: stfErr } = await supabase
          .from("staff")
          .select("*, roles(*)")
          .eq("id", userId)
          .eq("status", "active")
          .single()

        if (!stfErr && stf) {
          setStaff(stf)
          setCurrentRole(stf.role_id)
        }
      }
    } catch (e) {
      console.error("Error loading profile details:", e)
    } finally {
      setLoading(false)
    }
  }

  const applySimulatedPersona = (role: RoleId | "customer" | "anonymous") => {
    setLoading(true)
    if (role === "anonymous") {
      setUser(null)
      setProfile(null)
      setStaff(null)
      setCurrentRole("anonymous")
    } else {
      const data = SIMULATED_PROFILES[role]
      if (data) {
        setUser({ id: data.profile.id, email: `${role}@waziwonderland.com`, is_anonymous: false })
        setProfile(data.profile)
        setStaff(data.staff)
        setCurrentRole(role)
      }
    }
    setLoading(false)
  }

  const switchPersona = (role: RoleId | "customer" | "anonymous") => {
    localStorage.setItem("wazi_persona", role)
    applySimulatedPersona(role)
    toast({
      title: "Persona Switched",
      description: `You are now simulating: ${role.replace("_", " ").toUpperCase()}`,
      variant: "gold",
    })
  }

  const signOut = async () => {
    setLoading(true)
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem("wazi_persona")
      setUser(null)
      setProfile(null)
      setStaff(null)
      setCurrentRole("anonymous")
      toast({
        title: "Logged Out",
        description: "You have signed out of your simulated account.",
      })
    }
    setLoading(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        staff,
        loading,
        isSimulated,
        currentRole,
        switchPersona,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
