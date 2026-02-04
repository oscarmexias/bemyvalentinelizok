'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'

export default function NoButton() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [originalPosition, setOriginalPosition] = useState({ x: 0, y: 0 })
  const [attempts, setAttempts] = useState(0)
  const [isNearCursor, setIsNearCursor] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const returnTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Calcular posición inicial (al lado del YES, centrado)
    if (typeof window !== 'undefined' && buttonRef.current) {
      const updatePosition = () => {
        // El botón NO debe estar al lado del YES, así que usamos posición relativa
        // En lugar de absolute, usaremos relative con transform
        setOriginalPosition({ x: 0, y: 0 })
        setPosition({ x: 0, y: 0 })
      }
      updatePosition()
      window.addEventListener('resize', updatePosition)
      return () => window.removeEventListener('resize', updatePosition)
    }
  }, [])

  // Efecto para regresar al centro cuando no hay interacción
  useEffect(() => {
    if (!isNearCursor && (Math.abs(position.x) > 1 || Math.abs(position.y) > 1)) {
      if (returnTimerRef.current) {
        clearTimeout(returnTimerRef.current)
      }
      
      const returnInterval = setInterval(() => {
        setPosition((current) => {
          const dx = 0 - current.x
          const dy = 0 - current.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // Si está muy cerca del centro, detener
          if (distance < 2) {
            clearInterval(returnInterval)
            return { x: 0, y: 0 }
          }
          
          // Regresar suavemente
          return {
            x: current.x + dx * 0.1,
            y: current.y + dy * 0.1,
          }
        })
      }, 50)
      
      returnTimerRef.current = returnInterval as any
    } else if (isNearCursor && returnTimerRef.current) {
      clearInterval(returnTimerRef.current)
      returnTimerRef.current = null
    }

    return () => {
      if (returnTimerRef.current) {
        clearInterval(returnTimerRef.current)
      }
    }
  }, [isNearCursor, position])

  const calculatePosition = useCallback((clientX: number, clientY: number) => {
    if (!buttonRef.current || !containerRef.current) return

    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const buttonCenterX = rect.left + rect.width / 2
    const buttonCenterY = rect.top + rect.height / 2

    const mouseX = clientX
    const mouseY = clientY

    const distance = Math.sqrt(
      Math.pow(mouseX - buttonCenterX, 2) + Math.pow(mouseY - buttonCenterY, 2)
    )

    // Solo activar cuando el cursor está MUY cerca (80px en desktop, 60px en móvil)
    const threshold = window.innerWidth < 768 ? 60 : 80
    const activationDistance = window.innerWidth < 768 ? 100 : 120
    
    if (distance < activationDistance) {
      setIsNearCursor(true)
      
      if (distance < threshold) {
        setPosition((currentPosition) => {
          const angle = Math.atan2(mouseY - buttonCenterY, mouseX - buttonCenterX)
          // Reducir la velocidad de repulsión (más suave)
          const repelDistance = (threshold - distance) * 0.3 * (1 + attempts * 0.1)
          
          const newX = currentPosition.x - Math.cos(angle) * repelDistance
          const newY = currentPosition.y - Math.sin(angle) * repelDistance

          // Limitar dentro de un área visible (no se pierde)
          const maxOffset = window.innerWidth < 768 ? 100 : 150
          const finalX = Math.max(-maxOffset, Math.min(maxOffset, newX))
          const finalY = Math.max(-maxOffset, Math.min(maxOffset, newY))

          if (distance < 50) {
            setAttempts((prev) => prev + 1)
          }

          return {
            x: finalX,
            y: finalY,
          }
        })
      }
    } else {
      setIsNearCursor(false)
    }
  }, [attempts])

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if ('clientX' in e) {
      calculatePosition(e.clientX, e.clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches && e.touches.length > 0) {
      calculatePosition(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  const handleClick = () => {
    // Aumentar repulsión al hacer clic, pero más suave
    setAttempts((prev) => prev + 1)
    if (!buttonRef.current) return

    // Rebote suave hacia una dirección aleatoria
    const randomAngle = Math.random() * Math.PI * 2
    const bounceDistance = 80 + attempts * 20 // Más suave

    const newX = position.x + Math.cos(randomAngle) * bounceDistance
    const newY = position.y + Math.sin(randomAngle) * bounceDistance

    // Limitar dentro del área visible
    const maxOffset = window.innerWidth < 768 ? 100 : 150
    setPosition({
      x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
      y: Math.max(-maxOffset, Math.min(maxOffset, newY)),
    })
  }

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      calculatePosition(e.clientX, e.clientY)
    }
    const handleGlobalTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches && e.touches.length > 0) {
        calculatePosition(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const handleGlobalTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        calculatePosition(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
    window.addEventListener('touchstart', handleGlobalTouchStart)

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('touchmove', handleGlobalTouchMove)
      window.removeEventListener('touchstart', handleGlobalTouchStart)
    }
  }, [calculatePosition])

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        display: 'inline-block',
        width: 'auto',
        height: 'auto',
      }}
    >
      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="no-button"
        style={{
          position: 'relative',
          transform: `translate(${position.x}px, ${position.y}px)`,
          padding: 'clamp(1rem, 2.5vw, 1.5rem) clamp(2rem, 5vw, 3rem)',
          fontSize: 'clamp(0.8rem, 3vw, 1.5rem)',
          fontFamily: "'Press Start 2P', cursive",
          backgroundColor: '#888',
          color: '#fff',
          border: '4px solid #666',
          borderRadius: '8px',
          cursor: 'not-allowed',
          textTransform: 'uppercase',
          boxShadow: '0 6px 0 #666, 0 10px 15px rgba(0,0,0,0.2)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 5,
          userSelect: 'none',
          pointerEvents: 'auto',
          touchAction: 'none',
          minWidth: '100px',
          whiteSpace: 'nowrap',
        }}
      >
        NO
      </button>
    </div>
  )
}
