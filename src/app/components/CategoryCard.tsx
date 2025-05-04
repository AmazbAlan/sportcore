import Image from 'next/image'
import Link from 'next/link'

interface CategoryCardProps {
  title: string
  image: string
  href: string
  buttonText?: string
}

export default function CategoryCard({ title, image, href, buttonText }: CategoryCardProps) {
  return (
    <div className="relative rounded overflow-hidden shadow-md group">
      <Image
        src={image}
        alt={title}
        width={400}
        height={300}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-4">
        <p className="text-sm">Shop all</p>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <Link
          href={href}
          className="bg-lime-400 text-black px-4 py-2 font-semibold rounded hover:bg-lime-300 transition"
        >
          {buttonText || `Shop ${title}`}
        </Link>
      </div>
    </div>
  )
}
