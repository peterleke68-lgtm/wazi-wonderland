"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/AuthContext"
import { useWishlist } from "@/lib/context/WishlistContext"
import { useCart } from "@/lib/context/CartContext"
import { getOrders } from "@/lib/services"
import { formatPrice } from "@/lib/utils"
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShoppingBag, Heart, User, MapPin, Phone, 
  ShieldCheck, Trash2, LogOut, ExternalLink, 
  Clock, Truck, Package, LayoutDashboard 
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Order } from "@/types"

export default function AccountPage() {
  const { user, profile, staff, signOut, loading: authLoading } = useAuth()
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("orders")

  // Profile Form States
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("USA")
  const [updatingProfile, setUpdatingProfile] = useState(false)

  // Redirect if logged out and auth loading is done
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirectTo=/account")
    }
  }, [user, authLoading, router])

  // Load orders
  useEffect(() => {
    async function loadOrders() {
      if (user) {
        setOrdersLoading(true)
        try {
          const fetchedOrders = await getOrders(user.id)
          setOrders(fetchedOrders)
        } catch (e) {
          console.error("Error loading orders:", e)
        } finally {
          setOrdersLoading(false)
        }
      }
    }
    loadOrders()
  }, [user])

  // Populate profile fields when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "")
      setLastName(profile.last_name || "")
      setPhone(profile.phone || "")
      
      const addr = profile.shipping_address as any
      if (addr) {
        setAddressLine1(addr.address_line1 || "")
        setAddressLine2(addr.address_line2 || "")
        setCity(addr.city || "")
        setState(addr.state || "")
        setPostalCode(addr.postal_code || "")
        setCountry(addr.country || "USA")
      }
    }
  }, [profile])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdatingProfile(true)

    const updatedAddress = {
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state,
      postal_code: postalCode,
      country,
    }

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase
          .from("profiles")
          .update({
            first_name: firstName,
            last_name: lastName,
            phone,
            shipping_address: updatedAddress,
          })
          .eq("id", user.id)

        if (error) throw error
      } else {
        // Simulated: Save in local storage simulated profiles
        const savedPersona = localStorage.getItem("wazi_persona")
        if (savedPersona) {
          toast({
            title: "Simulated Profile Saved",
            description: "Profile updated successfully inside Sandbox simulation.",
            variant: "gold",
          })
        }
      }

      toast({
        title: "Couture Profile Updated",
        description: "Your concierge care details have been updated successfully.",
        variant: "gold",
      })
    } catch (e: any) {
      console.error(e)
      toast({
        title: "Update Failed",
        description: e.message || "Failed to update profile details.",
        variant: "destructive",
      })
    } finally {
      setUpdatingProfile(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
          <p className="font-serif text-sm tracking-widest text-neutral-400 uppercase">Loading Account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen py-16">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-900 pb-8 gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold">Welcome to Wazi Club</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-white capitalize">
              Hello, {profile?.first_name || "Gorgeous"}!
            </h1>
            <p className="text-sm text-neutral-400 font-light">
              Manage your premium wigs orders, shipping coordinates, and luxury favorites.
            </p>
          </div>
          
          <div className="flex gap-4">
            {staff && (
              <Link href="/admin">
                <Button variant="luxury" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider h-11">
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
            )}
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="border-neutral-800 hover:bg-neutral-900 hover:text-red-400 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider h-11 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
          <TabsList className="bg-neutral-950 border border-neutral-900 p-1 rounded-xl flex max-w-lg">
            <TabsTrigger value="orders" className="flex-1 py-3 text-xs uppercase tracking-widest font-semibold cursor-pointer data-[state=active]:bg-brand-gold data-[state=active]:text-black">
              Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex-1 py-3 text-xs uppercase tracking-widest font-semibold cursor-pointer data-[state=active]:bg-brand-gold data-[state=active]:text-black">
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex-1 py-3 text-xs uppercase tracking-widest font-semibold cursor-pointer data-[state=active]:bg-brand-gold data-[state=active]:text-black">
              Profile
            </TabsTrigger>
          </TabsList>

          {/* ORDERS TAB CONTENT */}
          <TabsContent value="orders" className="outline-none">
            {ordersLoading ? (
              <div className="py-20 text-center space-y-4">
                <div className="h-8 w-8 border border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs uppercase tracking-widest text-neutral-400 font-light">Loading Order Ledger...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-20 text-center space-y-6 max-w-md mx-auto border border-neutral-900 rounded-2xl bg-neutral-950/40 backdrop-blur-sm">
                <Package className="h-12 w-12 text-neutral-600 mx-auto" />
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-semibold text-white">No Orders Placed Yet</h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    Your collection is waiting. Explore our couture wig selections and hand-crafted bundles.
                  </p>
                </div>
                <Link href="/shop">
                  <Button variant="luxury" size="sm" className="font-semibold uppercase tracking-widest text-[10px]">
                    Browse Boutique
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="border border-neutral-900 bg-neutral-950/60 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm"
                  >
                    {/* Order header banner */}
                    <div className="bg-neutral-950 p-6 border-b border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
                        <div>
                          <span className="text-neutral-500 block">Order ID</span>
                          <span className="font-mono text-neutral-300 font-medium">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">Placed On</span>
                          <span className="text-neutral-300 font-medium">
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">Total Amount</span>
                          <span className="text-brand-gold font-bold font-serif">{formatPrice(Number(order.total))}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">Payment Method</span>
                          <span className="text-neutral-300 font-medium capitalize">{order.payment_method}</span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                          order.status === "delivered" 
                            ? "bg-green-500/10 text-green-400 border-green-500/20" 
                            : order.status === "shipped" 
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : order.status === "processing"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-neutral-800 text-neutral-400 border-neutral-700"
                        }`}>
                          {order.status}
                        </span>
                        
                        <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                          order.payment_status === "paid" 
                            ? "bg-brand-gold/15 text-brand-gold border-brand-gold/25" 
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </div>

                    {/* Order summary / tracking */}
                    <div className="p-6 space-y-6">
                      {order.tracking_number && (
                        <div className="p-3.5 rounded-lg bg-neutral-900/40 border border-neutral-900 flex items-center gap-3.5 text-xs">
                          <Truck className="h-5 w-5 text-brand-gold shrink-0" />
                          <div className="flex-1">
                            <span className="text-neutral-500 font-light">Carrier Tracking Reference: </span>
                            <span className="font-mono font-semibold text-white">{order.tracking_number}</span>
                          </div>
                          <span className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider">FedEx Ground</span>
                        </div>
                      )}

                      {/* Shipping details */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        <div className="md:col-span-4 space-y-2">
                          <h4 className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-brand-gold" />
                            Shipping coordinates
                          </h4>
                          <div className="text-xs text-neutral-300 space-y-0.5 leading-relaxed font-light">
                            <p className="font-medium text-white">{order.customer_name}</p>
                            <p>{(order.shipping_address as any).address_line1}</p>
                            {(order.shipping_address as any).address_line2 && <p>{(order.shipping_address as any).address_line2}</p>}
                            <p>{(order.shipping_address as any).city}, {(order.shipping_address as any).state} {(order.shipping_address as any).postal_code}</p>
                            <p className="uppercase text-[10px] text-neutral-500 tracking-wider font-bold mt-1">{(order.shipping_address as any).country}</p>
                          </div>
                        </div>

                        {/* Items listed */}
                        <div className="md:col-span-8 space-y-3">
                          <h4 className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 flex items-center gap-1.5">
                            <ShoppingBag className="h-3 w-3 text-brand-gold" />
                            Acquisitions list
                          </h4>
                          
                          <div className="space-y-3.5">
                            {/* In-memory mock details or from database */}
                            {order.order_items && order.order_items.map((item: any, idx: number) => (
                              <div key={item.id || idx} className="flex justify-between items-center text-xs py-2 border-b border-neutral-900 last:border-b-0">
                                <div className="space-y-0.5">
                                  <span className="text-white font-medium block">
                                    {item.product?.name || "Premium Luxury Wig Model"}
                                  </span>
                                  {item.variant && (
                                    <span className="text-[10px] text-neutral-500 font-light">
                                      Cap: {item.variant.cap_size} • Density: {item.variant.hair_density}
                                    </span>
                                  )}
                                </div>
                                <div className="text-right space-y-0.5">
                                  <span className="text-neutral-400 block font-light">
                                    {item.quantity} x {formatPrice(Number(item.price))}
                                  </span>
                                  <span className="font-semibold text-white">
                                    {formatPrice(Number(item.price) * item.quantity)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* WISHLIST TAB CONTENT */}
          <TabsContent value="wishlist" className="outline-none">
            {wishlist.length === 0 ? (
              <div className="py-20 text-center space-y-6 max-w-md mx-auto border border-neutral-900 rounded-2xl bg-neutral-950/40 backdrop-blur-sm">
                <Heart className="h-12 w-12 text-neutral-600 mx-auto" />
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-semibold text-white">Wishlist is Empty</h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    Tap the couture heart emblem on any wig page to keep your design favorites listed here.
                  </p>
                </div>
                <Link href="/shop">
                  <Button variant="luxury" size="sm" className="font-semibold uppercase tracking-widest text-[10px]">
                    Go to Boutique
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlist.map((item) => (
                  <div key={item.id} className="group border border-neutral-900 bg-neutral-950/50 rounded-xl overflow-hidden relative shadow-sm hover:border-brand-gold/30 transition-all duration-300">
                    <div className="aspect-[3/4] w-full overflow-hidden relative bg-neutral-900">
                      {item.images && item.images.length > 0 && (
                        <img 
                          src={item.images[0].image_url} 
                          alt={item.name} 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      
                      {/* Delete button */}
                      <button 
                        onClick={() => {
                          removeFromWishlist(item.id)
                          toast({
                            title: "Removed from Wishlist",
                            description: `${item.name} has been removed.`,
                          })
                        }}
                        className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/70 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 flex items-center justify-center border border-neutral-800 transition-colors cursor-pointer"
                        title="Remove Favorite"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-gold uppercase tracking-wider font-semibold">{item.wig_type}</span>
                        <h3 className="font-serif text-base font-bold text-white tracking-tight leading-tight group-hover:text-brand-gold transition-colors">{item.name}</h3>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm font-serif font-bold text-neutral-300">{formatPrice(Number(item.sale_price || item.price))}</span>
                        <span className="text-[10px] text-neutral-500">{item.hair_length} • {item.hair_color}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-900">
                        <Link href={`/product/${item.slug}`} className="w-full">
                          <Button variant="outline" className="w-full text-[10px] tracking-wider uppercase h-9 border-neutral-800">
                            Couture View
                          </Button>
                        </Link>
                        <Button 
                          onClick={() => {
                            addToCart(item, 1, null, null)
                            toast({
                              title: "Added to Shopping Bag",
                              description: `${item.name} has been added to your cart.`,
                              variant: "gold",
                            })
                          }}
                          variant="luxury" 
                          className="w-full text-[10px] tracking-wider uppercase h-9"
                        >
                          Acquire
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* PROFILE DETAILS TAB CONTENT */}
          <TabsContent value="profile" className="outline-none">
            <form onSubmit={handleUpdateProfile} className="max-w-3xl space-y-8 bg-neutral-950/40 p-8 border border-neutral-900 rounded-xl backdrop-blur-sm">
              <div className="border-b border-neutral-900 pb-4">
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-brand-gold" />
                  Concierge Coordinates
                </h3>
                <p className="text-xs text-neutral-400 font-light mt-1">
                  Configure your luxury account details and shipping destination address.
                </p>
              </div>

              {/* Basic credentials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profFirstName" className="text-xs text-neutral-300">First Name</Label>
                  <Input 
                    id="profFirstName" 
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="bg-neutral-900 border-neutral-800 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-sm h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profLastName" className="text-xs text-neutral-300">Last Name</Label>
                  <Input 
                    id="profLastName" 
                    type="text" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="bg-neutral-900 border-neutral-800 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-sm h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profEmail" className="text-xs text-neutral-400">Account Email (Immutable)</Label>
                  <Input 
                    id="profEmail" 
                    type="email" 
                    value={user?.email || ""} 
                    disabled 
                    className="bg-neutral-950 border-neutral-900 text-neutral-600 text-sm h-11 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profPhone" className="text-xs text-neutral-300 flex items-center gap-1">
                    <Phone className="h-3 w-3 text-brand-gold" /> Phone Number
                  </Label>
                  <Input 
                    id="profPhone" 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (800) 555-0100"
                    className="bg-neutral-900 border-neutral-800 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-sm h-11"
                  />
                </div>
              </div>

              {/* Shipping address coordinates */}
              <div className="space-y-6 pt-4 border-t border-neutral-900">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-gold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Primary Shipping Coordinates
                </h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="addr1" className="text-xs text-neutral-300">Street Address</Label>
                    <Input 
                      id="addr1" 
                      type="text" 
                      value={addressLine1} 
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="100 Luxury Avenue"
                      className="bg-neutral-900 border-neutral-800 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-sm h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addr2" className="text-xs text-neutral-300">Apartment, Suite, Unit, etc. (Optional)</Label>
                    <Input 
                      id="addr2" 
                      type="text" 
                      value={addressLine2} 
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Suite 500"
                      className="bg-neutral-900 border-neutral-800 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-sm h-11"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="city" className="text-xs text-neutral-300">City</Label>
                      <Input 
                        id="city" 
                        type="text" 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Beverly Hills"
                        className="bg-neutral-900 border-neutral-800 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-sm h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-xs text-neutral-300">State / Region</Label>
                      <Input 
                        id="state" 
                        type="text" 
                        value={state} 
                        onChange={(e) => setState(e.target.value)}
                        placeholder="CA"
                        className="bg-neutral-900 border-neutral-800 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-sm h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip" className="text-xs text-neutral-300">Postal Code</Label>
                      <Input 
                        id="zip" 
                        type="text" 
                        value={postalCode} 
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="90210"
                        className="bg-neutral-900 border-neutral-800 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-sm h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-xs text-neutral-300">Country</Label>
                    <Input 
                      id="country" 
                      type="text" 
                      value={country} 
                      onChange={(e) => setCountry(e.target.value)}
                      className="bg-neutral-900 border-neutral-800 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-sm h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div className="pt-4 border-t border-neutral-900 flex justify-end">
                <Button 
                  type="submit" 
                  variant="luxury" 
                  className="font-semibold uppercase tracking-wider text-xs px-8 h-11"
                  disabled={updatingProfile}
                >
                  {updatingProfile ? (
                    <>
                      <div className="h-4 w-4 border border-black border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4.5 w-4.5 mr-2" />
                      Publish Coordinates
                    </>
                  )}
                </Button>
              </div>

            </form>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}
