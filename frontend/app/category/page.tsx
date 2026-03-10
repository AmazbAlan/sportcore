import { getAllCategories } from '../../lib/api'
import CategoryPageClient from './CategoryPageClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Каталог спортивных товаров | SPORTCORE Бишкек',
  description:
    'Каталог спортивных товаров SPORTCORE: фитнес аксессуары, массажные роллы, аппликаторы и товары для восстановления.',
  alternates: {
    canonical: 'https://sportcore.kg/category',
  },
}

export default async function CategoryIndexPage() {
  const categories = await getAllCategories()

  return <CategoryPageClient categories={categories} />
}
<script
type="application/ld+json"
dangerouslySetInnerHTML={{
__html: JSON.stringify({
"@context": "https://schema.org",
"@type": "CollectionPage",
"name": "Каталог SPORTCORE",
"url": "https://sportcore.kg/category"
})
}}
/>