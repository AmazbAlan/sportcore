// frontend/lib/api.ts

// Базовый URL Strapi из .env.local
const API_URL = process.env.STRAPI_URL || 'http://localhost:1337'

export type Product = {
  id: number
  title: string
  price: number
  imageUrl: string
  categorySlug: string
}

// Параметры фильтрации
interface Filters {
  price?: string
}

/**
 * Преобразует entry из Strapi v5
 * в плоский объект Product
 */
function flattenEntry(entry: any): Product {
  const imgArray = Array.isArray(entry.image) ? entry.image : []
  const img = imgArray[0] ?? null

  return {
    id: entry.id,
    title: entry.title ?? '',
    price: entry.price ?? 0,
    imageUrl: img?.url ? `${API_URL}${img.url}` : '/placeholder.jpg',
    categorySlug: entry.category?.slug ?? '',
  }
}

/**
 * Вернёт _все_ продукты без фильтра по категории
 */
export async function getAllProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products?populate=*`, {
    cache: 'no-store',
  })
  const json = await res.json()
  if (!json.data || !Array.isArray(json.data)) return []
  return json.data.map(flattenEntry)
}

/**
 * Вернёт продукты по заданному slug категории и (опционально) по цене
 *
 * @param slug — строковый slug категории
 * @param filters.price — максимальная цена
 */
export async function getProductsByCategory(
  slug: string,
  filters: Filters = {}
): Promise<Product[]> {
  const qs = new URLSearchParams()

  // Обязательно фильтруем по slug категории
  qs.set('filters[category][slug][$eq]', slug)

  // Фильтр по цене, если передали
  if (filters.price) {
    qs.set('filters[price][$lte]', filters.price)
  }

  // Подгружаем связи (image и category)
  qs.set('populate', '*')

  const res = await fetch(`${API_URL}/api/products?${qs.toString()}`, {
    cache: 'no-store',
  })
  const json = await res.json()
  if (!json.data || !Array.isArray(json.data)) return []
  return json.data.map(flattenEntry)
}
