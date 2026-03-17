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

  // 🎯 РАЗНЫЕ СТИЛИ
  const isGrid = variant === 'grid'

  return (
    <Link
      href={href}
      className={`
        group relative w-full overflow-hidden transition-all duration-300
        
        ${isGrid
          ? 'bg-white rounded-xl shadow-sm hover:shadow-md'
          : 'bg-white rounded-2xl shadow-sm hover:shadow-lg active:scale-95'
        }
      `}
    >
      {/* 📦 КАРТИНКА */}
      <div
        className={`
          relative w-full flex items-center justify-center
          
          ${isGrid
            ? 'h-[120px] sm:h-[140px]'
            : 'h-[140px] sm:h-[180px] md:h-[220px] lg:h-[260px]'
          }
        `}
      >
        <Image
          src={fullImage}
          alt={title}
          fill
          className={`
            ${isGrid
              ? 'object-contain p-4 group-hover:scale-105'
              : 'object-contain scale-110 group-hover:scale-115'
            }
            transition-transform duration-300
          `}
          unoptimized
        />
      </div>

      {/* 🏷️ НАЗВАНИЕ */}
      {isGrid ? (
        // 📦 ДЛЯ КАТАЛОГА (чистый стиль)
        <div className="p-3">
          <span className="text-sm font-medium text-gray-800">
            {title}
          </span>
        </div>
      ) : (
        // 🔥 ДЛЯ FEATURED
        <div className="
          absolute bottom-0 left-0 right-0
          bg-gradient-to-t from-black/70 via-black/40 to-transparent
          p-3 md:p-4
        ">
          <span className="text-white text-sm md:text-base font-semibold">
            {title}
          </span>
        </div>
      )}

      {/* ✨ hover overlay только для featured */}
      {!isGrid && (
        <div className="
          absolute inset-0 
          bg-black/10 
          opacity-0 
          group-hover:opacity-100 
          transition
        " />
      )}
    </Link>
  )
}