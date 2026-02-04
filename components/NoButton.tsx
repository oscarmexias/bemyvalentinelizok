'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function NoButton() {
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const [attempts, setAttempts] = useState(0)
  const [isNearCursor, setIsNearCursor] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastPositionRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics para desaceleración suave
  const springConfig = { 
    damping: 15 + attempts * 2, // Aumenta resistencia con intentos
    stiffness: 100 + attempts * 10,
    mass: 0.5
  }

  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const calculateRepulsion = useCallback((clientX: number, clientY: number) => {
    if (!buttonRef.current) return

    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const buttonCenterX = rect.left + rect.width / 2
    const buttonCenterY = rect.top + rect.height / 2

    const distance = Math.sqrt(
      Math.pow(clientX - buttonCenterX, 2) + Math.pow(clientY - buttonCenterY, 2)
    )

    const threshold = window.innerWidth < 768 ? 60 : 80
    const activationDistance = window.innerWidth < 768 ? 100 : 120

    if (distance < activationDistance) {
      setIsNearCursor(true)

      if (distance < threshold) {
        const angle = Math.atan2(clientY - buttonCenterY, clientX - buttonCenterX)
        
        // Fuerza agresiva al inicio, aumenta con intentos
        const baseForce = 200 + attempts * 50
        const forceMultiplier = (threshold - distance) / threshold
        const totalForce = baseForce * forceMultiplier * (1 + attempts * 0.3)

        const currentX = x.get()
        const currentY = y.get()

        // Calcular nueva posición con fuerza agresiva
        const newX = currentX - Math.cos(angle) * totalForce
        const newY = currentY - Math.sin(angle) * totalForce

        // Límites de la pantalla con rebote
        const maxX = (window.innerWidth - rect.width) / 2
        const maxY = (window.innerHeight - rect.height) / 2
        const minX = -(window.innerWidth - rect.width) / 2
        const minY = -(window.innerHeight - rect.height) / 2

        // Aplicar con rebote en bordes
        let finalX = newX
        let finalY = newY

        if (newX > maxX) {
          finalX = maxX - (newX - maxX) * 0.7 // Rebote con pérdida de energía
          setVelocity(prev => ({ ...prev, x: -prev.x * 0.7 }))
        } else if (newX < minX) {
          finalX = minX + (minX - newX) * 0.7
          setVelocity(prev => ({ ...prev, x: -prev.x * 0.7 }))
        }

        if (newY > maxY) {
          finalY = maxY - (newY - maxY) * 0.7
          setVelocity(prev => ({ ...prev, y: -prev.y * 0.7 }))
        } else if (newY < minY) {
          finalY = minY + (minY - newY) * 0.7
          setVelocity(prev => ({ ...prev, y: -prev.y * 0.7 }))
        }

        // Limitar dentro de los bordes
        finalX = Math.max(minX, Math.min(maxX, finalX))
        finalY = Math.max(minY, Math.min(maxY, finalY))

        x.set(finalX)
        y.set(finalY)

        if (distance < 50) {
          setAttempts(prev => prev + 1)
        }
      }
    } else {
      setIsNearCursor(false)
    }
  }, [attempts, x, y])

  const handleClick = () => {
    setAttempts(prev => prev + 1)
    if (!buttonRef.current) return

    const randomAngle = Math.random() * Math.PI * 2
    const bounceForce = 300 + attempts * 100 // Muy agresivo

    const currentX = x.get()
    const currentY = y.get()

    const newX = currentX + Math.cos(randomAngle) * bounceForce
    const newY = currentY + Math.sin(randomAngle) * bounceForce

    const rect = buttonRef.current.getBoundingClientRect()
    const maxX = (window.innerWidth - rect.width) / 2
    const maxY = (window.innerHeight - rect.height) / 2
    const minX = -(window.innerWidth - rect.width) / 2
    const minY = -(window.innerHeight - rect.height) / 2

    x.set(Math.max(minX, Math.min(maxX, newX)))
    y.set(Math.max(minY, Math.min(maxY, newY)))
  }

  // Regresar al centro cuando no hay interacción
  useEffect(() => {
    if (!isNearCursor) {
      const returnInterval = setInterval(() => {
        const currentX = x.get()
        const currentY = y.get()
        const distance = Math.sqrt(currentX * currentX + currentY * currentY)

        if (distance > 2) {
          x.set(currentX * 0.85) // Desaceleración suave
          y.set(currentY * 0.85)
        } else {
          x.set(0)
          y.set(0)
        }
      }, 16) // ~60fps

      return () => clearInterval(returnInterval)
    }
  }, [isNearCursor, x, y])

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      calculateRepulsion(e.clientX, e.clientY)
    }
    const handleGlobalTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches && e.touches.length > 0) {
        calculateRepulsion(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const handleGlobalTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        calculateRepulsion(e.touches[0].clientX, e.touches[0].clientY)
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
  }, [calculateRepulsion])

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
      <motion.button
        ref={buttonRef}
        onClick={handleClick}
        style={{
          x: springX,
          y: springY,
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
          zIndex: 5,
          userSelect: 'none',
          pointerEvents: 'auto',
          touchAction: 'none',
          minWidth: '100px',
          whiteSpace: 'nowrap',
          position: 'relative',
        }}
      >
        NO
      </motion.button>
    </div>
  )
}
