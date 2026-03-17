'use client'

import { motion } from 'framer-motion'

export default function AnimatedCard({
  children,
  delay = 0
}: {
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: 'easeOut'
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  )
}