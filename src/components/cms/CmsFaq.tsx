"use client"

import React, { useEffect, useState } from "react"
import { useCmsBuilder } from "@/lib/context/CmsBuilderContext"
import { getFAQs } from "@/lib/services"
import { FAQ } from "@/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowUp, ArrowDown, Eye } from "lucide-react"

interface CmsFaqProps {
  id: string
  content: {
    title: string
    subtitle: string
  }
  index: number
}

export default function CmsFaq({ id, content, index }: CmsFaqProps) {
  const {
    isEditing,
    activeSectionId,
    setActiveSectionId,
    updateSectionContent,
    reorderSections,
    toggleSectionVisibility,
    sections
  } = useCmsBuilder()

  const [faqs, setFaqs] = useState<FAQ[]>([])

  useEffect(() => {
    async function fetchFaqs() {
      const data = await getFAQs()
      setFaqs(data)
    }
    fetchFaqs()
  }, [])

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
      className={`relative py-16 md:py-24 bg-black border-t border-b border-neutral-900 transition-all duration-300 ${
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
            FAQ Section
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

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          {isEditing ? (
            <div className="space-y-2 max-w-xl mx-auto">
              <input
                type="text"
                value={content.title}
                onChange={(e) => handleTextChange("title", e.target.value)}
                className="w-full text-center bg-neutral-900 border border-neutral-800 rounded px-3 py-1 font-serif text-xl font-bold text-white focus:outline-none"
              />
              <input
                type="text"
                value={content.subtitle}
                onChange={(e) => handleTextChange("subtitle", e.target.value)}
                className="w-full text-center bg-neutral-900 border border-neutral-800 rounded px-3 py-1 text-xs text-neutral-400 focus:outline-none"
              />
            </div>
          ) : (
            <>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white tracking-wide">
                {content.title}
              </h2>
              <p className="text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
                {content.subtitle}
              </p>
              <div className="section-divider mt-4" />
            </>
          )}
        </div>

        {/* Accordions */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={faq.id}
              value={`faq-${idx}`}
              className="border-2 border-neutral-900 bg-neutral-950/40 rounded-none px-6"
            >
              <AccordionTrigger className="text-white hover:text-brand-gold font-serif text-base py-5 tracking-wide text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-400 leading-relaxed text-sm pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </div>
    </div>
  )
}
