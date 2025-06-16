// frontend/lib/api.ts
const API_URL = process.env.STRAPI_URL || 'http://localhost:1337'

/** Блок Rich Text из Strapi */
export type RichTextBlock = {
  children: { text: string }[]
}

/** Модель варианта продукта */
export type ProductVariant = {
  id:    number
  size:  string
  stock: number
}

/** Модель продукта для фронта */
export type Product = {
  id:           number
  slug:         string
  title:        string
  price:        number
  imageUrl:     string
  categorySlug: string
  description:  RichTextBlock[]
  variants:     ProductVariant[]
}

/** Модель категории (для списка без баннеров) */
export type Category = {
  name: string
  slug: string
}

/** Для баннерной сетки и не-баннеров: картинка + ссылка */
export interface BannerCategory {
  name:     string
  slug:     string
  imageUrl: string
}

/** Общий ответ Strapi */
interface StrapiListResponse<T> {
  data: T[]
  meta: any
}

/** Универсальный fetch + no-store */
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Fetch error ${res.status}`)
  return res.json()
}

/** «Сырая» → Product */
function flattenProduct(entry: any): Product {
  const raw = entry.attributes ?? entry

  // базовые поля
  const slug  = raw.slug  ?? entry.slug  ?? ''
  const title = raw.title ?? entry.title ?? ''
  const price = raw.price ?? entry.price ?? 0

  // картинка
  let imageUrl = '/placeholder.jpg'
  if (Array.isArray(raw.image?.data)) {
    const img = raw.image.data[0]?.attributes
    if (img?.url) imageUrl = `${API_URL}${img.url}`
  } else if (Array.isArray(entry.image) && entry.image[0]?.url) {
    imageUrl = `${API_URL}${entry.image[0].url}`
  }

  // категория
  let categorySlug = ''
  if (raw.category?.data?.attributes?.slug) {
    categorySlug = raw.category.data.attributes.slug
  } else if (entry.category?.slug) {
    categorySlug = entry.category.slug
  }

  // описание
  const description: RichTextBlock[] = raw.description ?? []

  // repeatable component variants
  const variants: ProductVariant[] = Array.isArray(raw.variants)
    ? raw.variants.map((v: any) => ({
        id:    v.id,
        size:  v.size,
        stock: v.stock,
      }))
    : []

  return {
    id:           entry.id,
    slug,
    title,
    price,
    imageUrl,
    categorySlug,
    description,
    variants,
  }
}

/** Получить все продукты */
export async function getAllProducts(): Promise<Product[]> {
  const url  = `${API_URL}/api/products?populate=*`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)
  return resp.data.map(flattenProduct)
}

/** Получить продукты по категории (slug) и/или по цене */
export async function getProductsByCategory(
  slug: string,
  maxPrice?: number
): Promise<Product[]> {
  const qp = new URLSearchParams({ populate: '*' })
  qp.set('filters[category][slug][$eq]', slug)
  if (maxPrice !== undefined) qp.set('filters[price][$lte]', String(maxPrice))

  const url  = `${API_URL}/api/products?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)
  return resp.data.map(flattenProduct)
}

/** Поиск по названию */
export async function searchProducts(query: string): Promise<Product[]> {
  const qp = new URLSearchParams({ populate: '*' })
  qp.set('filters[title][$containsi]', query)

  const url  = `${API_URL}/api/products?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)
  return resp.data.map(flattenProduct)
}

/** Один продукт по slug */
export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const qp = new URLSearchParams({ populate: '*' })
  qp.set('filters[slug][$eq]', slug)

  const url  = `${API_URL}/api/products?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)
  if (!resp.data.length) return null
  return flattenProduct(resp.data[0])
}

/** Получить все категории (для страницы /category без картинок) */
export async function getAllCategories(): Promise<Category[]> {
  const url  = `${API_URL}/api/categories?populate=*`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)
  return resp.data.map((c) => {
    const raw = c.attributes ?? c
    return {
      name: raw.name,
      slug: raw.slug,
    }
  })
}

/** Получить только баннерные категории (banner = true) */
export async function getBannerCategories(): Promise<BannerCategory[]> {
  const qp = new URLSearchParams({
    populate: '*',                  // подтягиваем image, banner и т. д.
    'filters[banner][$eq]': 'true',
  })
  const url  = `${API_URL}/api/categories?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)

  return resp.data.map((entry) => {
    const raw = entry.attributes ?? {}
    const imgData = raw.image?.data

    let imageUrl = '/placeholder-category.jpg'
    if (Array.isArray(imgData) && imgData[0]?.attributes?.url) {
      imageUrl = `${API_URL}${imgData[0].attributes.url}`
    } else if (imgData?.attributes?.url) {
      imageUrl = `${API_URL}${imgData.attributes.url}`
    }

    return {
      name:     raw.name ?? '',
      slug:     raw.slug ?? '',
      imageUrl,
    }
  })
}

/** Получить только обычные категории (banner = false) */
export async function getNonBannerCategories(): Promise<BannerCategory[]> {
  const qp = new URLSearchParams({
    populate: '*',
    'filters[banner][$eq]': 'false',
  })
  const url  = `${API_URL}/api/categories?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)

  return resp.data.map((entry) => {
    const raw = entry.attributes ?? {}
    const imgData = raw.image?.data

    let imageUrl = '/placeholder-category.jpg'
    if (Array.isArray(imgData) && imgData[0]?.attributes?.url) {
      imageUrl = `${API_URL}${imgData[0].attributes.url}`
    } else if (imgData?.attributes?.url) {
      imageUrl = `${API_URL}${imgData.attributes.url}`
    }

    return {
      name:     raw.name ?? '',
      slug:     raw.slug ?? '',
      imageUrl,
    }
  })
}

// frontend/lib/api.ts

/** Модель продукта уже есть выше... */

/** Получить только «хиты» (featured = true) */
export async function getFeaturedProducts(): Promise<Product[]> {
  const qp = new URLSearchParams({
    populate: '*',
    'filters[featured][$eq]': 'true',
  })
  const url  = `${API_URL}/api/products?${qp.toString()}`
  const resp = await fetchJSON<StrapiListResponse<any>>(url)
  return resp.data.map(flattenProduct)
}
