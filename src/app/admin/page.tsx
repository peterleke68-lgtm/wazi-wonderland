"use client"

import React, { useEffect, useState } from "react"
import { getOrders, getProducts, getBlogPosts } from "@/lib/services"
import { Order, Product } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { TrendingUp, ShoppingBag, Receipt, FileText, CheckCircle2, AlertCircle } from "lucide-react"

export default function AdminOverviewPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [productCount, setProductCount] = useState(0)
  const [blogCount, setBlogCount] = useState(0)

  useEffect(() => {
    async function loadStats() {
      const ords = await getOrders()
      const prods = await getProducts()
      const blogs = await getBlogPosts()
      setOrders(ords)
      setProductCount(prods.length)
      setBlogCount(blogs.length)
    }
    loadStats()
  }, [])

  // Calculate statistics
  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.payment_status === "paid" ? curr.total : 0), 0)
  const pendingOrdersCount = orders.filter((o) => o.status === "pending" || o.status === "processing").length
  const completedOrdersCount = orders.filter((o) => o.status === "delivered").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-gradient-gold">OVERVIEW & ANALYTICS</h1>
        <p className="text-neutral-400 text-xs mt-1 uppercase tracking-widest leading-relaxed">
          Real-time metrics, order tracking, and administrative highlights.
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Revenue */}
        <Card className="bg-black/40 border-neutral-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-widest font-semibold text-neutral-400 font-sans">
              Total Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-gold font-serif">{formatPrice(totalRevenue)}</div>
            <p className="text-[10px] text-neutral-500 mt-1">From simulated paid checkout flows</p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="bg-black/40 border-neutral-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-widest font-semibold text-neutral-400 font-sans">
              Total Orders
            </CardTitle>
            <Receipt className="h-4 w-4 text-brand-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">{orders.length}</div>
            <p className="text-[10px] text-neutral-500 mt-1">{pendingOrdersCount} pending fulfillment</p>
          </CardContent>
        </Card>

        {/* Products catalog size */}
        <Card className="bg-black/40 border-neutral-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-widest font-semibold text-neutral-400 font-sans">
              Boutique Catalog
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">{productCount}</div>
            <p className="text-[10px] text-neutral-500 mt-1">Available luxury wig designs</p>
          </CardContent>
        </Card>

        {/* Blog Posts count */}
        <Card className="bg-black/40 border-neutral-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-widest font-semibold text-neutral-400 font-sans">
              Journal Articles
            </CardTitle>
            <FileText className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">{blogCount}</div>
            <p className="text-[10px] text-neutral-500 mt-1">Published hair care posts</p>
          </CardContent>
        </Card>

      </div>

      {/* Bottom section: Recent Orders */}
      <div className="border border-neutral-900 bg-black/30 rounded-xl p-6">
        <h2 className="font-serif text-lg font-bold text-white tracking-wide mb-6">Recent Order Activity</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-xs">
            No simulated orders placed yet. Try going to the storefront checkout!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-neutral-400">
              <thead className="text-[10px] text-neutral-500 uppercase tracking-wider border-b border-neutral-900">
                <tr>
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Fulfillment</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-900/10">
                    <td className="py-4 font-semibold text-white uppercase">{order.id}</td>
                    <td className="py-4">{order.customer_name}</td>
                    <td className="py-4">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        order.status === "delivered"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : order.status === "cancelled"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-brand-gold/15 text-brand-gold border border-brand-gold/30"
                      }`}>
                        {order.status === "delivered" ? (
                          <CheckCircle2 className="h-2.5 w-2.5" />
                        ) : (
                          <AlertCircle className="h-2.5 w-2.5" />
                        )}
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="py-4 text-right font-semibold text-brand-gold">{formatPrice(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
