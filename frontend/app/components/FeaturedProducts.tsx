import ProductCard from './ProductCard'

const dummyProducts = [
  {
    title: 'Nordica Speedmachine 110 Ski Boots 2017',
    price: 199.99,
    image: '/boots1.png',
    rating: 4,
    reviews: 9
  },
  {
    title: 'Nordica Speedmachine 100 Ski Boots 2018',
    price: 399.99,
    image: '/boots2.png',
    rating: 5,
    reviews: 1
  },
  {
    title: 'Nordica Speedmachine 120 Ski Boots 2018',
    price: 599.99,
    image: '/boots3.png',
    rating: 4,
    reviews: 9
  },
  {
    title: 'Nordica Sportmachine 100 Ski Boots 2018',
    price: 399.99,
    image: '/boots4.png',
    rating: 4,
    reviews: 4
  }
]

export default function FeaturedProducts() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1a1f4b]">Хиты продаж</h2>
        <a href="/catalog" className="bg-yellow-400 text-[#1a1f4b] px-4 py-2 rounded hover:bg-yellow-300 transition">
          Смотреть все новинки
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {dummyProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </section>
  )
}
