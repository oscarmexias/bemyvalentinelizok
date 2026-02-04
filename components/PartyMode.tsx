'use client'

import React, { useState, useEffect } from 'react'
import { findMatchaChaiPlace, getRandomDrink } from '@/lib/placesService'

export default function PartyMode() {
  const [showPrize, setShowPrize] = useState(false)
  const [showSmoke, setShowSmoke] = useState(false)
  const [showExplosion, setShowExplosion] = useState(false)
  const [prizeInfo, setPrizeInfo] = useState<{ drink: string; place: string; distance: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Emojis de animales bailando
  const animals = ['🐱', '🐶', '🐰', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦊', '🐺', '🐗', '🐴', '🦄', '🐝', '🦋', '🐛', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🐈', '🐓', '🦃', '🦤', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔']

  const drinkType = getRandomDrink()
  const drinkEmoji = drinkType === 'matcha' ? '🍵' : '☕'

  // Inyectar animaciones de explosión dinámicamente
  useEffect(() => {
    if (showExplosion) {
      const styleId = 'explosion-animations'
      let styleElement = document.getElementById(styleId)
      
      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.id = styleId
        document.head.appendChild(styleElement)
      }

      const animations = [...Array(50)].map((_, i) => {
        const angle = (i / 50) * Math.PI * 2
        const distance = 200 + (i % 10) * 30
        const x = Math.cos(angle) * distance
        const y = Math.sin(angle) * distance
        const rotation = i * 15
        return `@keyframes explodeEmoji${i} {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
          100% {
            opacity: 0.2;
            transform: translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0.3) rotate(${rotation}deg);
          }
        }`
      }).join('\n')

      styleElement.textContent = animations

      return () => {
        // No remover el style para que las animaciones funcionen
      }
    }
  }, [showExplosion])

  useEffect(() => {
    // Obtener ubicación y buscar lugar cuando se monta el componente
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          const place = await findMatchaChaiPlace(latitude, longitude)
          
          if (place) {
            setPrizeInfo({
              drink: place.drinkType || drinkType,
              place: place.name,
              distance: place.distance
            })
          }
          setLoading(false)
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error)
          // Fallback sin ubicación
          setPrizeInfo({
            drink: drinkType,
            place: 'Local Café',
            distance: 0.5
          })
          setLoading(false)
        }
      )
    } else {
      // Fallback si no hay geolocalización
      setPrizeInfo({
        drink: drinkType,
        place: 'Local Café',
        distance: 0.5
      })
    }
  }, [])

  const handleGiftClick = () => {
    setShowSmoke(true)
    setTimeout(() => {
      setShowExplosion(true)
      setShowPrize(true)
      // Detener explosión después de 2 segundos
      setTimeout(() => {
        setShowExplosion(false)
      }, 2000)
    }, 800)
  }

  const handleTakeMeThere = () => {
    if (prizeInfo) {
      // Abrir Google Maps buscando el lugar cerca de la ubicación del usuario
      const query = encodeURIComponent(`${prizeInfo.place} ${drinkType}`)
      let url = `https://www.google.com/maps/search/?api=1&query=${query}`
      
      // Si tenemos ubicación del usuario, agregarla para mejorar la búsqueda
      if (userLocation) {
        url += `&center=${userLocation.lat},${userLocation.lng}`
      }
      
      window.open(url, '_blank')
    }
  }

  return (
    <div
      className="party-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1000,
        background: '#FFF8DC',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 'clamp(1rem, 3vw, 2rem)',
      }}
    >
      {/* Título YAY - oculto después de revelar premio */}
      {!showPrize && (
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 6vw, 3rem)',
            color: 'var(--color-dark-red)',
            textShadow: '4px 4px 0px var(--color-rose)',
            marginBottom: '1rem',
            marginTop: 'clamp(1rem, 3vw, 2rem)',
            textAlign: 'center',
            animation: 'dance 1s ease-in-out infinite',
            zIndex: 1001,
            padding: '0 clamp(1rem, 5vw, 3rem)',
            maxWidth: 'calc(100% - 2rem)',
            width: '100%',
            boxSizing: 'border-box',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          🎉 YAY! 🎉
        </h2>
      )}

      {/* Icono de regalo animado en el centro con "OPEN ME" */}
      {!showPrize && (
        <div
          onClick={handleGiftClick}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer',
            zIndex: 1002,
            textAlign: 'center',
            filter: 'drop-shadow(8px 8px 12px rgba(0,0,0,0.3))',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'
          }}
        >
          <div
            style={{
              fontSize: 'clamp(4rem, 15vw, 8rem)',
              animation: 'bounceGift 1s ease-in-out infinite',
            }}
          >
            🎁
          </div>
          <div
            style={{
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              fontFamily: "'Press Start 2P', cursive",
              color: 'var(--color-dark-red)',
              textShadow: '3px 3px 0px var(--color-rose)',
              marginTop: '1rem',
              animation: 'pulse 1.5s ease-in-out infinite',
              padding: '0 1rem',
            }}
          >
            OPEN ME
          </div>
        </div>
      )}

      {/* Animación de humo */}
      {showSmoke && !showPrize && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1003,
            pointerEvents: 'none',
          }}
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '20px',
                height: '20px',
                backgroundColor: 'rgba(200, 200, 200, 0.8)',
                borderRadius: '50%',
                animation: `smoke ${1 + Math.random()}s ease-out forwards`,
                animationDelay: `${i * 0.05}s`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
      )}

      {/* Explosión de emojis matcha/chai */}
      {showExplosion && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1005,
            pointerEvents: 'none',
          }}
        >
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `explodeEmoji${i} 2s ease-out forwards`,
                animationDelay: `${i * 0.02}s`,
              }}
            >
              {drinkEmoji}
            </div>
          ))}
        </div>
      )}

      {/* Premio revelado */}
      {showPrize && prizeInfo && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1006,
            textAlign: 'center',
            animation: 'revealPrize 0.5s ease-out',
            width: '90%',
            maxWidth: '600px',
            padding: '0 clamp(1rem, 4vw, 2rem)',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(1.2rem, 4vw, 2rem)',
              color: 'var(--color-dark-red)',
              textShadow: '3px 3px 0px var(--color-rose)',
              marginBottom: '1.5rem',
              fontFamily: "'Press Start 2P', cursive",
              padding: '0 1rem',
              wordWrap: 'break-word',
            }}
          >
            PRIZE OF THE DAY
          </div>
          <div
            style={{
              backgroundColor: 'var(--color-red)',
              border: '6px solid var(--color-dark-red)',
              borderRadius: '12px',
              padding: 'clamp(1.5rem, 4vw, 3rem)',
              boxShadow: '0 10px 0 var(--color-dark-red), 0 15px 30px rgba(0,0,0,0.4)',
              fontFamily: "'Press Start 2P', cursive",
              fontSize: 'clamp(0.7rem, 2.5vw, 1.2rem)',
              color: 'var(--color-cream)',
              textTransform: 'uppercase',
              animation: 'bounceBox 0.6s ease-out',
              lineHeight: '1.6',
              marginBottom: '1.5rem',
              wordWrap: 'break-word',
            }}
          >
            You won a {prizeInfo.drink} in {prizeInfo.place}. It&apos;s just {prizeInfo.distance}km
          </div>
          <button
            onClick={handleTakeMeThere}
            style={{
              padding: 'clamp(1rem, 2.5vw, 1.5rem) clamp(2rem, 5vw, 3rem)',
              fontSize: 'clamp(0.8rem, 2.5vw, 1.2rem)',
              fontFamily: "'Press Start 2P', cursive",
              backgroundColor: 'var(--color-dark-red)',
              color: 'var(--color-cream)',
              border: '4px solid var(--color-red)',
              borderRadius: '8px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              boxShadow: '0 6px 0 var(--color-red), 0 10px 20px rgba(0,0,0,0.3)',
              transition: 'all 0.1s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(3px)'
              e.currentTarget.style.boxShadow = '0 3px 0 var(--color-red), 0 5px 15px rgba(0,0,0,0.3)'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 6px 0 var(--color-red), 0 10px 20px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 6px 0 var(--color-red), 0 10px 20px rgba(0,0,0,0.3)'
            }}
          >
            TAKE ME THERE
          </button>
        </div>
      )}

      {/* Emojis de animales bailando por toda la pantalla - ocultos después de revelar premio */}
      {!showPrize && (
        <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999 }}>
          {animals.slice(0, 30).map((animal, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                left: `${(index * 7) % 100}%`,
                top: `${(index * 11) % 100}%`,
                animation: `floatAnimal ${3 + (index % 3)}s ease-in-out infinite`,
                animationDelay: `${index * 0.1}s`,
                filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.2))',
              }}
            >
              {animal}
            </div>
          ))}
        </div>
      )}

      {/* Emojis flotantes después de la explosión */}
      {showPrize && !showExplosion && (
        <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 998 }}>
          {[...Array(20)].map((_, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                left: `${(index * 15) % 100}%`,
                top: `${(index * 20) % 100}%`,
                animation: `floatAnimal ${3 + (index % 3)}s ease-in-out infinite`,
                animationDelay: `${index * 0.1}s`,
                filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.2))',
              }}
            >
              {drinkEmoji}
            </div>
          ))}
        </div>
      )}

      {/* Texto inferior - oculto después de revelar premio */}
      {!showPrize && (
        <p
          style={{
            fontSize: 'clamp(0.8rem, 3vw, 1.5rem)',
            color: 'var(--color-dark-red)',
            textShadow: '2px 2px 0px var(--color-rose)',
            marginTop: 'auto',
            marginBottom: 'clamp(1rem, 3vw, 2rem)',
            textAlign: 'center',
            animation: 'dance 1.5s ease-in-out infinite',
            zIndex: 1001,
            padding: '0 clamp(1rem, 5vw, 3rem)',
            maxWidth: 'calc(100% - 2rem)',
            width: '100%',
            boxSizing: 'border-box',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          ¡FELIZ SAN VALENTÍN! 💕
        </p>
      )}

      <style jsx>{`
        @keyframes dance {
          0%, 100% {
            transform: rotate(0deg) translateY(0);
          }
          25% {
            transform: rotate(-10deg) translateY(-10px);
          }
          50% {
            transform: rotate(0deg) translateY(0);
          }
          75% {
            transform: rotate(10deg) translateY(-10px);
          }
        }

        @keyframes bounceGift {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes floatAnimal {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(20px, -20px) rotate(5deg);
          }
          50% {
            transform: translate(-10px, -30px) rotate(-5deg);
          }
          75% {
            transform: translate(-20px, -10px) rotate(3deg);
          }
        }



        @keyframes smoke {
          0% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(0.5);
          }
          100% {
            opacity: 0;
            transform: translate(
              ${-50 + (Math.random() - 0.5) * 200}px,
              ${-50 - Math.random() * 150}px
            ) scale(2);
          }
        }

        @keyframes revealPrize {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes bounceBox {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
