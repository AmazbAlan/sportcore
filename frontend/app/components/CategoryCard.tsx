// frontend/app/components/CategoryCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Cat } from 'lucide-react'


interface CategoryCardProps {
  title: string
  image: string
  href: string
}


export default function CategoryCard({ title, image, href }: CategoryCardProps) {
  console.log('CategoryCard — image:', image)
  console.log('CategoryCard — title:', title)


  return (
    <Link
      href={href}
      className="group block relative h-48 rounded overflow-hidden shadow-lg transition-transform hover:scale-105"
    >
     {image.includes('placeholder') ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            unoptimized
            sizes="(max-width: 768px) 100vw, 33vw"
            
          />
        )}

      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
        <span className="text-2xl font-bold">{title}</span>
      </div>
    </Link>
  )
  
}

