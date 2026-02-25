// frontend/lib/api.ts

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.STRAPI_URL ||
  'http://localhost:1337'

export type RichTextBlock = {
  children: { text: string }[]
}

export type Media = {
  url: string
}

export type VariantColor = {
  name: string
  image?: Media[] // multiple media
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

interface StrapiListResponse<T> {
  data: T[]
  meta: any
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    const message = await res.text().catch(() => '')
    throw new Error(`Fetch error ${res.status}: ${message}`)
  }
  return res.json()
}

function withApiUrl(url?: string | null): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

/**
 * Strapi-safe populate для продуктов:
 * - image
 * - category
 * - variants
 * - variants.color
 * - variants.color.image (media)
 */
function productPopulateQuery(): URLSearchParams {
  const qp = new URLSearchParams()
  qp.set('populate[image]', 'true')
  qp.set('populate[category]', 'true')
  qp.set('populate[variants]', 'true')
  qp.set('populate[variants][populate][color]', 'true')
  qp.set('populate[variants][populate][color][populate][image]', 'true')
  return qp
}

function flattenProduct(entry: any): Product {
  const raw = entry.attributes ?? entry

  const slug = raw.slug ?? entry.slug ?? ''
  const title = raw.title ?? entry.title ?? ''
  const price = Number(raw.price ?? entry.price ?? 0)

  // product image
  let imageUrl = '/placeholder.jpg'
  const imgData = raw.image?.data
  if (Array.isArray(imgData)) {
    const u = withApiUrl(imgData[0]?.attributes?.url)
    if (u) imageUrl = u
  } else if (imgData?.attributes?.url) {
    const u = withApiUrl(imgData.attributes.url)
    if (u) imageUrl = u
  }

  // category slug
  let categorySlug = ''
  if (raw.category?.data?.attributes?.slug) {
    categorySlug = raw.category.data.attributes.slug
  } else if (entry.category?.slug) {
    categorySlug = entry.category.slug
  }

  const description: RichTextBlock[] = raw.description ?? []

  const variants: ProductVariant[] = Array.isArray(raw.variants)
    ? raw.variants.map((v: any) => {
        const colors: VariantColor[] = Array.isArray(v?.color)
          ? v.color.map((c: any) => {
              const name = c?.name ?? ''

              const mediaData = c?.image?.data
              const urls: string[] = Array.isArray(mediaData)
                ? mediaData
                    .map((m: any) => withApiUrl(m?.attributes?.url))
                    .filter((u: any): u is string => Boolean(u))
                : mediaData?.attributes?.url
                ? [withApiUrl(mediaData.attributes.url)].filter(
                    (u): u is string => Boolean(u)
                  )
                : []

              const images: Media[] = urls.map((u) => ({ url: u }))

              return {
                name,
                image: images.length ? images : undefined,
              }
            })
          : []

        return {
          id: Number(v?.id ?? 0),
          size: (v?.size ?? '') as string,
          stock: Number(v?.stock ?? 0),
          color: colors.length ? colors : undefined,
        }
      })
    : []

  return {
    id: Number(entry.id),
    slug,
    title,
    price,
    imageUrl,
    categorySlug,
    description,
    variants,
  }
}

// ---------------- PRODUCTS ----------------

export async function getAllProducts(): Promise<Product[]> {
  const qp = productPopulateQuery()
  const url = `${API_URL}/api/products?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)
  return resp.data.map(flattenProduct)
}

export async function getProductsByCategory(
  slug: string,
  maxPrice?: number
): Promise<Product[]> {
  const qp = productPopulateQuery()
  qp.set('filters[category][slug][$eq]', slug)
  if (maxPrice !== undefined) qp.set('filters[price][$lte]', String(maxPrice))

  const url = `${API_URL}/api/products?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)
  return resp.data.map(flattenProduct)
}

export async function searchProducts(query: string): Promise<Product[]> {
  const qp = productPopulateQuery()
  qp.set('filters[title][$containsi]', query)

  const url = `${API_URL}/api/products?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)
  return resp.data.map(flattenProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const qp = productPopulateQuery()
  qp.set('filters[slug][$eq]', slug)

  const url = `${API_URL}/api/products?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)
  if (!resp.data.length) return null
  return flattenProduct(resp.data[0])
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const qp = productPopulateQuery()
  qp.set('filters[featured][$eq]', 'true')

  const url = `${API_URL}/api/products?${qp.toString()}`

  try {
    const resp = await fetchJSON<StrapiListResponse<any>>(url)
    return Array.isArray(resp.data) ? resp.data.map(flattenProduct) : []
  } catch (err) {
    console.error('Ошибка получения избранных товаров:', err)
    return []
  }
}

// ---------------- CATEGORIES ----------------

export async function getAllCategories(): Promise<Category[]> {
  const url = `${API_URL}/api/categories?populate=*`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)

  return resp.data.map((entry) => {
    const raw = entry.attributes ?? entry
    const imgData = raw.image?.data

    let imageUrl = '/placeholder-category.jpg'
    if (Array.isArray(imgData) && imgData[0]?.attributes?.url) {
      const u = withApiUrl(imgData[0].attributes.url)
      if (u) imageUrl = u
    } else if (imgData?.attributes?.url) {
      const u = withApiUrl(imgData.attributes.url)
      if (u) imageUrl = u
    }

    return {
      name: raw.name ?? '',
      slug: raw.slug ?? '',
      imageUrl,
    }
  })
}

export async function getBannerCategories(): Promise<BannerCategory[]> {
  const qp = new URLSearchParams()
  qp.set('populate', '*')
  qp.set('filters[featured][$eq]', 'true')

  const url = `${API_URL}/api/categories?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)

  return resp.data.map((entry) => {
    const raw = entry.attributes ?? entry
    const imgData = raw.image?.data

    let imageUrl = '/placeholder-category.jpg'
    if (Array.isArray(imgData) && imgData[0]?.attributes?.url) {
      const u = withApiUrl(imgData[0].attributes.url)
      if (u) imageUrl = u
    } else if (imgData?.attributes?.url) {
      const u = withApiUrl(imgData.attributes.url)
      if (u) imageUrl = u
    }

    return {
      name: raw.name ?? '',
      slug: raw.slug ?? '',
      imageUrl,
    }
  })
}

export async function getNonBannerCategories(): Promise<BannerCategory[]> {
  const qp = new URLSearchParams()
  qp.set('populate', '*')
  qp.set('filters[featured][$eq]', 'false')

  const url = `${API_URL}/api/categories?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)

  return resp.data.map((entry) => {
    const raw = entry.attributes ?? entry
    const imgData = raw.image?.data

    let imageUrl = '/placeholder.jpg'
    if (Array.isArray(imgData) && imgData[0]?.attributes?.url) {
      const u = withApiUrl(imgData[0].attributes.url)
      if (u) imageUrl = u
    } else if (imgData?.attributes?.url) {
      const u = withApiUrl(imgData.attributes.url)
      if (u) imageUrl = u
    }

    return {
      name: raw.name ?? '',
      slug: raw.slug ?? '',
      imageUrl,
    }
  })
}