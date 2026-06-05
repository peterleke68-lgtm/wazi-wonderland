"use client"

import React, { useEffect, useState } from "react"
import { getOrders } from "@/lib/services"
import { Order } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/utils"
import { Receipt, Search, Edit3, Truck, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Editing state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [formStatus, setFormStatus] = useState<any>("pending")
  const [trackingNumber, setTrackingNumber] = useState("")

  const loadOrders = async () => {
    setLoading(true)
    const data = await getOrders()
    setOrders(data)
    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleOpenEditModal = (order: Order) => {
    setEditingOrder(order)
    setFormStatus(order.status)
    setTrackingNumber(order.tracking_number || "")
    setIsModalOpen(true)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingOrder) return

    setOrders((prev) =>
      prev.map((o) =>
        o.id === editingOrder.id
          ? { ...o, status: formStatus, tracking_number: trackingNumber || null }
          : o
      )
    )

    toast({
      title: "Order Updated",
      description: `Order ${editingOrder.id.toUpperCase()} status set to ${formStatus.toUpperCase()}`,
      variant: "gold",
    })

    setIsModalOpen(false)
  }

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-gradient-gold">ORDER MANAGER</h1>
        <p className="text-neutral-400 text-xs mt-1 uppercase tracking-widest leading-relaxed">
          Manage simulated orders, print packing labels, and dispatch tracking details.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex max-w-md items-center gap-2 bg-neutral-905/30 border border-neutral-900 rounded-lg p-2">
        <Search className="h-4 w-4 text-neutral-500 ml-2" />
        <input
          type="text"
          placeholder="Search by Order ID, name, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-0 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-0 text-xs"
        />
      </div>

      {/* Table */}
      <div className="border border-neutral-900 bg-black/30 rounded-xl p-6">
        {loading ? (
          <div className="text-center py-12 text-neutral-500 text-xs">Loading order history...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-xs">No orders found matching search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-neutral-400">
              <thead className="text-[10px] text-neutral-500 uppercase tracking-wider border-b border-neutral-900">
                <tr>
                  <th className="pb-3 font-semibold">Order Reference</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Total Amount</th>
                  <th className="pb-3 font-semibold">Fulfillment Status</th>
                  <th className="pb-3 font-semibold">Tracking Number</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-900/10">
                    <td className="py-4 font-semibold text-white uppercase">{o.id}</td>
                    <td className="py-4">
                      <div>
                        <span className="font-semibold text-white block">{o.customer_name}</span>
                        <span className="text-[10px] text-neutral-500 block mt-0.5">{o.customer_email}</span>
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-brand-gold">{formatPrice(o.total)}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        o.status === "delivered"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : o.status === "cancelled"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-brand-gold/15 text-brand-gold border border-brand-gold/30"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-neutral-300">{o.tracking_number || "Pending Ship"}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleOpenEditModal(o)}
                        className="p-1.5 text-neutral-400 hover:text-brand-gold hover:bg-neutral-900 rounded cursor-pointer transition-colors"
                        title="Update Status"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Order Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-black text-white border border-brand-gold/25 w-full max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif text-gradient-gold">
              Fulfill Order
            </DialogTitle>
          </DialogHeader>

          {editingOrder && (
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-neutral-500 block">Order Reference</span>
                <span className="text-white font-mono font-semibold uppercase">{editingOrder.id}</span>
              </div>
              <div className="space-y-1">
                <span className="text-neutral-500 block">Total Amount</span>
                <span className="text-brand-gold font-serif font-bold text-sm">{formatPrice(editingOrder.total)}</span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">Fulfillment Status</Label>
                <select
                  id="status"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-brand-gold cursor-pointer h-10"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tracking">Tracking Number</Label>
                <div className="relative">
                  <Truck className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                  <Input
                    id="tracking"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. FedEx-982398239"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button type="button" variant="outline" className="border-neutral-800" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="luxury">
                  <Check className="mr-1 h-3.5 w-3.5" />
                  Save Changes
                </Button>
              </div>

            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
