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
      <div className="flex items-center justify-center h-full p-4">
        <Image
          src={image}
          alt={title}
          width={300}
          height={300}
          className="object-contain w-full h-full"
          unoptimized
        />
      </div>

      <div className="
        absolute inset-0 
        bg-black/40 
        opacity-0 
        group-hover:opacity-100 
        transition 
        flex items-center justify-center
      ">
        <span className="text-white text-lg md:text-xl font-semibold text-center px-4">
          {title}
        </span>
      </div>
    </Link>
  )
}