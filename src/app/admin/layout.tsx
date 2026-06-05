"use client"

import React, { useEffect } from "react"
import { useAuth } from "@/lib/context/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, ShoppingBag, Receipt, FileText, Users, LogOut, ArrowLeft, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentRole, loading, signOut, profile } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Define route rules based on roles
  const isAuthorized = () => {
    if (currentRole === "super_admin") return true
    if (currentRole === "product_manager" && (pathname === "/admin" || pathname.startsWith("/admin/products"))) return true
    if (currentRole === "order_manager" && (pathname === "/admin" || pathname.startsWith("/admin/orders"))) return true
    if (currentRole === "content_manager" && (pathname === "/admin" || pathname.startsWith("/admin/blog"))) return true
    return false
  }

  // Effect to redirect unauthorized personas
  useEffect(() => {
    if (!loading) {
      if (currentRole === "anonymous" || currentRole === "customer") {
        router.push("/auth/login")
      }
    }
  }, [currentRole, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-black text-white">
        <div className="w-64 border-r border-neutral-900 p-6 space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="flex-1 p-10 space-y-6">
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  // Block unauthorized view and show warning
  if (!isAuthorized()) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-6 px-4">
        <ShieldAlert className="h-16 w-16 text-brand-gold animate-bounce" />
        <div className="text-center space-y-2 max-w-md">
          <h1 className="font-serif text-2xl font-bold text-gradient-gold">ACCESS RESTRICTED</h1>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            Your current staff role <span className="font-bold text-white uppercase">({currentRole.replace("_", " ")})</span> does not have permissions to access this page. Please contact a Super Admin or switch your persona.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="luxury">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Go to Storefront
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" className="border-neutral-800">
              Dashboard Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" />, allowed: ["super_admin", "product_manager", "order_manager", "content_manager"] },
    { label: "Products", href: "/admin/products", icon: <ShoppingBag className="h-4 w-4" />, allowed: ["super_admin", "product_manager"] },
    { label: "Orders", href: "/admin/orders", icon: <Receipt className="h-4 w-4" />, allowed: ["super_admin", "order_manager"] },
    { label: "Blog Editor", href: "/admin/blog", icon: <FileText className="h-4 w-4" />, allowed: ["super_admin", "content_manager"] },
    { label: "Staff Portal", href: "/admin/staff", icon: <Users className="h-4 w-4" />, allowed: ["super_admin"] },
  ]

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-neutral-900 bg-black p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-300">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-widest font-semibold">Storefront</span>
            </Link>
            <h1 className="font-serif text-lg font-bold tracking-wider text-gradient-gold mt-4">
              WAZI PORTAL
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-neutral-500 mt-1">Staff Dashboard</p>
          </div>

          <nav className="space-y-1">
            {navItems
              .filter((item) => item.allowed.includes(currentRole))
              .map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs tracking-wider uppercase font-semibold transition-colors duration-300 ${
                      active
                        ? "bg-brand-gold/15 text-brand-gold border border-brand-gold/25"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )
              })}
          </nav>
        </div>

        {/* Staff details footer */}
        <div className="border-t border-neutral-900 pt-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-serif text-sm font-semibold">
              {profile?.first_name?.[0] || "S"}
            </div>
            <div className="min-w-0">
              <span className="text-xs text-white font-medium truncate block">
                {profile?.first_name} {profile?.last_name}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-semibold block truncate">
                Role: {currentRole.replace("_", " ")}
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-h-screen">
        {children}
      </main>

    </div>
  )
}
