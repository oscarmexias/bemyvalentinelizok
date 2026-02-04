'use client'

import React, { useState } from 'react'

export default function PartyMode() {
  const [showPrize, setShowPrize] = useState(false)
  const [showSmoke, setShowSmoke] = useState(false)

  // URLs de GIFs de Giphy (4 gatos bailando) - URLs populares y confiables
  const cats = [
    { url: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif' }, // Gato bailando 1
    { url: 'https://media.giphy.com/media/3o7aD5ngYqJhLJ6zAA/giphy.gif' }, // Gato bailando 2
    { url: 'https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif' }, // Gato bailando 3
    { url: 'https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif' }, // Gato bailando 4
  ]

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
        background: '#FFF8DC', // Crema amarillo sutil
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

      {/* Icono de regalo animado en el centro */}
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
            fontSize: 'clamp(4rem, 15vw, 8rem)',
            animation: 'bounceGift 1s ease-in-out infinite',
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
          🎁
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
      {showPrize && (
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
              fontSize: 'clamp(0.8rem, 3vw, 1.5rem)',
              color: 'var(--color-cream)',
              textTransform: 'uppercase',
              animation: 'bounceBox 0.6s ease-out',
            }}
          >
            GANASTE UN BESHO! 💋
          </div>
        </div>
      )}
      
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1200px',
          padding: '2rem',
          marginTop: showPrize ? '20rem' : '0',
          transition: 'margin-top 0.5s ease',
        }}
      >
        {cats.map((cat, index) => (
          <img
            key={index}
            src={cat.url}
            alt="Gato bailando"
            style={{
              width: 'clamp(150px, 20vw, 250px)',
              height: 'auto',
              animation: `dance ${1 + index * 0.2}s ease-in-out infinite`,
              animationDelay: `${index * 0.1}s`,
              filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.2))',
              borderRadius: '10px',
            }}
          />
        ))}
      </div>

      <p
        style={{
          fontSize: 'clamp(0.8rem, 3vw, 1.5rem)',
          color: 'var(--color-dark-red)',
          textShadow: '2px 2px 0px var(--color-rose)',
          marginTop: '3rem',
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
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-20px);
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
