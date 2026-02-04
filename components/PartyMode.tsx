'use client'

import React, { useState, useEffect } from 'react'
import { findMatchaChaiPlace, getRandomDrink } from '@/lib/placesService'

export default function PartyMode() {
  const [showPrize, setShowPrize] = useState(false)
  const [showSmoke, setShowSmoke] = useState(false)
  const [prizeInfo, setPrizeInfo] = useState<{ drink: string; place: string; distance: number } | null>(null)
  const [loading, setLoading] = useState(false)

  // Emojis de animales bailando
  const animals = ['🐱', '🐶', '🐰', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦊', '🐺', '🐗', '🐴', '🦄', '🐝', '🦋', '🐛', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🐈', '🐓', '🦃', '🦤', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔']

  const drinkType = getRandomDrink()

  useEffect(() => {
    // Obtener ubicación y buscar lugar cuando se monta el componente
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const place = await findMatchaChaiPlace(latitude, longitude)
          
          if (place) {
            setPrizeInfo({
              drink: drinkType,
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
      setShowPrize(true)
    }, 800)
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
      }}
    >
      <h2
        style={{
          fontSize: 'clamp(1.5rem, 6vw, 3rem)',
          color: 'var(--color-dark-red)',
          textShadow: '4px 4px 0px var(--color-rose)',
          marginBottom: '1rem',
          textAlign: 'center',
          animation: 'dance 1s ease-in-out infinite',
          zIndex: 1001,
          padding: '0 1rem',
        }}
      >
        🎉 YAY! 🎉
      </h2>

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
            }}
          >
            OPEN ME
          </div>
        </div>
      )}

      {/* Animación de humo */}
      {showSmoke && (
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

      {/* Premio revelado */}
      {showPrize && prizeInfo && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1004,
            textAlign: 'center',
            animation: 'revealPrize 0.5s ease-out',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(1.2rem, 4vw, 2rem)',
              color: 'var(--color-dark-red)',
              textShadow: '3px 3px 0px var(--color-rose)',
              marginBottom: '1.5rem',
              fontFamily: "'Press Start 2P', cursive",
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
            }}
          >
            You won a {prizeInfo.drink} in {prizeInfo.place}. It&apos;s just {prizeInfo.distance}km
          </div>
        </div>
      )}

      {/* Emojis de animales bailando por toda la pantalla */}
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

      <p
        style={{
          fontSize: 'clamp(0.8rem, 3vw, 1.5rem)',
          color: 'var(--color-dark-red)',
          textShadow: '2px 2px 0px var(--color-rose)',
          marginTop: 'auto',
          marginBottom: '2rem',
          textAlign: 'center',
          animation: 'dance 1.5s ease-in-out infinite',
          zIndex: 1001,
          padding: '0 1rem',
        }}
      >
        ¡FELIZ SAN VALENTÍN! 💕
      </p>

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
