import { useEffect, useRef, useState } from 'react'

// 进入视口时做一次淡入上移,纯 IntersectionObserver,无第三方依赖。
export default function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={`${shown ? 'animate-fade-up' : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  )
}
