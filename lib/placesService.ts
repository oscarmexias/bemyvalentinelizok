// Servicio para buscar lugares con matcha/chai usando búsqueda inteligente (sin costo)

export interface PlaceResult {
  name: string
  distance: number
  rating?: number
  drinkType: 'matcha' | 'chai'
}

export async function findMatchaChaiPlace(
  lat: number,
  lng: number
): Promise<PlaceResult | null> {
  // Decidir aleatoriamente entre matcha y chai
  const drinkType = Math.random() > 0.5 ? 'matcha' : 'chai'

  try {
    // Usar nuestra API route que hace búsqueda inteligente sin costo
    const response = await fetch('/api/find-place', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat,
        lng,
        drinkType
      })
    })

    if (!response.ok) {
      throw new Error('Error en la búsqueda de lugares')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error buscando lugares:', error)
    // Fallback
    return {
      name: 'Local Café',
      distance: 0.5,
      rating: 4.5,
      drinkType
    }
  }
}

export function getRandomDrink(): 'matcha' | 'chai' {
  return Math.random() > 0.5 ? 'matcha' : 'chai'
}
