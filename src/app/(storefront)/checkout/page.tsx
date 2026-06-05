"use client"

import React, { useState } from "react"
import { useCart } from "@/lib/context/CartContext"
import { useAuth } from "@/lib/context/AuthContext"
import { createOrder } from "@/lib/services"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ShieldCheck, CreditCard, ChevronRight, BadgeCheck, CheckCircle2, Ticket } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const { cart, cartSubtotal, cartTotal, clearCart } = useCart()
  const { profile } = useAuth()
  const { toast } = useToast()

  // Checkout Steps: "shipping" | "payment" | "success"
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping")
  
  // Shipping Form State
  const [shippingForm, setShippingForm] = useState({
    name: profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() : "",
    email: "",
    addressLine1: profile?.shipping_address?.address_line1 || "",
    addressLine2: profile?.shipping_address?.address_line2 || "",
    city: profile?.shipping_address?.city || "",
    state: profile?.shipping_address?.state || "",
    postalCode: profile?.shipping_address?.postal_code || "",
    country: profile?.shipping_address?.country || "United States",
  })

  // Coupon State
  const [couponCode, setCouponCode] = useState("")
  const [discountPercent, setDiscountPercent] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState("")

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "4111 1111 1111 1111",
    expiry: "12/28",
    cvv: "123",
  })

  const [processing, setProcessing] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState("")

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (couponCode.toUpperCase() === "WAZISUMMER") {
      setDiscountPercent(0.15)
      setAppliedCoupon("WAZISUMMER")
      toast({
        title: "Coupon Applied",
        description: "15% discount has been successfully applied to your bag.",
        variant: "gold",
      })
    } else {
      toast({
        title: "Invalid Coupon",
        description: "The discount code you entered is not recognized.",
        variant: "destructive",
      })
    }
    setCouponCode("")
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Simulate payment processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      const discountAmount = cartSubtotal * discountPercent
      const finalTotal = cartSubtotal - discountAmount

      const order = await createOrder({
        profile_id: profile?.id || null,
        customer_email: shippingForm.email || "guest@waziwonderland.com",
        customer_name: shippingForm.name,
        shipping_address: {
          address_line1: shippingForm.addressLine1,
          address_line2: shippingForm.addressLine2,
          city: shippingForm.city,
          state: shippingForm.state,
          postal_code: shippingForm.postalCode,
          country: shippingForm.country,
        },
        subtotal: cartSubtotal,
        discount_amount: discountAmount,
        total: finalTotal,
        status: "paid",
        payment_method: "simulated",
        payment_status: "paid",
        tracking_number: null,
      })

      setCreatedOrderId(order.id)
      setStep("success")
      clearCart()
      toast({
        title: "Order Placed",
        description: "Thank you for shopping at Wazi Wonderland!",
        variant: "gold",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Order Error",
        description: "Could not create order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const discountAmount = cartSubtotal * discountPercent
  const finalTotal = cartSubtotal - discountAmount

  if (step === "success") {
    return (
      <div className="bg-black text-white min-h-[75vh] flex items-center py-16">
        <div className="mx-auto max-w-xl px-4 text-center space-y-6">
          <CheckCircle2 className="h-16 w-16 text-brand-gold mx-auto animate-pulse" />
          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold tracking-wide text-gradient-gold">
              ORDER CONFIRMED
            </h1>
            <p className="text-neutral-400 text-sm">
              Thank you for your purchase. Your invoice has been created and receipt details are summarized below.
            </p>
          </div>

          <div className="border border-neutral-900 bg-neutral-950 p-6 rounded-xl text-left space-y-4 text-sm font-light">
            <div className="flex justify-between text-xs text-neutral-500">
              <span>Order Reference</span>
              <span className="font-semibold text-white uppercase">{createdOrderId}</span>
            </div>
            <Separator className="bg-neutral-900" />
            <div className="flex justify-between">
              <span className="text-neutral-400">Shipped To</span>
              <span className="text-white font-medium">{shippingForm.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Shipping Address</span>
              <span className="text-white text-right font-medium">
                {shippingForm.addressLine1}, {shippingForm.city}
              </span>
            </div>
            <Separator className="bg-neutral-900" />
            <div className="flex justify-between text-base font-semibold">
              <span className="text-neutral-400">Total Paid</span>
              <span className="text-brand-gold">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <div className="pt-4 flex gap-4 justify-center">
            <Link href="/shop">
              <Button variant="luxury">Continue Shopping</Button>
            </Link>
            <Link href="/account">
              <Button variant="outline" className="border-neutral-800">
                Track Order
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <p className="font-serif text-lg text-neutral-400">Your bag is empty.</p>
        <Link href="/shop">
          <Button variant="luxury">Visit Boutique</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Progress header */}
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-neutral-500 mb-10">
          <span className={step === "shipping" ? "text-brand-gold font-bold" : "text-neutral-300"}>Shipping</span>
          <ChevronRight className="h-3 w-3" />
          <span className={step === "payment" ? "text-brand-gold font-bold" : ""}>Payment Simulation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Form Step Details */}
          <div className="lg:col-span-7 bg-neutral-950/40 border border-neutral-900 rounded-xl p-6 md:p-8">
            
            {step === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <h2 className="font-serif text-xl font-bold tracking-wide text-gradient-gold">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      required
                      value={shippingForm.name}
                      onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address1">Street Address</Label>
                  <Input
                    id="address1"
                    required
                    value={shippingForm.addressLine1}
                    onChange={(e) => setShippingForm({ ...shippingForm, addressLine1: e.target.value })}
                    placeholder="123 Luxury Dr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address2">Apartment, suite, unit (optional)</Label>
                  <Input
                    id="address2"
                    value={shippingForm.addressLine2}
                    onChange={(e) => setShippingForm({ ...shippingForm, addressLine2: e.target.value })}
                    placeholder="Apt 4B"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      required
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      placeholder="Hoboken"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      required
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                      placeholder="NJ"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Postal Code</Label>
                    <Input
                      id="zip"
                      required
                      value={shippingForm.postalCode}
                      onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                      placeholder="07030"
                    />
                  </div>
                </div>
                <Button type="submit" variant="luxury" className="w-full">
                  Proceed to Payment
                </Button>
              </form>
            )}

            {step === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold tracking-wide text-gradient-gold">Payment Simulation</h2>
                  <Badge variant="luxury" className="text-[9px] uppercase tracking-wider font-semibold">Simulated Sandbox</Badge>
                </div>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Stripe and PayPal APIs are pending setup. Below is a fully simulated mock checkout process. You can use any dummy credentials to verify.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card">Card Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                      <Input
                        id="card"
                        required
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiration Date</Label>
                      <Input
                        id="expiry"
                        required
                        value={paymentForm.expiry}
                        onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        required
                        type="password"
                        value={paymentForm.cvv}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-neutral-800"
                    onClick={() => setStep("shipping")}
                  >
                    Back
                  </Button>
                  <Button type="submit" variant="luxury" className="flex-1" disabled={processing}>
                    {processing ? "Simulating Payment Authorization..." : `Pay ${formatPrice(finalTotal)}`}
                  </Button>
                </div>

                <div className="flex justify-center items-center gap-2 text-xs text-neutral-500 font-light">
                  <ShieldCheck className="h-4 w-4 text-brand-gold" />
                  <span>Your mock transactions are protected by end-to-end simulation layers</span>
                </div>
              </form>
            )}

          </div>

          {/* Bag Summary Column */}
          <div className="lg:col-span-5 bg-neutral-950/40 border border-neutral-900 rounded-xl p-6 space-y-6">
            <h2 className="font-serif text-lg font-bold tracking-wide text-gradient-gold">Order Summary</h2>
            
            {/* Items list */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="h-14 w-11 shrink-0 overflow-hidden rounded bg-neutral-800">
                    <img
                      src={item.product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1595959183075-c1d09e57ad44?w=150"}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      QTY: {item.quantity} {item.selectedCapSize && `| Size: ${item.selectedCapSize}`}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-brand-gold shrink-0">
                    {formatPrice(item.priceAtAddition * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="bg-neutral-900" />

            {/* Coupon field */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Discount Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-800 text-white rounded px-3 py-1.5 text-xs placeholder:text-neutral-500 focus:outline-none"
              />
              <Button type="submit" variant="outline" className="border-neutral-800 text-xs px-4">
                Apply
              </Button>
            </form>

            {appliedCoupon && (
              <div className="flex items-center gap-1.5 text-xs text-brand-gold bg-brand-gold/10 border border-brand-gold/20 p-2 rounded">
                <Ticket className="h-3.5 w-3.5" />
                <span>Coupon <span className="font-bold">{appliedCoupon}</span> applied (15% OFF)</span>
              </div>
            )}

            <Separator className="bg-neutral-900" />

            {/* Totals */}
            <div className="space-y-2 text-xs font-light text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">{formatPrice(cartSubtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-brand-pink">
                  <span>Discount (15%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Standard FedEx Shipping</span>
                <span className="text-brand-gold font-medium uppercase tracking-wider text-[9px] bg-brand-gold/15 px-2 py-0.5 rounded border border-brand-gold/30">Free</span>
              </div>
              <Separator className="bg-neutral-900 pt-1" />
              <div className="flex justify-between text-sm font-semibold pt-1">
                <span className="text-neutral-300">Order Total</span>
                <span className="text-gradient-gold text-base">{formatPrice(finalTotal)}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
