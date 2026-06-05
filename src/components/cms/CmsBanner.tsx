"use client"

import React from "react"
import { useCmsBuilder } from "@/lib/context/CmsBuilderContext"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react"

interface CmsBannerProps {
  id: string
  content: {
    title: string
    description: string
    imageUrl: string
    ctaText: string
    ctaLink: string
    position?: "left" | "right"
  }
  index: number
}

export default function CmsBanner({ id, content, index }: CmsBannerProps) {
  const {
    isEditing,
    activeSectionId,
    setActiveSectionId,
    updateSectionContent,
    reorderSections,
    toggleSectionVisibility,
    sections
  } = useCmsBuilder()

  const handleTextChange = (field: string, value: string) => {
    updateSectionContent(id, { [field]: value })
  }

  const isSelected = activeSectionId === id
  const isLeft = content.position !== "right"

  return (
    <div
      onClick={(e) => {
        if (isEditing) {
          e.stopPropagation()
          setActiveSectionId(id)
        }
      }}
      className={`relative py-12 md:py-20 bg-neutral-950 transition-all duration-300 ${
        isEditing
          ? `cursor-pointer border-2 m-2 ${
              isSelected ? "border-brand-gold ring-2 ring-brand-gold/20" : "border-dashed border-neutral-700 hover:border-neutral-500"
            }`
          : ""
      }`}
    >
      {/* Editor Controls */}
      {isEditing && (
        <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 bg-black/85 border border-neutral-800 p-1.5">
          <span className="text-[10px] text-brand-gold font-bold px-2 uppercase tracking-wider">
            Banner Section
          </span>
          <button
            disabled={index === 0}
            onClick={(e) => {
              e.stopPropagation()
              reorderSections(index, index - 1)
            }}
            className="p-1 hover:bg-neutral-800 rounded disabled:opacity-30 text-neutral-400"
            title="Move Up"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            disabled={index === sections.length - 1}
            onClick={(e) => {
              e.stopPropagation()
              reorderSections(index, index + 1)
            }}
            className="p-1 hover:bg-neutral-800 rounded disabled:opacity-30 text-neutral-400"
            title="Move Down"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleSectionVisibility(id)
            }}
            className="p-1 hover:bg-neutral-800 rounded text-neutral-400"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center`}>
          
          {/* Banner Media */}
          <div className={`relative h-[300px] md:h-[450px] overflow-hidden rounded-none border-2 border-brand-gold img-zoom ${
            isLeft ? "lg:order-2" : ""
          }`}>
            <img
              src={content.imageUrl}
              alt={content.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Banner Texts */}
          <div className={`space-y-6 md:space-y-8 ${isLeft ? "lg:order-1" : ""}`}>
            
            <div className="space-y-4">
              {isEditing ? (
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => handleTextChange("title", e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 font-serif text-2xl md:text-4xl font-bold text-white focus:outline-none"
                />
              ) : (
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                  {content.title}
                </h2>
              )}

              <div className="h-[1px] w-20 bg-brand-gold" />

              {isEditing ? (
                <textarea
                  value={content.description}
                  onChange={(e) => handleTextChange("description", e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-neutral-400 text-sm md:text-base h-28 focus:outline-none"
                />
              ) : (
                <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                  {content.description}
                </p>
              )}
            </div>

            <div>
              {isEditing ? (
                <div className="flex gap-2 bg-neutral-900 p-2 border border-neutral-800">
                  <input
                    type="text"
                    placeholder="Button Text"
                    value={content.ctaText}
                    onChange={(e) => handleTextChange("ctaText", e.target.value)}
                    className="bg-black text-xs border border-neutral-700 rounded px-2 py-1 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Button Link"
                    value={content.ctaLink}
                    onChange={(e) => handleTextChange("ctaLink", e.target.value)}
                    className="bg-black text-xs border border-neutral-700 rounded px-2 py-1 focus:outline-none"
                  />
                </div>
              ) : (
                <a href={content.ctaLink}>
                  <Button variant="luxury">
                    {content.ctaText}
                  </Button>
                </a>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
