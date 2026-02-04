'use client'

import React from 'react'

interface YesButtonProps {
  onClick: () => void
}

export default function YesButton({ onClick }: YesButtonProps) {
  return (
    <button
      onClick={onClick}
      className="yes-button"
      style={{
        position: 'relative',
        padding: 'clamp(1rem, 3vw, 2rem) clamp(2rem, 6vw, 4rem)',
        fontSize: 'clamp(1rem, 4vw, 2rem)',
        fontFamily: "'Press Start 2P', cursive",
        backgroundColor: 'var(--color-red)',
        color: 'var(--color-cream)',
        border: 'clamp(2px, 1vw, 4px) solid var(--color-dark-red)',
        borderRadius: '8px',
        cursor: 'pointer',
        textTransform: 'uppercase',
        boxShadow: '0 8px 0 var(--color-dark-red), 0 12px 20px rgba(0,0,0,0.3)',
        transition: 'all 0.1s ease',
        overflow: 'visible',
        zIndex: 10,
        minWidth: '120px',
        touchAction: 'manipulation',
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(4px)'
        e.currentTarget.style.boxShadow = '0 4px 0 var(--color-dark-red), 0 8px 15px rgba(0,0,0,0.3)'
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 8px 0 var(--color-dark-red), 0 12px 20px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 8px 0 var(--color-dark-red), 0 12px 20px rgba(0,0,0,0.3)'
      }}
    >
      YES
      {/* Corazones flotantes */}
      {[...Array(6)].map((_, i) => (
        <span
          key={i}
          className="floating-heart"
          style={{
            position: 'absolute',
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            color: 'var(--color-pink)',
            pointerEvents: 'none',
            animation: `floatHeart ${1.5 + i * 0.2}s infinite ease-out`,
            animationDelay: `${i * 0.3}s`,
            left: `${20 + i * 15}%`,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          ❤️
        </span>
      ))}
      <style jsx>{`
        .yes-button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 0 var(--color-dark-red), 0 15px 25px rgba(0,0,0,0.4) !important;
        }
        .yes-button:active {
          transform: translateY(6px) !important;
          box-shadow: 0 2px 0 var(--color-dark-red), 0 5px 10px rgba(0,0,0,0.3) !important;
        }
      `}</style>
    </button>
  )
}
