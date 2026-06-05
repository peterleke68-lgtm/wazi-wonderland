"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { CmsSection } from "@/types"
import { getCmsPageSections, saveCmsSections } from "@/lib/services"
import { useToast } from "@/components/ui/use-toast"

interface CmsBuilderContextType {
  sections: CmsSection[]
  isEditing: boolean
  setIsEditing: (val: boolean) => void
  activeSectionId: string | null
  setActiveSectionId: (id: string | null) => void
  loadSections: (pageSlug: string) => Promise<void>
  updateSectionContent: (sectionId: string, content: any) => void
  reorderSections: (dragIndex: number, hoverIndex: number) => void
  toggleSectionVisibility: (sectionId: string) => void
  saveAllChanges: (pageSlug: string) => Promise<boolean>
  discardAllChanges: (pageSlug: string) => Promise<void>
}

const CmsBuilderContext = createContext<CmsBuilderContextType | undefined>(undefined)

export const CmsBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sections, setSections] = useState<CmsSection[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const { toast } = useToast()

  const loadSections = async (pageSlug: string) => {
    const data = await getCmsPageSections(pageSlug)
    setSections(data)
  }

  const updateSectionContent = (sectionId: string, content: any) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === sectionId ? { ...sec, content: { ...sec.content, ...content } } : sec))
    )
  }

  const reorderSections = (dragIndex: number, hoverIndex: number) => {
    setSections((prev) => {
      const reordered = [...prev]
      const [dragged] = reordered.splice(dragIndex, 1)
      reordered.splice(hoverIndex, 0, dragged)
      // Recalculate sort_order
      return reordered.map((sec, idx) => ({ ...sec, sort_order: idx + 1 }))
    })
  }

  const toggleSectionVisibility = (sectionId: string) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === sectionId ? { ...sec, is_visible: !sec.is_visible } : sec))
    )
  }

  const saveAllChanges = async (pageSlug: string) => {
    const success = await saveCmsSections(pageSlug, sections)
    if (success) {
      toast({
        title: "CMS Published",
        description: "Your page builder edits have been successfully saved and published.",
        variant: "gold",
      })
    } else {
      toast({
        title: "Error Saving",
        description: "Something went wrong. Please check your connection and try again.",
        variant: "destructive",
      })
    }
    return success
  }

  const discardAllChanges = async (pageSlug: string) => {
    await loadSections(pageSlug)
    setActiveSectionId(null)
    toast({
      title: "Changes Discarded",
      description: "All unsaved modifications have been reverted.",
    })
  }

  return (
    <CmsBuilderContext.Provider
      value={{
        sections,
        isEditing,
        setIsEditing,
        activeSectionId,
        setActiveSectionId,
        loadSections,
        updateSectionContent,
        reorderSections,
        toggleSectionVisibility,
        saveAllChanges,
        discardAllChanges,
      }}
    >
      {children}
    </CmsBuilderContext.Provider>
  )
}

export const useCmsBuilder = () => {
  const context = useContext(CmsBuilderContext)
  if (context === undefined) {
    throw new Error("useCmsBuilder must be used within a CmsBuilderProvider")
  }
  return context
}
