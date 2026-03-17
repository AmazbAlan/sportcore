import Link from 'next/link'
import Image from 'next/image'

interface CategoryCardProps {
  title: string
  image: string
  href: string
  variant?: 'featured' | 'grid'
}

export default function CategoryCard({
  title,
  image,
  href,
  variant = 'featured'
}: CategoryCardProps) {
  const fullImage = image?.startsWith('http')
    ? image
    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${image}`

  const isGrid = variant === 'grid'

  return (
    <Link
      href={href}
      className="
        group relative w-full overflow-hidden rounded-2xl
        bg-white shadow-sm hover:shadow-md transition-all duration-300
      "
    >
      {/* 🔲 FEATURED — КВАДРАТ */}
      {!isGrid && (
        <div className="relative w-full aspect-square">
          <Image
            src={fullImage}
            alt={title}
            fill
            className="
              object-contain
              p-6
              group-hover:scale-105
              transition-transform duration-300
            "
            unoptimized
          />

          {/* нормальный градиент */}
          <div className="
            absolute bottom-0 left-0 right-0
            bg-gradient-to-t from-black/50 to-transparent
            p-3
          ">
            <span className="text-white text-sm font-semibold">
              {title}
            </span>
          </div>
        </div>
      )}

      {/* 🧱 GRID — КАТАЛОГ */}
      {isGrid && (
        <div className="relative w-full aspect-square">
          <Image
            src={fullImage}
            alt={title}
            fill
            className="
              object-cover
              group-hover:scale-105
              transition-transform duration-300
            "
            unoptimized
          />

          {/* ЛЕГКИЙ градиент (НЕ душит картинку) */}
          <div className="
            absolute bottom-0 left-0 right-0
            bg-gradient-to-t from-black/40 via-black/10 to-transparent
            p-3
          ">
            <span className="text-white text-sm font-semibold">
              {title}
            </span>
          </div>
        </div>
      )}
    </Link>
  )
}