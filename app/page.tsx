'use client'

import { useState } from 'react'
import YesButton from '@/components/YesButton'
import NoButton from '@/components/NoButton'
import PartyMode from '@/components/PartyMode'

export default function Home() {
  const [partyMode, setPartyMode] = useState(false)

  const handleYesClick = () => {
    setPartyMode(true)
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        backgroundColor: 'var(--color-cream)',
      }}
    >
      {partyMode && <PartyMode />}
      
      {!partyMode && (
        <>
          <h1
            style={{
              fontSize: 'clamp(1rem, 5vw, 3rem)',
              textAlign: 'center',
              marginBottom: 'clamp(2rem, 6vw, 4rem)',
              color: 'var(--color-dark-red)',
              textShadow: '4px 4px 0px var(--color-rose)',
              lineHeight: '1.5',
              maxWidth: '90%',
              padding: '0 1rem',
            }}
          >
            Lizok, do you wanna be my Valentine?
          </h1>

          <div
            style={{
              display: 'flex',
              gap: 'clamp(1rem, 3vw, 2rem)',
              flexWrap: 'nowrap',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              maxWidth: '800px',
              position: 'relative',
              minHeight: 'clamp(150px, 25vh, 200px)',
              padding: '0 1rem',
              flexDirection: 'row',
            }}
          >
            <YesButton onClick={handleYesClick} />
            <NoButton />
          </div>
        </>
      )}
    </main>
  )
}
