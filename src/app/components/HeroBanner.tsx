import Image from 'next/image'
import Link from 'next/link'

export default function HeroBanner() {
    return (
      <section className="relative w-full h-[600px] bg-[#1a1f4b] text-white overflow-hidden">
        <Image
          src="/banner.jpg"
          alt="Sportcore Banner"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-400 drop-shadow-lg">
            Добро пожаловать в Sportcore
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/90">
            Новая коллекция спортивной одежды 2025 уже в наличии!
          </p>
          <Link
            href="/catalog"
            className="mt-6 bg-yellow-400 text-[#1a1f4b] px-6 py-3 font-semibold rounded hover:bg-yellow-300 transition"
          >
            Перейти в каталог
          </Link>
        </div>
      </section>
    )
  }
  