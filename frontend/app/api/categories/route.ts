// frontend/app/api/categories/route.ts
import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'

export async function GET() {
  // Получаем все категории
  const res = await fetch(`${STRAPI_URL}/api/categories?populate=*`)
  const json = await res.json()

  // Преобразуем в простой массив { name, slug }
  const cats =
    Array.isArray(json.data) 
      ? json.data.map((entry: any) => ({
          name: entry.name,
          slug: entry.slug,
        }))
      : []

  return NextResponse.json(cats)
}
