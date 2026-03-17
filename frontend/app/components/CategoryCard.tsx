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

  return (
    <Link
      href={href}
      className="
        group relative block w-full aspect-square
        overflow-hidden rounded-2xl bg-gray-100

        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-xl
        active:scale-[0.97]
      "
    >
      {/* IMAGE */}
      <Image
        src={fullImage}
        alt={title}
        fill
        unoptimized
        className="
          object-cover
          transition-transform duration-500 ease-out
          group-hover:scale-110
        "
      />

      {/* ГРАДИЕНТ */}
      <div className="
        absolute bottom-0 left-0 right-0 h-1/2
        bg-gradient-to-t from-black/70 to-transparent
        transition-opacity duration-300
        group-hover:from-black/80
      " />

      {/* TITLE */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <span className="
          text-white text-sm font-semibold
          transition-all duration-300
          group-hover:translate-y-[-2px]
        ">
          {title}
        </span>
      </div>
    </Link>
  )
}