import ProductCard from './ProductCard'

const newestProducts = [
  { title: 'Oakley MOD 3 Helmet', price: 199.99, image: '/new1.png', rating: 4, reviews: 9 },
  { title: 'Nordica Speedmachine 100 Ski Boots 2018', price: 399.99, image: '/new2.png', rating: 5, reviews: 1 },
  { title: 'Rome Blackjack Snowboard - Blem 2018', price: 359.99, image: '/new3.png', rating: 4, reviews: 9 },
  { title: 'Rome Powder Room Splitboard Women’s 2018', price: 679.99, image: '/new4.png', rating: 4, reviews: 4 },
  { title: 'Arbor Foundation Snowboard 2018', price: 199.99, image: '/new5.png', rating: 4, reviews: 9 },
  { title: 'Pret Cirque X Helmet', price: 250.00, image: '/new6.png', rating: 4, reviews: 1 },
  { title: 'Sweet Protection Igniter Alpiniste Helmet', price: 239.95, image: '/new7.png', rating: 4, reviews: 9 },
  { title: 'Nordica Sportmachine 100 Ski Boots 2018', price: 399.99, image: '/new8.png', rating: 4, reviews: 4 }
]

export default function NewestArrivals() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1a1f4b]">Новинки</h2>
        <a href="/catalog" className="bg-lime-400 text-black px-4 py-2 rounded hover:bg-lime-300 transition">
          Смотреть все новинки
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {newestProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </section>
  )
}
