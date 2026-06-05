"use client"

import React from "react"
import { CmsSection } from "@/types"
import CmsHero from "./CmsHero"
import CmsBanner from "./CmsBanner"
import CmsFaq from "./CmsFaq"
import CmsProductGrid from "./CmsProductGrid"

interface CmsSectionRendererProps {
  section: CmsSection
  index: number
}

export default function CmsSectionRenderer({ section, index }: CmsSectionRendererProps) {
  if (!section.is_visible) return null

  switch (section.type) {
    case "hero":
      return <CmsHero id={section.id} content={section.content} index={index} />
    case "banner":
      return <CmsBanner id={section.id} content={section.content} index={index} />
    case "faq":
      return <CmsFaq id={section.id} content={section.content} index={index} />
    case "product_grid":
      return <CmsProductGrid id={section.id} content={section.content} index={index} />
    default:
      // Fallback for unsupported or custom HTML blocks
      return (
        <div className="py-8 text-center text-xs text-neutral-500 border border-dashed border-neutral-800 m-2 rounded">
          Unsupported block type: {section.type}
        </div>
      )
  }
}
