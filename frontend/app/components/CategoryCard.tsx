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
        w-full
        h-[180px] md:h-[240px]
        bg-[#f8f9fb]
        rounded-2xl 
        shadow-sm 
        hover:shadow-xl 
        transition-all 
        duration-300 
        overflow-hidden
      "
    >
      {/* 📦 Картинка */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={fullImage}
          alt={title}
          fill
          className="
            object-contain 
            scale-105 
            group-hover:scale-110 
            transition-transform 
            duration-500
          "
          unoptimized
        />
      </div>

      {/* 🌫️ мягкий градиент (очень subtle) */}
      <div className="
        absolute inset-0 
        bg-gradient-to-t from-black/40 via-black/10 to-transparent
      " />

      {/* 🏷️ Название */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="
          text-white 
          text-base md:text-lg 
          font-semibold 
          tracking-wide
        ">
          {title}
        </span>
      </div>

      {/* ✨ hover overlay */}
      <div className="
        absolute inset-0 
        bg-black/0 
        group-hover:bg-black/10 
        transition
      " />
    </Link>
  )
}