import { getBannerCategories } from '../../lib/api'
import CategoryGridClient from './CategoryGridClient'

export const dynamic = 'force-dynamic'

export default async function CategoryGrid() {
  const categories = await getBannerCategories()

  if (!categories.length) return null

  return <CategoryGridClient categories={categories} />
}