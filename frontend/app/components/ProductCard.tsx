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
      className="group block bg-white rounded shadow transition-transform transform hover:shadow-lg hover:scale-105"
    >
      <div className="relative w-full h-52 mb-4">
        <Image src={image} alt={title} fill className="object-contain" />
      </div>
      <div className="px-4 pb-4 text-center">
        <h3 className="font-medium mb-2 text-[#1a1f4b] group-hover:text-black transition-colors">
          {title}
        </h3>
        <p className="font-bold text-[#1a1f4b] group-hover:text-black transition-colors">
          {price.toLocaleString()} сом
        </p>
      </div>
    </Link>
  )
}
