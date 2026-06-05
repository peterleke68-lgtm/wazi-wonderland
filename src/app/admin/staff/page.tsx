"use client"

import React, { useState } from "react"
import { useAuth } from "@/lib/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, UserCheck, ShieldAlert, Check, X, ShieldAlert as SuspendedIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface StaffMember {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "suspended"
}

export default function AdminStaffPage() {
  const { currentRole } = useAuth()
  const { toast } = useToast()

  // Seed mock staff members
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: "staff-1", name: "Victoria Wazi", email: "victoria@waziwonderland.com", role: "super_admin", status: "active" },
    { id: "staff-2", name: "Audrey Hepburn", email: "audrey@waziwonderland.com", role: "content_manager", status: "active" },
    { id: "staff-3", name: "Coco Chanel", email: "coco@waziwonderland.com", role: "product_manager", status: "active" },
    { id: "staff-4", name: "Diana Spencer", email: "diana@waziwonderland.com", role: "order_manager", status: "active" },
  ])

  // Modal and Form States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    role: "product_manager" as any,
    status: "active" as "active" | "suspended",
  })

  // Prevent access if not super admin
  if (currentRole !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-brand-gold" />
        <h2 className="font-serif text-xl font-bold">Access Denied</h2>
        <p className="text-xs text-neutral-400 max-w-sm">
          Only users with Super Admin privileges are authorized to access the Staff Management Portal.
        </p>
      </div>
    )
  }

  const handleOpenAddModal = () => {
    setEditingStaff(null)
    setFormValues({ name: "", email: "", role: "product_manager", status: "active" })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (member: StaffMember) => {
    setEditingStaff(member)
    setFormValues({
      name: member.name,
      email: member.email,
      role: member.role,
      status: member.status,
    })
    setIsModalOpen(true)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newStaffData: StaffMember = {
      id: editingStaff?.id || `staff-${Math.random().toString(36).substr(2, 9)}`,
      name: formValues.name,
      email: formValues.email,
      role: formValues.role,
      status: formValues.status,
    }

    if (editingStaff) {
      setStaff((prev) => prev.map((s) => (s.id === editingStaff.id ? newStaffData : s)))
      toast({ title: "Staff Saved", description: `${formValues.name} settings successfully updated.`, variant: "gold" })
    } else {
      setStaff((prev) => [...prev, newStaffData])
      toast({ title: "Staff Member Added", description: `${formValues.name} invited successfully.`, variant: "gold" })
    }

    setIsModalOpen(false)
  }

  const handleToggleStatus = (memberId: string, currentStatus: "active" | "suspended", name: string) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active"
    setStaff((prev) =>
      prev.map((s) => (s.id === memberId ? { ...s, status: nextStatus } : s))
    )
    toast({
      title: nextStatus === "suspended" ? "Staff Suspended" : "Staff Activated",
      description: `${name} role status set to ${nextStatus.toUpperCase()}`,
      variant: nextStatus === "suspended" ? "destructive" : "gold",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gradient-gold">STAFF & PERMISSIONS</h1>
          <p className="text-neutral-400 text-xs mt-1 uppercase tracking-widest leading-relaxed">
            Manage administrative personnel, assign roles, and toggle access keys.
          </p>
        </div>
        <Button variant="luxury" size="sm" onClick={handleOpenAddModal}>
          <Plus className="mr-1.5 h-4 w-4" />
          Invite Staff
        </Button>
      </div>

      {/* Staff list table */}
      <div className="border border-neutral-900 bg-black/30 rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-neutral-400">
            <thead className="text-[10px] text-neutral-500 uppercase tracking-wider border-b border-neutral-900">
              <tr>
                <th className="pb-3 font-semibold">Staff Member</th>
                <th className="pb-3 font-semibold">Designated Role</th>
                <th className="pb-3 font-semibold">Access Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-900/10">
                  <td className="py-4">
                    <div>
                      <span className="font-semibold text-white block">{s.name}</span>
                      <span className="text-[10px] text-neutral-500 block mt-0.5">{s.email}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="uppercase tracking-wider text-[10px] text-neutral-300 font-semibold">{s.role.replace("_", " ")}</span>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      s.status === "active"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(s)}
                      className="p-1.5 text-neutral-400 hover:text-brand-gold hover:bg-neutral-900 rounded cursor-pointer transition-colors"
                      title="Edit Permissions"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                    </button>
                    {s.role !== "super_admin" && (
                      <button
                        onClick={() => handleToggleStatus(s.id, s.status, s.name)}
                        className={`p-1.5 rounded cursor-pointer transition-colors ${
                          s.status === "active"
                            ? "text-neutral-500 hover:text-red-400 hover:bg-neutral-900"
                            : "text-red-400 hover:text-green-400 hover:bg-neutral-900"
                        }`}
                        title={s.status === "active" ? "Suspend Account" : "Activate Account"}
                      >
                        <SuspendedIcon className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite/Edit Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-black text-white border border-brand-gold/25 w-full max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif text-gradient-gold">
              {editingStaff ? `Edit Permissions: ${editingStaff.name}` : "Invite Administrative Staff"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                value={formValues.email}
                onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                placeholder="jane@waziwonderland.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="role">Role Permission</Label>
                <select
                  id="role"
                  value={formValues.role}
                  onChange={(e) => setFormValues({ ...formValues, role: e.target.value as any })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-brand-gold cursor-pointer h-10"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="content_manager">Content Manager</option>
                  <option value="product_manager">Product Manager</option>
                  <option value="order_manager">Order Manager</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Portal Status</Label>
                <select
                  id="status"
                  value={formValues.status}
                  onChange={(e) => setFormValues({ ...formValues, status: e.target.value as any })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-brand-gold cursor-pointer h-10"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" className="border-neutral-800" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="luxury">
                <Check className="mr-1 h-3.5 w-3.5" />
                Save Access Key
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}
