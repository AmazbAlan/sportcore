import { getAllCategories } from '../lib/api'
import CategoryCard from './components/CategoryCard'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Каталог спортивных товаров | SPORTCORE Бишкек',
    description:
      'Каталог спортивных товаров SPORTCORE: аксессуары для фитнеса, массаж и восстановление, спортивный инвентарь и товары для тренировок. Доставка по Бишкеку.',
    
    keywords: [
      'спортивные товары Бишкек',
      'фитнес аксессуары',
      'массажные товары',
      'товары для спорта',
      'инвентарь для тренировок',
      'SPORTCORE'
    ],

    openGraph: {
      title: 'Каталог спортивных товаров | SPORTCORE',
      description:
        'Магазин спортивных товаров SPORTCORE. Инвентарь для тренировок, массажные аксессуары и фитнес оборудование.',
      url: 'https://sportcore.kg/category',
      siteName: 'SPORTCORE',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: 'Каталог спортивных товаров | SPORTCORE',
      description:
        'Спортивные товары и фитнес аксессуары с доставкой по Бишкеку.',
    },

    alternates: {
      canonical: 'https://sportcore.kg/category',
    },
  }
}

export default async function CategoryIndexPage() {
  const categories = await getAllCategories()

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">

      <h1 className="text-4xl font-bold text-[#1a1f4b] mb-6">
        Каталог спортивных товаров
      </h1>

      <p className="text-gray-600 max-w-3xl mb-10">
        В интернет-магазине SPORTCORE вы найдете широкий ассортимент спортивных товаров
        для тренировок, фитнеса и восстановления. В каталоге представлены аксессуары
        для спорта, массажные роллы, аппликаторы, фитнес инвентарь и другие товары
        для активного образа жизни.
      </p>

      {categories.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          Категории пока не добавлены
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.slug}
              title={cat.name}
              image={cat.imageUrl}
              href={`/category/${cat.slug}`}
            />
          ))}
        </div>
      )}

      {/* SEO текст для Google */}
      <section className="mt-16 max-w-3xl text-gray-600 space-y-4">
        <h2 className="text-2xl font-semibold text-[#1a1f4b]">
          Спортивные товары и аксессуары
        </h2>

        <p>
          SPORTCORE — интернет-магазин спортивных товаров в Бишкеке.
          В нашем каталоге представлены товары для тренировок дома
          и в зале: массажные аксессуары, роллы для МФР,
          спортивные аксессуары и инвентарь для восстановления мышц.
        </p>

        <p>
          Мы предлагаем качественные товары для спорта,
          которые помогают улучшить физическую форму,
          ускорить восстановление после тренировок
          и поддерживать активный образ жизни.
        </p>
      </section>

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Каталог спортивных товаров",
            url: "https://sportcore.kg/category",
            description:
              "Каталог спортивных товаров SPORTCORE: аксессуары для фитнеса, массаж и восстановление, спортивный инвентарь.",
          }),
        }}
      />

    </main>
  )
}