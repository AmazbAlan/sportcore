import CategoryCard from './CategoryCard'

const categories = [
  { title: 'Clothing', image: '/cat1.jpg', href: '/category/clothing' },
  { title: 'Footwear', image: '/cat2.jpg', href: '/category/footwear' },
  { title: 'Equipment', image: '/cat3.jpg', href: '/category/equipment' },
  { title: 'Mens Clothing', image: '/cat4.jpg', href: '/category/mens', buttonText: 'Shop Mens' },
  { title: 'Womens Clothing', image: '/cat5.jpg', href: '/category/womens', buttonText: 'Shop Womens' }
]

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <CategoryCard key={idx} {...cat} />
        ))}
      </div>
    </section>
  )
}
