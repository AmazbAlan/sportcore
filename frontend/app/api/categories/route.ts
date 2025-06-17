// frontend/app/api/categories/route.ts
import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'

export async function GET() {
  const res = await fetch(`${STRAPI_URL}/api/categories?populate=*`)
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }

  const json = await res.json()

  const cats = Array.isArray(json.data)
    ? json.data.map((entry: any) => ({
        name: entry.attributes?.name ?? '',
        slug: entry.attributes?.slug ?? '',
      }))
    : []

  return NextResponse.json(cats)
}
