const API_URL = process.env.STRAPI_URL || 'http://localhost:1337'

export type RichTextBlock = {
  children: { text: string }[]
}

export type ProductVariant = {
  id: number
  size: string
  stock: number
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

function flattenProduct(entry: any): Product {
  const raw = entry.attributes ?? entry

  const slug = raw.slug ?? entry.slug ?? ''
  const title = raw.title ?? entry.title ?? ''
  const price = raw.price ?? entry.price ?? 0

  let imageUrl = '/placeholder.jpg'
  if (Array.isArray(raw.image?.data)) {
    const img = raw.image.data[0]?.attributes
    if (img?.url) imageUrl = `${API_URL}${img.url}`
  } else if (Array.isArray(entry.image) && entry.image[0]?.url) {
    imageUrl = `${API_URL}${entry.image[0].url}`
  }

  let categorySlug = ''
  if (raw.category?.data?.attributes?.slug) {
    categorySlug = raw.category.data.attributes.slug
  } else if (entry.category?.slug) {
    categorySlug = entry.category.slug
  }

  const description: RichTextBlock[] = raw.description ?? []

  const variants: ProductVariant[] = Array.isArray(raw.variants)
    ? raw.variants.map((v: any) => ({
        id: v.id,
        size: v.size,
        stock: v.stock,
      }))
    : []

  return {
    id: entry.id,
    slug,
    title,
    price,
    imageUrl,
    categorySlug,
    description,
    variants,
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const url = `${API_URL}/api/products?populate=*`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)
  return resp.data.map(flattenProduct)
}

export async function getProductsByCategory(slug: string, maxPrice?: number): Promise<Product[]> {
  const qp = new URLSearchParams({ populate: '*' })
  qp.set('filters[category][slug][$eq]', slug)
  if (maxPrice !== undefined) qp.set('filters[price][$lte]', String(maxPrice))

  const url = `${API_URL}/api/products?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)
  return resp.data.map(flattenProduct)
}

export async function searchProducts(query: string): Promise<Product[]> {
  const qp = new URLSearchParams({ populate: '*' })
  qp.set('filters[title][$containsi]', query)

  const url = `${API_URL}/api/products?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)
  return resp.data.map(flattenProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const qp = new URLSearchParams({ populate: '*' })
  qp.set('filters[slug][$eq]', slug)

  const url = `${API_URL}/api/products?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)
  if (!resp.data.length) return null
  return flattenProduct(resp.data[0])
}

export async function getAllCategories(): Promise<Category[]> {
  const url = `${API_URL}/api/categories?populate=*`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)

  return resp.data.map((entry) => {
    const img = Array.isArray(entry.image) ? entry.image[0] : entry.image
    const imageUrl = img?.url ? `${API_URL}${img.url}` : '/placeholder-category.jpg'

    return {
      name: entry.name ?? '',
      slug: entry.slug ?? '',
      imageUrl,
    }
  })
}



export async function getBannerCategories(): Promise<BannerCategory[]> {
  const qp = new URLSearchParams({
    populate: '*',
    'filters[featured][$eq]': 'true',
  })
  const url = `${API_URL}/api/categories?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)

  console.log('RAW STRAPI CATEGORY ENTRIES:', resp.data)

  return resp.data.map((entry) => {
    const img = Array.isArray(entry.image) ? entry.image[0] : entry.image
    const imageUrl = img?.url ? `${API_URL}${img.url}` : '/placeholder-category.jpg'

    return {
      name: entry.name ?? '',
      slug: entry.slug ?? '',
      imageUrl,
    }
  })
}


export async function getNonBannerCategories(): Promise<BannerCategory[]> {
  const qp = new URLSearchParams({
    populate: '*',
    'filters[featured][$eq]': 'false',
  })
  const url = `${API_URL}/api/categories?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)

  return resp.data.map((entry) => {
    const raw = entry.attributes ?? {}
    const imgData = raw.image?.data

    let imageUrl = '/placeholder.jpg'
    if (Array.isArray(imgData) && imgData[0]?.attributes?.url) {
      imageUrl = `${API_URL}${imgData[0].attributes.url}`
    } else if (imgData?.attributes?.url) {
      imageUrl = `${API_URL}${imgData.attributes.url}`
    }

    return {
      name: raw.name ?? '',
      slug: raw.slug ?? '',
      imageUrl,
    }
  })
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const qp = new URLSearchParams({
    populate: '*',
    'filters[featured][$eq]': 'true',
  })

  const url = `${API_URL}/api/products?${qp.toString()}`

  try {
    const resp = await fetchJSON<StrapiListResponse<any>>(url)
    return Array.isArray(resp.data) ? resp.data.map(flattenProduct) : []
  } catch (err) {
    console.error('Ошибка получения избранных товаров:', err)
    return []
  }
}
