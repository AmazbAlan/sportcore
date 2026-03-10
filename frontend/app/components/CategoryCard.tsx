import Link from 'next/link'
import Image from 'next/image'

interface CategoryCardProps {
  title: string
  image: string
  href: string
}

export default function CategoryCard({
  title,
  image,
  href,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="
      group relative aspect-square rounded-xl overflow-hidden
      bg-white shadow-md hover:shadow-xl
      transition duration-300
      "
    >
      <Image
        src={image || '/placeholder.jpg'}
        alt={title}
        fill
        className="object-contain p-6 transition group-hover:scale-110"
        unoptimized
      />

      <div
        className="
        absolute inset-0 bg-black/40 opacity-0
        group-hover:opacity-100 transition
        flex items-center justify-center
        "
      >
        <span className="text-white text-xl font-semibold text-center px-4">
          {title}
        </span>
      </div>
    </Link>
  )
}