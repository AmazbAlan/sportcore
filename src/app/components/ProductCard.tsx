import Image from 'next/image'

interface ProductCardProps {
  title: string
  price: number
  image: string
  rating?: number
  reviews?: number
}

export default function ProductCard({ title, price, image, rating = 4, reviews = 10 }: ProductCardProps) {
  return (
    <div className="bg-white rounded shadow hover:shadow-lg transition p-4 text-center">
      <div className="w-full h-52 relative mb-4">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="text-yellow-400 text-sm mb-1">
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)} <span className="text-gray-500 text-xs">({reviews})</span>
      </div>
      <div className="font-semibold">${price.toFixed(2)}</div>
    </div>
  )
}
