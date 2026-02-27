'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import type { Product } from '../../../lib/api'

function blocksToText(desc: any[] = []): string {
  return desc
    .map((block: any) => (block?.children ?? []).map((c: any) => c?.text ?? '').join(' '))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export default function ProductInfoCard({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false)

  const description = useMemo(() => {
    const d = Array.isArray((product as any).description) ? (product as any).description : []
    return blocksToText(d)
  }, [product])

  const preview = useMemo(() => {
    if (expanded) return description
    return description.length > 320 ? description.slice(0, 320).trimEnd() + '…' : description
  }, [description, expanded])

  const mainImageSrc =
    (product as any).imageUrl && String((product as any).imageUrl).length > 5
      ? (product as any).imageUrl
      : '/placeholder.jpg'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Фото */}
      <div className="bg-slate-50 p-6">
        <div className="relative aspect-square w-full rounded-2xl bg-white border border-slate-200 overflow-hidden">
          <Image
            src={mainImageSrc}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-contain p-4"
            priority
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