// frontend/app/components/ProductCard.tsx
import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  slug: string
  title: string
  price?: number
  image: string
  href?: string
}

export default function ProductCard({
  slug,
  title,
  price = 0,
  image,
  href,
}: ProductCardProps) {
  const linkHref = href ?? `/product/${slug}`

  return (
    <Link
      href={linkHref}
      className="group block relative bg-white rounded-xl shadow transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      {/* 🔥 Бейдж Хит */}
      <div className="absolute top-3 left-3 z-10 bg-yellow-400 text-[#1a1f4b] text-xs font-semibold px-3 py-1 rounded-full shadow">
        🔥 Хит
      </div>

      {/* Изображение */}
      <div className="relative w-full h-52 mb-4 bg-gray-50">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Информация */}
      <div className="px-4 pb-4 text-center">
        <h3 className="font-medium mb-2 text-[#1a1f4b] group-hover:text-black transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="font-bold text-lg text-[#1a1f4b] group-hover:text-black transition-colors">
          {price.toLocaleString()} сом
        </p>
      </div>
    </Link>
  )
}