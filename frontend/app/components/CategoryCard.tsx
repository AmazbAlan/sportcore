// frontend/app/components/CategoryCard.tsx
import Link from 'next/link'
import Image from 'next/image'

interface CategoryCardProps {
  title: string        // именно title, а не name
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
      className="group block relative h-48 rounded overflow-hidden shadow-lg transform transition-transform hover:scale-105"
    >
      <Image src={image} alt={title} fill className="object-cover" />
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
        <span className="uppercase text-sm mb-1">Shop all</span>
        <span className="text-2xl font-bold">{title}</span>
      </div>
    </Link>
  )
}
