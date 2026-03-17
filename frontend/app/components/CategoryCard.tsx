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
      "
    >
      {/* IMAGE */}
      <Image
        src={fullImage}
        alt={title}
        fill
        className="object-cover"
        unoptimized
      />

      {/* ГРАДИЕНТ (только снизу, не на всю карточку!) */}
      <div className="
        absolute bottom-0 left-0 right-0 h-1/2
        bg-gradient-to-t from-black/60 to-transparent
      " />

      {/* TITLE */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <span className="text-white text-sm font-semibold">
          {title}
        </span>
      </div>
    </Link>
  )
}