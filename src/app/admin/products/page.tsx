"use client"

import React, { useEffect, useState } from "react"
import { getProducts } from "@/lib/services"
import { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatPrice } from "@/lib/utils"
import { Plus, Edit2, Trash2, Check, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  // Form values state
  const [formValues, setFormValues] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    salePrice: "" as string | number,
    wigType: "Lace Front" as any,
    hairLength: "24 inches",
    hairColor: "Natural Black",
    stockQuantity: 10,
  })

  const loadProducts = async () => {
    setLoading(true)
    const data = await getProducts()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setFormValues({
      name: "",
      slug: "",
      description: "",
      price: 1000,
      salePrice: "",
      wigType: "Lace Front",
      hairLength: "22 inches",
      hairColor: "Natural Black",
      stockQuantity: 5,
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormValues({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price,
      salePrice: product.sale_price || "",
      wigType: product.wig_type,
      hairLength: product.hair_length,
      hairColor: product.hair_color,
      stockQuantity: product.stock_quantity,
    })
    setIsModalOpen(true)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newProductData: any = {
      id: editingProduct?.id || `prod-${Math.random().toString(36).substr(2, 9)}`,
      name: formValues.name,
      slug: formValues.slug || formValues.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: formValues.description,
      price: Number(formValues.price),
      sale_price: formValues.salePrice !== "" ? Number(formValues.salePrice) : null,
      wig_type: formValues.wigType,
      hair_length: formValues.hairLength,
      hair_color: formValues.hairColor,
      stock_quantity: Number(formValues.stockQuantity),
      is_available: true,
      is_featured: editingProduct ? editingProduct.is_featured : false,
      specifications: editingProduct ? editingProduct.specifications : {},
      images: editingProduct?.images || [
        { id: `img-${Date.now()}`, product_id: "", image_url: "https://images.unsplash.com/photo-1595959183075-c1d09e57ad44?w=400", sort_order: 0 }
      ],
      created_at: editingProduct?.created_at || new Date().toISOString()
    }

    if (editingProduct) {
      // Modify
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...newProductData } : p)))
      toast({ title: "Product Updated", description: `${formValues.name} has been successfully modified.`, variant: "gold" })
    } else {
      // Add
      setProducts((prev) => [newProductData, ...prev])
      toast({ title: "Product Created", description: `${formValues.name} has been successfully added.`, variant: "gold" })
    }

    setIsModalOpen(false)
  }

  const handleDelete = (productId: string, productName: string) => {
    if (confirm(`Are you sure you want to delete ${productName}?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      toast({ title: "Product Deleted", description: `${productName} was removed from boutique.` })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gradient-gold">CATALOG MANAGER</h1>
          <p className="text-neutral-400 text-xs mt-1 uppercase tracking-widest leading-relaxed">
            Manage your boutique items, specifications, variants, and stock volume.
          </p>
        </div>
        <Button variant="luxury" size="sm" onClick={handleOpenAddModal}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Products Table */}
      <div className="border border-neutral-900 bg-black/30 rounded-xl p-6">
        {loading ? (
          <div className="text-center py-12 text-neutral-500 text-xs">Loading boutique catalog...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-xs">No products in boutique. Add one now!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-neutral-400">
              <thead className="text-[10px] text-neutral-500 uppercase tracking-wider border-b border-neutral-900">
                <tr>
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Specs</th>
                  <th className="pb-3 font-semibold">Stock</th>
                  <th className="pb-3 font-semibold">Price</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-900/10">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-8 rounded overflow-hidden bg-neutral-900">
                          <img src={p.images?.[0]?.image_url || ""} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                        <span className="font-semibold text-white truncate max-w-[180px] block">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-4 uppercase tracking-wider text-[10px] text-neutral-300 font-semibold">{p.wig_type}</td>
                    <td className="py-4">{p.hair_length} | {p.hair_color}</td>
                    <td className="py-4">
                      <span className={`font-semibold ${p.stock_quantity <= 5 ? "text-red-400" : "text-neutral-300"}`}>
                        {p.stock_quantity} units
                      </span>
                    </td>
                    <td className="py-4 font-semibold text-brand-gold">
                      {p.sale_price ? (
                        <div className="flex items-center gap-1.5">
                          <span>{formatPrice(p.sale_price)}</span>
                          <span className="text-neutral-500 line-through text-[10px]">{formatPrice(p.price)}</span>
                        </div>
                      ) : (
                        formatPrice(p.price)
                      )}
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 text-neutral-400 hover:text-brand-gold hover:bg-neutral-900 rounded cursor-pointer transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-900 rounded cursor-pointer transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-black text-white border border-brand-gold/25 w-full max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif text-gradient-gold">
              {editingProduct ? `Edit ${editingProduct.name}` : "Add New Luxury Product"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="title">Product Name</Label>
              <Input
                id="title"
                required
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                placeholder="Golden Balayage Lace Front Wig"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price">Base Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  required
                  value={formValues.price}
                  onChange={(e) => setFormValues({ ...formValues, price: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sale">Sale Price (Optional, $)</Label>
                <Input
                  id="sale"
                  type="number"
                  value={formValues.salePrice}
                  onChange={(e) => setFormValues({ ...formValues, salePrice: e.target.value })}
                  placeholder="Leave empty for no discount"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="type">Wig Type</Label>
                <select
                  id="type"
                  value={formValues.wigType}
                  onChange={(e) => setFormValues({ ...formValues, wigType: e.target.value as any })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-brand-gold cursor-pointer h-10"
                >
                  <option value="Human Hair">Human Hair</option>
                  <option value="Lace Front">Lace Front</option>
                  <option value="Closure">Closure</option>
                  <option value="Frontal">Frontal</option>
                  <option value="Colored">Colored</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  required
                  value={formValues.stockQuantity}
                  onChange={(e) => setFormValues({ ...formValues, stockQuantity: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="length">Hair Length</Label>
                <Input
                  id="length"
                  required
                  value={formValues.hairLength}
                  onChange={(e) => setFormValues({ ...formValues, hairLength: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="color">Hair Color</Label>
                <Input
                  id="color"
                  required
                  value={formValues.hairColor}
                  onChange={(e) => setFormValues({ ...formValues, hairColor: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={formValues.description}
                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                placeholder="Describe this luxury style..."
                className="h-20"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" className="border-neutral-800" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="luxury">
                <Check className="mr-1 h-3.5 w-3.5" />
                Save Product
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}
