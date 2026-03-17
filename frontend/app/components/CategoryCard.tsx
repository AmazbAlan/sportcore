import Link from 'next/link'
import Image from 'next/image'

interface CategoryCardProps {
  title: string
  image: string
  href: string
}

export default function CategoryCard({ title, image, href }: CategoryCardProps) {
  const fullImage = image?.startsWith('http')
    ? image
    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${image}`

  return (
    <Link
      href={href}
      className="
        group 
        relative 
        aspect-square 
        bg-white 
        rounded-2xl 
        shadow-sm 
        hover:shadow-lg 
        active:scale-95 
        transition-all 
        duration-300 
        overflow-hidden
      "
    >
      {/* 📦 Картинка */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={fullImage}
          alt={title}
          fill
          className="object-contain scale-110"
          unoptimized
        />
      </div>

      {/* 🏷️ Название */}
      <div className="
        absolute bottom-0 left-0 right-0
        bg-gradient-to-t from-black/70 via-black/40 to-transparent
        p-3 md:p-4
      ">
        <span className="text-white text-sm md:text-base font-semibold">
          {title}
        </span>
      </div>

      {/* ✨ hover эффект */}
      <div className="
        absolute inset-0 
        bg-black/10 
        opacity-0 
        group-hover:opacity-100 
        transition
      " />
    </Link>
  )
}