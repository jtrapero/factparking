// Base de datos simplificada de direcciones españolas
interface SpanishAddress {
  street: string
  postalCode: string
  city: string
  province: string
  fullAddress: string
}

// Base de datos expandida con direcciones reales españolas
const SPANISH_ADDRESSES: SpanishAddress[] = [
  // MADRID - Calles PEDRO
  {
    street: "CALLE PEDRO LAIN ENTRALGO",
    postalCode: "28043",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE PEDRO LAIN ENTRALGO, MADRID",
  },
  {
    street: "CALLE PEDRO SALINAS",
    postalCode: "28043",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE PEDRO SALINAS, MADRID",
  },
  {
    street: "CALLE PEDRO MUÑOZ SECA",
    postalCode: "28001",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE PEDRO MUÑOZ SECA, MADRID",
  },
  {
    street: "CALLE PEDRO ANTONIO DE ALARCON",
    postalCode: "28028",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE PEDRO ANTONIO DE ALARCON, MADRID",
  },

  // MADRID - Calles RAFAEL
  {
    street: "CALLE RAFAEL",
    postalCode: "28020",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE RAFAEL, MADRID",
  },
  {
    street: "CALLE RAFAEL CALVO",
    postalCode: "28010",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE RAFAEL CALVO, MADRID",
  },
  {
    street: "CALLE RAFAEL ALBERTI",
    postalCode: "28045",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE RAFAEL ALBERTI, MADRID",
  },
  {
    street: "CALLE RAFAEL FINAT",
    postalCode: "28044",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE RAFAEL FINAT, MADRID",
  },
  {
    street: "CALLE RAFAEL BERGAMIN",
    postalCode: "28043",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE RAFAEL BERGAMIN, MADRID",
  },
  {
    street: "CALLE RAFAEL HERRERA",
    postalCode: "28028",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE RAFAEL HERRERA, MADRID",
  },
  {
    street: "CALLE RAFAEL CANSINOS ASSENS",
    postalCode: "28043",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE RAFAEL CANSINOS ASSENS, MADRID",
  },
  {
    street: "CALLE RAFAEL FERNANDEZ SHAW",
    postalCode: "28002",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE RAFAEL FERNANDEZ SHAW, MADRID",
  },

  // MADRID - Calles principales
  {
    street: "CALLE GRAN VIA",
    postalCode: "28013",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE GRAN VIA, MADRID",
  },
  {
    street: "CALLE ALCALA",
    postalCode: "28014",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE ALCALA, MADRID",
  },
  {
    street: "PASEO DE LA CASTELLANA",
    postalCode: "28046",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "PASEO DE LA CASTELLANA, MADRID",
  },
  {
    street: "CALLE SERRANO",
    postalCode: "28001",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE SERRANO, MADRID",
  },
  {
    street: "CALLE GOYA",
    postalCode: "28001",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE GOYA, MADRID",
  },
  {
    street: "AVENIDA AMERICA",
    postalCode: "28002",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "AVENIDA AMERICA, MADRID",
  },
  {
    street: "CALLE BRAVO MURILLO",
    postalCode: "28003",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE BRAVO MURILLO, MADRID",
  },
  {
    street: "CALLE FUENCARRAL",
    postalCode: "28004",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE FUENCARRAL, MADRID",
  },
  {
    street: "CALLE PRINCESA",
    postalCode: "28008",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE PRINCESA, MADRID",
  },
  {
    street: "CALLE ATOCHA",
    postalCode: "28012",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE ATOCHA, MADRID",
  },
  {
    street: "PLAZA MAYOR",
    postalCode: "28012",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "PLAZA MAYOR, MADRID",
  },
  {
    street: "PLAZA ESPAÑA",
    postalCode: "28008",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "PLAZA ESPAÑA, MADRID",
  },
  {
    street: "CALLE VELAZQUEZ",
    postalCode: "28001",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE VELAZQUEZ, MADRID",
  },
  {
    street: "CALLE ORENSE",
    postalCode: "28020",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE ORENSE, MADRID",
  },
  {
    street: "AVENIDA MEDITERRANEO",
    postalCode: "28007",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "AVENIDA MEDITERRANEO, MADRID",
  },
  {
    street: "AVENIDA CARABANCHEL ALTO",
    postalCode: "28044",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "AVENIDA CARABANCHEL ALTO, MADRID",
  },
  {
    street: "CALLE SANCHEZ BARCAIZTEGUI",
    postalCode: "28007",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE SANCHEZ BARCAIZTEGUI, MADRID",
  },
  {
    street: "POETA JOAN MARAGALL",
    postalCode: "28020",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "POETA JOAN MARAGALL, MADRID",
  },
  {
    street: "MELQUIADES BIENCINTO",
    postalCode: "28053",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "MELQUIADES BIENCINTO, MADRID",
  },
  {
    street: "CALLE MAYOR",
    postalCode: "28001",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE MAYOR, MADRID",
  },

  // BARCELONA
  {
    street: "PASSEIG DE GRACIA",
    postalCode: "08007",
    city: "BARCELONA",
    province: "BARCELONA",
    fullAddress: "PASSEIG DE GRACIA, BARCELONA",
  },
  {
    street: "LAS RAMBLAS",
    postalCode: "08002",
    city: "BARCELONA",
    province: "BARCELONA",
    fullAddress: "LAS RAMBLAS, BARCELONA",
  },
  {
    street: "BEAT ORIOL",
    postalCode: "08110",
    city: "MONTCADA I REIXAC",
    province: "BARCELONA",
    fullAddress: "BEAT ORIOL, MONTCADA I REIXAC",
  },

  // VALENCIA
  {
    street: "CALLE COLON",
    postalCode: "46004",
    city: "VALENCIA",
    province: "VALENCIA",
    fullAddress: "CALLE COLON, VALENCIA",
  },

  // SEVILLA
  {
    street: "CALLE SIERPES",
    postalCode: "41004",
    city: "SEVILLA",
    province: "SEVILLA",
    fullAddress: "CALLE SIERPES, SEVILLA",
  },
]

// Función para normalizar texto
function normalizeText(text: string): string {
  return text
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
    .trim()
}

export function searchSpanishAddresses(query: string, limit = 10): SpanishAddress[] {
  if (!query || query.length < 2) return []

  const normalizedQuery = normalizeText(query)
  console.log("🔍 Búsqueda para:", `"${query}"`, "→ normalizada:", `"${normalizedQuery}"`)

  const results: { address: SpanishAddress; score: number; reason: string }[] = []

  SPANISH_ADDRESSES.forEach((address) => {
    const normalizedStreet = normalizeText(address.street)
    let score = 0
    let reason = ""

    // 1. Coincidencia exacta al inicio (máxima prioridad)
    if (normalizedStreet.startsWith(normalizedQuery)) {
      score += 1000
      reason = "Empieza con la consulta"
    }
    // 2. Contiene la consulta completa
    else if (normalizedStreet.includes(normalizedQuery)) {
      score += 800
      reason = "Contiene la consulta completa"
    }
    // 3. Búsqueda por palabras individuales
    else {
      const queryWords = normalizedQuery.split(/\s+/).filter((word) => word.length > 1)
      const streetWords = normalizedStreet.split(/\s+/)

      let matchedWords = 0
      queryWords.forEach((queryWord) => {
        streetWords.forEach((streetWord) => {
          if (streetWord.includes(queryWord) || queryWord.includes(streetWord)) {
            score += 100
            matchedWords++
          }
        })
      })

      if (matchedWords > 0) {
        reason = `Coincide ${matchedWords} palabra(s)`
      }
    }

    // Solo incluir si tiene puntuación
    if (score > 0) {
      results.push({ address, score, reason })
    }
  })

  // Ordenar por puntuación descendente
  results.sort((a, b) => b.score - a.score)

  console.log(`📊 Encontrados ${results.length} resultados para "${query}":`)
  results.slice(0, 5).forEach((result, index) => {
    console.log(`${index + 1}. ${result.address.street} (Score: ${result.score}, ${result.reason})`)
  })

  return results.slice(0, limit).map((result) => result.address)
}

export function getAddressByStreet(street: string): SpanishAddress | null {
  const normalizedStreet = normalizeText(street)
  return SPANISH_ADDRESSES.find((address) => normalizeText(address.street) === normalizedStreet) || null
}

export async function fetchAddressFromAPI(query: string): Promise<SpanishAddress[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return searchSpanishAddresses(query, 5)
}
