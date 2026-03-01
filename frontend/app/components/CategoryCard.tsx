// frontend/app/components/CategoryCard.tsx
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
      className="group block relative aspect-square rounded overflow-hidden shadow-lg transition-transform hover:scale-105"
    >
      {image.includes('placeholder') ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain"
        />
      ) : (
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain"
          unoptimized
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      )}

      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
        <span className="text-2xl font-bold text-center px-2">
          {title}
        </span>
      </div>
    </Link>
  )
}
  


