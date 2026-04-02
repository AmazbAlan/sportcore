const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const h = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY,
}

async function sb<T>(path: string): Promise<T[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: h,
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`)
  return res.json()
}

// ---- TYPES ----

export type RichTextBlock = {
  children: { text: string }[]
}

export type Media = {
  url: string
}

export type VariantColor = {
  name: string
  image?: Media[]
}

export type ProductVariant = {
  id: number
  size: string
  stock: number
  color?: VariantColor[]
}

export type Product = {
  id: number
  slug: string
  title: string
  price: number
  imageUrl: string
  categorySlug: string
  description: RichTextBlock[]
  variants: ProductVariant[]
  seo_title?: string
  seo_desc?: string
}

export type Category = {
  name: string
  slug: string
  imageUrl: string
}

export interface BannerCategory {
  name: string
  slug: string
  imageUrl: string
}

// ---- HELPERS ----

function toProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug ?? String(row.id),
    title: row.name ?? '',
    price: Number(row.price ?? 0),
    imageUrl: row.image_url ?? (Array.isArray(row.images) && row.images[0]) ?? '/placeholder.jpg',
    categorySlug: row.category_slug ?? '',
    description: row.description ?? [],
    variants: row.variants ?? [],
    seo_title: row.seo_title ?? undefined,
    seo_desc: row.seo_desc ?? undefined,
  }
}

function toCategory(row: any): Category {
  return {
    name: row.name ?? '',
    slug: row.slug ?? '',
    imageUrl: row.image_url ?? '/placeholder-category.jpg',
  }
}

// ---- PRODUCTS ----

export async function getAllProducts(): Promise<Product[]> {
  try {
    const rows = await sb<any>('products?order=id.asc&select=*')
    return rows.map(toProduct)
  } catch (err) {
    console.error('getAllProducts error:', err)
    return []
  }
}

export async function getProductsByCategory(
  slug: string,
  maxPrice?: number,
  search?: string
): Promise<Product[]> {
  try {
    let query = `products?select=*&category_slug=eq.${encodeURIComponent(slug)}`
    if (maxPrice) query += `&price=lte.${maxPrice}`
    if (search) query += `&name=ilike.*${encodeURIComponent(search)}*`
    const rows = await sb<any>(query)
    return rows.map(toProduct)
  } catch (err) {
    console.error('getProductsByCategory error:', err)
    return []
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const rows = await sb<any>(
      `products?select=*&name=ilike.*${encodeURIComponent(query)}*`
    )
    return rows.map(toProduct)
  } catch (err) {
    console.error('searchProducts error:', err)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const rows = await sb<any>(`products?select=*&slug=eq.${encodeURIComponent(slug)}`)
    if (!rows.length) return null
    return toProduct(rows[0])
  } catch (err) {
    console.error('getProductBySlug error:', err)
    return null
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const rows = await sb<any>('products?select=*&featured=eq.true')
    return rows.map(toProduct)
  } catch (err) {
    console.error('getFeaturedProducts error:', err)
    return []
  }
}

// ---- CATEGORIES ----

export async function getAllCategories(): Promise<Category[]> {
  try {
    const rows = await sb<any>('categories?order=name.asc&select=*')
    return rows.map(toCategory)
  } catch (err) {
    console.error('getAllCategories error:', err)
    return []
  }
}

export async function getBannerCategories(): Promise<BannerCategory[]> {
  try {
    const rows = await sb<any>('categories?select=*&featured=eq.true')
    return rows.map(toCategory)
  } catch (err) {
    console.error('getBannerCategories error:', err)
    return []
  }
}

export async function getNonBannerCategories(): Promise<BannerCategory[]> {
  try {
    const rows = await sb<any>('categories?select=*&featured=eq.false')
    return rows.map(toCategory)
  } catch (err) {
    console.error('getNonBannerCategories error:', err)
    return []
  }
}
