"use client"

import React from "react"
import { useCmsBuilder } from "@/lib/context/CmsBuilderContext"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, EyeOff, Eye, Trash, Settings } from "lucide-react"

interface CmsHeroProps {
  id: string
  content: {
    title: string
    subtitle: string
    videoUrl?: string
    fallbackImage: string
    ctaText: string
    ctaLink: string
    height?: "full" | "large" | "medium"
  }
  index: number
}

export default function CmsHero({ id, content, index }: CmsHeroProps) {
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

  return (
    <div
      onClick={(e) => {
        if (isEditing) {
          e.stopPropagation()
          setActiveSectionId(id)
        }
      }}
      className={`relative overflow-hidden transition-all duration-300 ${
        isEditing
          ? `cursor-pointer border-2 m-2 ${
              isSelected ? "border-brand-gold ring-2 ring-brand-gold/20" : "border-dashed border-neutral-700 hover:border-neutral-500"
            }`
          : ""
      }`}
    >
      {/* Editor Controls Overlay */}
      {isEditing && (
        <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 bg-black/80 border border-neutral-800 p-1.5 backdrop-blur-sm">
          <span className="text-[10px] text-brand-gold font-bold px-2 uppercase tracking-wider">
            Hero Section
          </span>
          <button
            disabled={index === 0}
            onClick={(e) => {
              e.stopPropagation()
              reorderSections(index, index - 1)
            }}
            className="p-1 hover:bg-neutral-800 rounded disabled:opacity-30 text-neutral-400 hover:text-white"
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
            className="p-1 hover:bg-neutral-800 rounded disabled:opacity-30 text-neutral-400 hover:text-white"
            title="Move Down"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleSectionVisibility(id)
            }}
            className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
            title="Toggle Visibility"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Hero Content Wrapper */}
      <div className="relative min-h-[60vh] md:min-h-[85vh] flex items-center justify-center bg-black">
        {/* Background Media */}
        {content.videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            src={content.videoUrl}
          />
        ) : (
          <img
            src={content.fallbackImage}
            alt="Hero Background"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />

        {/* Foreground Content */}
        <div className="relative z-10 max-w-4xl px-4 text-center text-white space-y-6 md:space-y-8">
          
          {/* Editable Title */}
          {isEditing ? (
            <input
              type="text"
              value={content.title}
              onChange={(e) => handleTextChange("title", e.target.value)}
              className="w-full text-center bg-black/60 border border-brand-gold/30 rounded px-4 py-2 font-serif text-3xl md:text-6xl font-bold tracking-tight text-gradient-gold focus:outline-none focus:border-brand-gold"
            />
          ) : (
            <h1 className="font-serif text-4xl md:text-7xl font-bold tracking-tight leading-none text-gradient-gold animate-fade-in-up">
              {content.title}
            </h1>
          )}

          {/* Editable Subtitle */}
          {isEditing ? (
            <textarea
              value={content.subtitle}
              onChange={(e) => handleTextChange("subtitle", e.target.value)}
              className="w-full text-center bg-black/60 border border-neutral-700 rounded px-4 py-2 text-sm md:text-lg text-neutral-300 focus:outline-none focus:border-brand-gold h-20 resize-none"
            />
          ) : (
            <p className="max-w-2xl mx-auto text-sm md:text-xl text-neutral-300 leading-relaxed tracking-wider uppercase font-light">
              {content.subtitle}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isEditing ? (
              <div className="flex gap-2 bg-black/80 border border-neutral-800 p-2">
                <input
                  type="text"
                  placeholder="Button Text"
                  value={content.ctaText}
                  onChange={(e) => handleTextChange("ctaText", e.target.value)}
                  className="bg-neutral-900 text-xs border border-neutral-700 rounded px-2 py-1 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Button Link"
                  value={content.ctaLink}
                  onChange={(e) => handleTextChange("ctaLink", e.target.value)}
                  className="bg-neutral-900 text-xs border border-neutral-700 rounded px-2 py-1 focus:outline-none"
                />
              </div>
            ) : (
              <a href={content.ctaLink}>
                <Button variant="luxury" size="lg" className="tracking-widest uppercase font-semibold">
                  {content.ctaText}
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Section Bottom Gold Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
      </div>
    </div>
  )
}
