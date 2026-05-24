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
    next: { revalidate: 60 }, // было 3600 — раз в час слишком долго для CRM-связки
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

// Новая модель вариантов: атрибуты + варианты
export type VariantItem = {
  id: string
  values: Record<string, string> // например { "Размер": "42", "Цвет": "Чёрный" }
  stock: number
  image_url?: string | null
  price?: number | null // если null — берётся цена товара
}

export type VariantsConfig = {
  attributes: string[] // например ["Размер", "Цвет"]
  items: VariantItem[]
}

// Legacy тип, оставляем для совместимости со старым CartControls
// (будет удалён когда сайт полностью перейдёт на VariantsConfig)
export type ProductVariant = {
  id: number | string
  size: string
  stock: number
}

export type Product = {
  id: number
  slug: string
  title: string
  price: number
  qty?: number
  imageUrl: string
  categorySlug: string
  description: RichTextBlock[]
  variants: ProductVariant[] // legacy — для обратной совместимости
  variantsConfig: VariantsConfig | null // новая модель
  seo_title?: string
  seo_desc?: string
  featured?: boolean
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

// Нормализуем description: может прийти null, строкой, или массивом блоков.
// Сайту нужен массив [{ children: [{ text: '...' }] }] (legacy формат Strapi).
function normalizeDescription(raw: any): RichTextBlock[] {
  if (!raw) return []
  if (Array.isArray(raw)) {
    // Уже массив — но проверим что это массив объектов с children
    return raw.filter((b: any) => b && typeof b === 'object' && Array.isArray(b.children))
  }
  if (typeof raw === 'string') {
    // CRM иногда сохраняет строкой — оборачиваем в правильный формат
    return [{ children: [{ text: raw }] }]
  }
  if (typeof raw === 'object' && Array.isArray(raw.children)) {
    return [raw]
  }
  return []
}

// Нормализуем variants из БД (jsonb). Поддерживаем:
// 1. Новый формат: { attributes: [...], items: [...] }
// 2. Старый Strapi формат: массив [{ id, size, stock, color }]
// 3. null или мусор → пусто
function normalizeVariants(raw: any): VariantsConfig | null {
  if (!raw) return null
  // Новый формат
  if (typeof raw === 'object' && !Array.isArray(raw) && Array.isArray(raw.attributes) && Array.isArray(raw.items)) {
    if (raw.attributes.length === 0 || raw.items.length === 0) return null
    return {
      attributes: raw.attributes.map(String),
      items: raw.items.map((it: any, i: number) => ({
        id: String(it?.id || `v${i + 1}`),
        values: (it?.values && typeof it.values === 'object') ? it.values : {},
        stock: Number(it?.stock ?? 0),
        image_url: it?.image_url || null,
        price: it?.price != null ? Number(it.price) : null,
      })),
    }
  }
  // Старый формат Strapi (массив)
  if (Array.isArray(raw) && raw.length > 0) {
    return {
      attributes: ['Размер'],
      items: raw.map((v: any, i: number) => ({
        id: String(v?.id ?? `v${i + 1}`),
        values: { 'Размер': String(v?.size ?? '') },
        stock: Number(v?.stock ?? 0),
        image_url: v?.color?.[0]?.image?.[0]?.url || null,
        price: null,
      })),
    }
  }
  return null
}

function toProduct(row: any): Product {
  // CRM хранит "сток" в колонке qty. Делаем синтетический variant если variants пустой,
  // чтобы CartControls (старый) корректно показывал "в наличии / нет в наличии".
  const qty = Number(row.qty ?? 0)

  const variantsConfig = normalizeVariants(row.variants)

  // Legacy variants для обратной совместимости со старым CartControls (если ещё не обновлён)
  let legacyVariants: ProductVariant[]
  if (variantsConfig) {
    legacyVariants = variantsConfig.items.map(it => ({
      id: it.id,
      size: variantsConfig.attributes.map(a => it.values[a]).filter(Boolean).join(' / '),
      stock: it.stock,
    }))
  } else {
    legacyVariants = [{ id: row.id, size: '', stock: qty }]
  }

  return {
    id: row.id,
    slug: row.slug ?? String(row.id),
    title: row.name ?? '',
    price: Number(row.price ?? 0),
    qty,
    imageUrl: row.image_url ?? (Array.isArray(row.images) && row.images[0]) ?? '/placeholder.jpg',
    categorySlug: row.category_slug ?? row.category ?? '',
    description: normalizeDescription(row.description),
    variants: legacyVariants,
    variantsConfig,
    seo_title: row.seo_title ?? undefined,
    seo_desc: row.seo_desc ?? undefined,
    featured: Boolean(row.featured),
  }
}

function toCategory(row: any): Category {
  return {
    name: row.name ?? '',
    slug: row.slug ?? '',
    imageUrl: row.image_url ?? '/placeholder-category.jpg',
  }
}

// Товар «доступен на сайте» только если у него есть slug.
// Без slug — карточка ведёт на /product/undefined → 404, поэтому скрываем.
function isPublishable(row: any): boolean {
  return Boolean(row?.slug && String(row.slug).trim().length > 0)
}

// ---- PRODUCTS ----

export async function getAllProducts(): Promise<Product[]> {
  try {
    const rows = await sb<any>('products?order=id.asc&select=*')
    return rows.filter(isPublishable).map(toProduct)
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
    // Принимаем и category_slug, и legacy "category" — для совместимости с товарами без category_slug
    let query = `products?select=*&or=(category_slug.eq.${encodeURIComponent(slug)},category.eq.${encodeURIComponent(slug)})`
    if (maxPrice) query += `&price=lte.${maxPrice}`
    if (search) query += `&name=ilike.*${encodeURIComponent(search)}*`
    const rows = await sb<any>(query)
    return rows.filter(isPublishable).map(toProduct)
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
    return rows.filter(isPublishable).map(toProduct)
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
    return rows.filter(isPublishable).map(toProduct)
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