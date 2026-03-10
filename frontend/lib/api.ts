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

interface StrapiListResponse<T> {
  data: T[]
  meta: any
}

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  if (!API_URL) {
    console.error('API_URL is empty. Check NEXT_PUBLIC_STRAPI_URL / STRAPI_URL')
  }

  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: {
      Accept: 'application/json',
    },
    ...init,
  })

  if (!res.ok) {
    const message = await res.text().catch(() => '')
    console.error('[Strapi fetch error]', {
      url,
      status: res.status,
      body: message?.slice?.(0, 500),
    })
    throw new Error(`Fetch error ${res.status}: ${message}`)
  }

  return res.json()
}

function withApiUrl(url?: string | null): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

function pickMediaUrl(anyMedia: any): string | null {
  if (!anyMedia) return null

  if (typeof anyMedia === 'string') return withApiUrl(anyMedia)

  if (typeof anyMedia?.url === 'string') return withApiUrl(anyMedia.url)

  const data = anyMedia?.data ?? anyMedia

  if (Array.isArray(data)) {
    const first = data[0]
    const u =
      first?.url ||
      first?.attributes?.url ||
      first?.formats?.thumbnail?.url ||
      first?.attributes?.formats?.thumbnail?.url
    return withApiUrl(u)
  }

  const u =
    data?.url ||
    data?.attributes?.url ||
    data?.formats?.thumbnail?.url ||
    data?.attributes?.formats?.thumbnail?.url

  return withApiUrl(u)
}

function productPopulateQuery(): URLSearchParams {
  const qp = new URLSearchParams()

  qp.set('populate[0]', 'image')
  qp.set('populate[1]', 'category')
  qp.set('populate[2]', 'variants')
  qp.set('populate[3]', 'variants.color')
  qp.set('populate[4]', 'variants.color.image')

  return qp
}

function flattenProduct(entry: any): Product {
  const raw = entry?.attributes ?? entry ?? {}

  const slug = raw.slug ?? ''
  const title = raw.title ?? ''
  const price = Number(raw.price ?? 0)

  const candidate =
    raw.image ??
    raw.images ??
    raw.mainImage ??
    raw.thumbnail ??
    raw.photo ??
    raw.picture ??
    raw.imageUrl

  const imageUrl = pickMediaUrl(candidate) || '/placeholder.jpg'

  let categorySlug = ''
  if (raw.category?.data?.attributes?.slug) categorySlug = raw.category.data.attributes.slug
  else if (raw.category?.slug) categorySlug = raw.category.slug

  const description: RichTextBlock[] = raw.description ?? []

  const seo_title =
    typeof raw.seo_title === 'string' && raw.seo_title.trim()
      ? raw.seo_title.trim()
      : undefined

  const seo_desc =
    typeof raw.seo_desc === 'string' && raw.seo_desc.trim()
      ? raw.seo_desc.trim()
      : undefined

  const variants: ProductVariant[] = Array.isArray(raw.variants)
    ? raw.variants.map((v: any) => {
        const colors: VariantColor[] = Array.isArray(v?.color)
          ? v.color.map((c: any) => {
              const name = String(c?.name ?? '')
              const mediaCandidate = c?.image ?? c?.images ?? null

              let images: Media[] | undefined = undefined

              if (Array.isArray(mediaCandidate)) {
                const urls = mediaCandidate
                  .map((m: any) => pickMediaUrl(m))
                  .filter((u): u is string => Boolean(u))
                if (urls.length) images = urls.map((u) => ({ url: u }))
              } else {
                const u = pickMediaUrl(mediaCandidate)
                if (u) images = [{ url: u }]
              }

              return {
                name,
                image: images,
              }
            })
          : []

        return {
          id: Number(v?.id ?? 0),
          size: String(v?.size ?? ''),
          stock: Number(v?.stock ?? 0),
          color: colors.length ? colors : undefined,
        }
      })
    : []

  return {
    id: Number(raw?.id ?? entry?.id ?? 0),
    slug,
    title,
    price,
    imageUrl,
    categorySlug,
    description,
    variants,
    seo_title,
    seo_desc,
  }
}

// ---------------- PRODUCTS ----------------

export async function getAllProducts(): Promise<Product[]> {
  const qp = productPopulateQuery()
  const url = `${API_URL}/api/products?${qp.toString()}`

  try {
    const resp = await fetchJSON<StrapiListResponse<any>>(url)
    const items = Array.isArray(resp?.data) ? resp.data : []
    return items.map(flattenProduct)
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

  const qp = productPopulateQuery()

  qp.set('filters[category][slug][$eq]', slug)

  if (maxPrice)
    qp.set('filters[price][$lte]', String(maxPrice))

  if (search)
    qp.set('filters[title][$containsi]', search)

  const url = `${API_URL}/api/products?${qp.toString()}`

  try {
    const resp = await fetchJSON<StrapiListResponse<any>>(url)
    const items = Array.isArray(resp?.data) ? resp.data : []

    return items.map(flattenProduct)

  } catch (err) {
    console.error('getProductsByCategory error:', err)
    return []
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  const qp = productPopulateQuery()
  qp.set('filters[title][$containsi]', query)

  const url = `${API_URL}/api/products?${qp.toString()}`

  try {
    const resp = await fetchJSON<StrapiListResponse<any>>(url, { cache: 'no-store' })
    const items = Array.isArray(resp?.data) ? resp.data : []
    return items.map(flattenProduct)
  } catch (err) {
    console.error('searchProducts error:', err)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const qp = productPopulateQuery()
  qp.set('filters[slug][$eq]', slug)

  const url = `${API_URL}/api/products?${qp.toString()}`

  try {
    const resp = await fetchJSON<StrapiListResponse<any>>(url)
    const items = Array.isArray(resp?.data) ? resp.data : []
    if (!items.length) return null
    return flattenProduct(items[0])
  } catch (err) {
    console.error('getProductBySlug error:', err)
    return null
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const qp = productPopulateQuery()
  qp.set('filters[featured][$eq]', 'true')

  const url = `${API_URL}/api/products?${qp.toString()}`

  try {
    const resp = await fetchJSON<StrapiListResponse<any>>(url)
    const items = Array.isArray(resp?.data) ? resp.data : []
    return items.map(flattenProduct)
  } catch (err) {
    console.error('getFeaturedProducts error:', err)
    return []
  }
}

// ---------------- CATEGORIES ----------------

export async function getAllCategories(): Promise<Category[]> {

  const url = `${API_URL}/api/categories?populate=image&sort=name:asc`

  try {

    const resp = await fetchJSON<StrapiListResponse<any>>(url)

    const items = Array.isArray(resp?.data) ? resp.data : []

    return items.map((entry) => {

      const raw = entry?.attributes ?? entry ?? {}

      const imageUrl =
        pickMediaUrl(
          raw.image ??
          raw.images ??
          raw.imageUrl
        ) || '/placeholder-category.jpg'

      return {
        name: raw.name ?? '',
        slug: raw.slug ?? '',
        imageUrl,
      }
    })

  } catch (err) {
    console.error('getAllCategories error:', err)
    return []
  }
}

export async function getBannerCategories(): Promise<BannerCategory[]> {
  const qp = new URLSearchParams()
  qp.set('populate[0]', 'image')
  qp.set('filters[featured][$eq]', 'true')

  const url = `${API_URL}/api/categories?${qp.toString()}`

  try {
    const resp = await fetchJSON<StrapiListResponse<any>>(url)
    const items = Array.isArray(resp?.data) ? resp.data : []

    return items.map((entry) => {
      const raw = entry?.attributes ?? entry ?? {}
      const imageUrl =
        pickMediaUrl(raw.image ?? raw.imageUrl ?? raw.images) ||
        '/placeholder-category.jpg'

      return {
        name: raw.name ?? '',
        slug: raw.slug ?? '',
        imageUrl,
      }
    })
  } catch (err) {
    console.error('getBannerCategories error:', err)
    return []
  }
}

export async function getNonBannerCategories(): Promise<BannerCategory[]> {
  const qp = new URLSearchParams()
  qp.set('populate[0]', 'image')
  qp.set('filters[featured][$eq]', 'false')

  const url = `${API_URL}/api/categories?${qp.toString()}`

  try {
    const resp = await fetchJSON<StrapiListResponse<any>>(url)
    const items = Array.isArray(resp?.data) ? resp.data : []

    return items.map((entry) => {
      const raw = entry?.attributes ?? entry ?? {}
      const imageUrl =
        pickMediaUrl(raw.image ?? raw.imageUrl ?? raw.images) ||
        '/placeholder-category.jpg'

      return {
        name: raw.name ?? '',
        slug: raw.slug ?? '',
        imageUrl,
      }
    })
  } catch (err) {
    console.error('getNonBannerCategories error:', err)
    return []
  }
}