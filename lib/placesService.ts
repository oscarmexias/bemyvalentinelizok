// Servicio para buscar lugares con matcha/chai usando Google Places API

export interface PlaceResult {
  name: string
  distance: number
  rating?: number
  placeId?: string
}

export async function findMatchaChaiPlace(
  lat: number,
  lng: number
): Promise<PlaceResult | null> {
  // Usar Google Places API Text Search
  // Nota: En producción, esto debería hacerse desde el backend por seguridad
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  
  if (!API_KEY) {
    console.warn('Google Maps API key no configurada')
    // Fallback: retornar un lugar de ejemplo
    return {
      name: 'Local Café',
      distance: 0.5,
      rating: 4.5
    }
  }

  // Decidir aleatoriamente entre matcha y chai
  const drinkType = Math.random() > 0.5 ? 'matcha' : 'chai'
  const query = `${drinkType} cafe coffee shop`

  try {
    // Usar Places API Text Search
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=2000&key=${API_KEY}`
    )

    if (!response.ok) {
      throw new Error('Error en la búsqueda de lugares')
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      // Filtrar resultados que mencionen matcha o chai
      const relevantResults = data.results.filter((place: any) => {
        const name = place.name?.toLowerCase() || ''
        const types = place.types?.join(' ').toLowerCase() || ''
        return (
          name.includes('matcha') ||
          name.includes('chai') ||
          types.includes('cafe') ||
          types.includes('coffee')
        )
      })

      // Seleccionar el mejor (top rating) o uno de los top 3
      const topResults = relevantResults
        .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3)

      if (topResults.length === 0) {
        // Si no hay resultados relevantes, usar el primero
        const firstResult = data.results[0]
        return {
          name: firstResult.name,
          distance: calculateDistance(lat, lng, firstResult.geometry.location.lat, firstResult.geometry.location.lng),
          rating: firstResult.rating,
          placeId: firstResult.place_id
        }
      }

      // Seleccionar aleatoriamente de los top 3, pero con preferencia al mejor
      const selectedIndex = Math.random() < 0.6 ? 0 : Math.floor(Math.random() * Math.min(3, topResults.length))
      const selected = topResults[selectedIndex]

      return {
        name: selected.name,
        distance: calculateDistance(lat, lng, selected.geometry.location.lat, selected.geometry.location.lng),
        rating: selected.rating,
        placeId: selected.place_id
      }
    }

    // Fallback si no hay resultados
    return {
      name: 'Local Café',
      distance: 0.5,
      rating: 4.5
    }
  } catch (error) {
    console.error('Error buscando lugares:', error)
    // Fallback
    return {
      name: 'Local Café',
      distance: 0.5,
      rating: 4.5
    }
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round((R * c) * 10) / 10 // Redondear a 1 decimal
}

export function getRandomDrink(): 'matcha' | 'chai' {
  return Math.random() > 0.5 ? 'matcha' : 'chai'
}
