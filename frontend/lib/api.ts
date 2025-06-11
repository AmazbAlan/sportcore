const API_URL = process.env.STRAPI_URL || 'http://localhost:1337'

/** Простая модель продукта */
export type Product = {
  id: number
  slug: string
  title: string
  price: number
  imageUrl: string
  categorySlug: string
  description: any[]    // ← raw description из Strapi
}

/** Простая модель категории */
export type Category = {
  name: string
  slug: string
}

/** Параметры фильтрации при запросе продуктов */
interface ProductFilters {
  price?: string
}

/**
 * Вспомогательная функция: плоско мапит entry Strapi v5 → Product
 */
function flattenProduct(entry: any): Product {
  const imgArr = Array.isArray(entry.image) ? entry.image : []
  const img = imgArr[0] ?? null

  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title ?? '',
    price: entry.price ?? 0,
    imageUrl: img?.url ? `${API_URL}${img.url}` : '/placeholder.jpg',
    categorySlug: entry.category?.slug ?? '',
    description: entry.description ?? [],
  }
}

/**
 * Получить все продукты (без фильтров)
 */
export async function getAllProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products?populate=*`, {
    cache: 'no-store',
  })
  const json = await res.json()
  if (!json.data || !Array.isArray(json.data)) return []
  return json.data.map(flattenProduct)
}

/**
 * Получить продукты по slug категории и (опционально) по цене
 * @param slug slug категории
 * @param filters.price максимальная цена
 */
export async function getProductsByCategory(
  slug: string,
  filters: ProductFilters = {}
): Promise<Product[]> {
  const qs = new URLSearchParams()
  qs.set('filters[category][slug][$eq]', slug)
  if (filters.price) {
    qs.set('filters[price][$lte]', filters.price)
  }
  qs.set('populate', '*')

  const res = await fetch(`${API_URL}/api/products?${qs}`, {
    cache: 'no-store',
  })
  const json = await res.json()
  if (!json.data || !Array.isArray(json.data)) return []
  return json.data.map(flattenProduct)
}

/**
 * Поиск продуктов по части названия (регистронезависимо)
 * @param query строка поиска
 */
export async function getProductsBySearch(query: string): Promise<Product[]> {
  const qs = new URLSearchParams()
  qs.set('filters[title][$containsi]', query)
  qs.set('populate', '*')

  const res = await fetch(`${API_URL}/api/products?${qs.toString()}`, {
    cache: 'no-store',
  })
  const json = await res.json()
  if (!json.data || !Array.isArray(json.data)) return []
  return json.data.map(flattenProduct)
}

/**
 * Получить один продукт по slug (берёт первый из списка)
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProductsByCategory(slug)
  return products.length > 0 ? products[0] : null
}

/**
 * Получить все категории
 */
export async function getAllCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/api/categories?populate=*`, {
    cache: 'no-store',
  })
  const json = await res.json()
  if (!json.data || !Array.isArray(json.data)) return []
  return json.data.map((entry: any) => ({
    name: entry.name,
    slug: entry.slug,
  }))
}
