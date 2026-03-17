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
      className={`
        group relative w-full overflow-hidden
        rounded-2xl bg-white
        transition-all duration-300
        
        ${isGrid
          ? 'shadow-sm hover:shadow-md'
          : 'shadow-md hover:shadow-xl'
        }
      `}
    >
      {/* 📦 КАРТИНКА */}
      <div
        className={`
          relative w-full flex items-center justify-center
          
          ${isGrid
            ? 'h-[140px]'
            : 'h-[160px] md:h-[200px]'
          }
        `}
      >
        <Image
          src={fullImage}
          alt={title}
          fill
          className="
            object-contain
            p-4
            group-hover:scale-105
            transition-transform duration-300
          "
          unoptimized
        />
      </div>

      {/* 🏷️ ТЕКСТ */}
      <div
        className={`
          px-4 pb-4
          ${isGrid ? 'pt-1' : 'pt-2'}
        `}
      >
        <span className="
          text-sm md:text-base
          font-medium
          text-gray-800
        ">
          {title}
        </span>
      </div>
    </Link>
  )
}