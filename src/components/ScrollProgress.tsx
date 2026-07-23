'use client'
import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPosition = window.scrollY
      const percentage = (scrollPosition / totalHeight) * 100
      setProgress(percentage)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-red-600 to-orange-600 z-[100] transition-all duration-100" 
      style={{ width: `${progress}%` }} 
    />
  )
}
