import Link from 'next/link'
import Image from 'next/image'

interface CategoryCardProps {
  title: string
  image: string
  href: string
}

export default function CategoryCard({ title, image, href }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="
      bg-white
      rounded-xl
      overflow-hidden
      shadow-md
      hover:shadow-xl
      transition
      flex
      flex-col
      group
      "
    >

      {/* IMAGE */}

      <div className="relative aspect-square bg-gray-50">
        <Image
          src={image || '/placeholder.jpg'}
          alt={title}
          fill
          className="object-contain p-6 group-hover:scale-105 transition"
          unoptimized
        />
      </div>

      {/* TITLE */}

      <div className="py-3 text-center">
        <span className="font-semibold text-[#1a1f4b]">
          {title}
        </span>
      </div>

    </Link>
  )
}