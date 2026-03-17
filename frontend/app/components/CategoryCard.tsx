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
        group relative w-full aspect-square overflow-hidden rounded-2xl
      "
    >
      {/* IMAGE */}
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

      {/* GRADIENT */}
      <div
        className={`
          absolute inset-0
          ${
            isGrid
              ? 'bg-gradient-to-t from-black/50 via-black/10 to-transparent'
              : 'bg-gradient-to-t from-black/60 to-transparent'
          }
        `}
      />

      {/* TITLE */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <span className="text-white text-sm font-semibold leading-tight">
          {title}
        </span>
      </div>
    </Link>
  )
}