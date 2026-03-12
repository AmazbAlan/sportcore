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
      className="group block bg-white rounded-lg shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image container */}
      <div className="relative w-full h-44 sm:h-52 mb-4">

        {/* Badge */}
        <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-[#1a1f4b] text-xs font-semibold px-3 py-1 rounded-md shadow">
          Хит
        </div>

        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-2"
        />
      </div>

      {/* Text */}
      <div className="px-4 pb-4 text-center">

        <h3 className="font-medium mb-2 text-[#1a1f4b] group-hover:text-black transition-colors line-clamp-2 text-sm sm:text-base">
          {title}
        </h3>

        <p className="font-bold text-[#1a1f4b] group-hover:text-black transition-colors text-base sm:text-lg">
          {price.toLocaleString()} сом
        </p>

      </div>
    </Link>
  )
}