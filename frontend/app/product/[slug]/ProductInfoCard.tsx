'use client'

import React, { useMemo, useState } from 'react'
import type { Product } from '../../../lib/api'

function blocksToText(desc: any): string {
  if (!desc) return ''
  if (typeof desc === 'string') return desc
  if (!Array.isArray(desc)) return ''
  try {
    return desc
      .map((block: any) => {
        if (!block) return ''
        if (typeof block === 'string') return block
        const children = Array.isArray(block.children) ? block.children : []
        return children.map((c: any) => (c && typeof c.text === 'string') ? c.text : '').join(' ')
      })
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  } catch {
    return ''
  }
}

export default function ProductInfoCard({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const description = useMemo(() => {
    return blocksToText((product as any).description)
  }, [product])

  const preview = useMemo(() => {
    if (expanded) return description
    return description.length > 320 ? description.slice(0, 320).trimEnd() + '…' : description
  }, [description, expanded])

  const rawSrc = (product as any).imageUrl
  const hasValidUrl =
    rawSrc &&
    typeof rawSrc === 'string' &&
    rawSrc.length > 5 &&
    (rawSrc.startsWith('http') || rawSrc.startsWith('/'))

  const mainImageSrc = hasValidUrl && !imgError ? rawSrc : '/placeholder.png'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="bg-slate-50 p-4 sm:p-6">
        <div className="relative w-full rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center" style={{ aspectRatio: '1/1', maxHeight: '420px' }}>
          <img
            src={mainImageSrc}
            alt={`${product.title || 'Товар'} — купить в SPORTCORE Бишкек`}
            className="w-full h-full object-contain p-3 sm:p-4 transition-transform duration-500 hover:scale-105"
            loading="eager"
            onError={() => setImgError(true)}
          />
        </div>
      </div>

      {/* Описание */}
      <div className="px-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">О товаре</h2>
          <span className="text-xs text-slate-500">SPORTCORE</span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-700 whitespace-pre-line">
          {preview || 'Описание появится здесь.'}
        </p>

        {description.length > 320 ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 text-sm font-semibold text-yellow-700 hover:text-yellow-800"
          >
            {expanded ? 'Свернуть' : 'Показать полностью'}
          </button>
        ) : null}
      </div>
    </div>
  )
}