import { type NextRequest, NextResponse } from "next/server"

interface AddressResult {
  street: string
  postalCode: string
  city: string
  province: string
  fullAddress: string
  source: string
}

// Base de datos local para direcciones comunes que fallan en APIs
const LOCAL_ADDRESSES: AddressResult[] = [
  // Leganés - Madrid
  {
    street: "CALLE LISBOA",
    postalCode: "28915",
    city: "LEGANÉS",
    province: "MADRID",
    fullAddress: "CALLE LISBOA, LEGANÉS, MADRID",
    source: "Local",
  },
  {
    street: "CALLE PORTUGAL",
    postalCode: "28915",
    city: "LEGANÉS",
    province: "MADRID",
    fullAddress: "CALLE PORTUGAL, LEGANÉS, MADRID",
    source: "Local",
  },
  {
    street: "CALLE FRANCIA",
    postalCode: "28915",
    city: "LEGANÉS",
    province: "MADRID",
    fullAddress: "CALLE FRANCIA, LEGANÉS, MADRID",
    source: "Local",
  },
  {
    street: "AVENIDA JUAN CARLOS I",
    postalCode: "28915",
    city: "LEGANÉS",
    province: "MADRID",
    fullAddress: "AVENIDA JUAN CARLOS I, LEGANÉS, MADRID",
    source: "Local",
  },
  {
    street: "CALLE RIOJA",
    postalCode: "28915",
    city: "LEGANÉS",
    province: "MADRID",
    fullAddress: "CALLE RIOJA, LEGANÉS, MADRID",
    source: "Local",
  },
  // Más direcciones comunes de Madrid
  {
    street: "CALLE GRAN VIA",
    postalCode: "28013",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE GRAN VIA, MADRID",
    source: "Local",
  },
  {
    street: "CALLE ALCALA",
    postalCode: "28014",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "CALLE ALCALA, MADRID",
    source: "Local",
  },
  {
    street: "PASEO DE LA CASTELLANA",
    postalCode: "28046",
    city: "MADRID",
    province: "MADRID",
    fullAddress: "PASEO DE LA CASTELLANA, MADRID",
    source: "Local",
  },
]

// Función para buscar en base de datos local
function searchLocalAddresses(query: string): AddressResult[] {
  const normalizedQuery = query.toLowerCase().trim()

  return LOCAL_ADDRESSES.filter((address) => {
    const normalizedStreet = address.street.toLowerCase()
    const normalizedCity = address.city.toLowerCase()
    const normalizedFull = address.fullAddress.toLowerCase()

    // Buscar coincidencias exactas o parciales
    return (
      normalizedStreet.includes(normalizedQuery) ||
      normalizedFull.includes(normalizedQuery) ||
      (normalizedQuery.includes(normalizedCity) && normalizedQuery.includes(normalizedStreet.split(" ").pop() || ""))
    )
  })
}

// Función mejorada para Nominatim con mejor query formatting
async function searchNominatim(query: string): Promise<AddressResult[]> {
  try {
    // Mejorar el formato de la query para búsquedas específicas
    let searchQuery = query

    // Detectar patrones como "calle X en Y" o "calle X, Y"
    const streetInCityMatch = query.match(/(.+?)\s+en\s+(.+)/i)
    if (streetInCityMatch) {
      searchQuery = `${streetInCityMatch[1]}, ${streetInCityMatch[2]}, España`
    } else {
      searchQuery = `${query}, España`
    }

    const encodedQuery = encodeURIComponent(searchQuery)
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=15&countrycodes=es&q=${encodedQuery}`

    console.log("🌍 Nominatim query:", searchQuery)

    const response = await fetch(url, {
      headers: {
        "User-Agent": "ParkingInvoiceSystem/1.0 (parking@example.com)",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.log(`⚠️ Nominatim HTTP ${response.status}`)
      return []
    }

    const data = await response.json()
    console.log("📍 Nominatim resultados:", data.length)

    if (!Array.isArray(data)) return []

    return data
      .map((item: any) => {
        const address = item.address || {}
        let street = address.road || address.pedestrian || address.path || ""

        // Si no hay calle específica, usar el primer elemento del display_name
        if (!street && item.display_name) {
          street = item.display_name.split(",")[0].trim()
        }

        return {
          street: street.toUpperCase(),
          postalCode: address.postcode || "",
          city: (address.city || address.town || address.village || address.municipality || "").toUpperCase(),
          province: (address.state || address.province || address.county || "").toUpperCase(),
          fullAddress: item.display_name || "",
          source: "Nominatim",
        }
      })
      .filter((addr: AddressResult) => addr.street && addr.city)
      .slice(0, 10)
  } catch (error) {
    console.log("⚠️ Nominatim error:", error)
    return []
  }
}

// Función para buscar en Photon (alternativa a Nominatim)
async function searchPhoton(query: string): Promise<AddressResult[]> {
  try {
    // Photon es otra API gratuita basada en OpenStreetMap
    let searchQuery = query

    const streetInCityMatch = query.match(/(.+?)\s+en\s+(.+)/i)
    if (streetInCityMatch) {
      searchQuery = `${streetInCityMatch[1]} ${streetInCityMatch[2]}`
    }

    const encodedQuery = encodeURIComponent(searchQuery)
    const url = `https://photon.komoot.io/api/?q=${encodedQuery}&limit=10&osm_tag=highway&osm_tag=place&lang=es`

    console.log("🔍 Photon query:", searchQuery)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.log(`⚠️ Photon HTTP ${response.status}`)
      return []
    }

    const data = await response.json()
    console.log("🔍 Photon resultados:", data.features?.length || 0)

    if (!data.features || !Array.isArray(data.features)) return []

    return data.features
      .map((feature: any) => {
        const props = feature.properties || {}
        return {
          street: (props.street || props.name || "").toUpperCase(),
          postalCode: props.postcode || "",
          city: (props.city || props.district || "").toUpperCase(),
          province: (props.state || "").toUpperCase(),
          fullAddress: `${props.street || props.name || ""}, ${props.city || ""}, ${props.state || ""}`,
          source: "Photon",
        }
      })
      .filter((addr: AddressResult) => addr.street && addr.city)
      .slice(0, 8)
  } catch (error) {
    console.log("⚠️ Photon error:", error)
    return []
  }
}

// Función para buscar en MapBox (requiere API key pero tiene trial gratuito)
async function searchMapBox(query: string): Promise<AddressResult[]> {
  try {
    const apiKey = process.env.MAPBOX_API_KEY
    if (!apiKey) {
      console.log("⚠️ MapBox API key no configurada")
      return []
    }

    let searchQuery = query
    const streetInCityMatch = query.match(/(.+?)\s+en\s+(.+)/i)
    if (streetInCityMatch) {
      searchQuery = `${streetInCityMatch[1]} ${streetInCityMatch[2]} España`
    } else {
      searchQuery = `${query} España`
    }

    const encodedQuery = encodeURIComponent(searchQuery)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?country=es&limit=10&access_token=${apiKey}`

    console.log("🗺️ MapBox query:", searchQuery)

    const response = await fetch(url)
    if (!response.ok) {
      console.log(`⚠️ MapBox HTTP ${response.status}`)
      return []
    }

    const data = await response.json()
    console.log("🗺️ MapBox resultados:", data.features?.length || 0)

    return (data.features || [])
      .map((feature: any) => {
        const context = feature.context || []
        const postcode = context.find((c: any) => c.id.startsWith("postcode"))?.text || ""
        const place = context.find((c: any) => c.id.startsWith("place"))?.text || ""
        const region = context.find((c: any) => c.id.startsWith("region"))?.text || ""

        return {
          street: (feature.text || "").toUpperCase(),
          postalCode: postcode,
          city: place.toUpperCase(),
          province: region.toUpperCase(),
          fullAddress: feature.place_name || "",
          source: "MapBox",
        }
      })
      .filter((addr: AddressResult) => addr.street && addr.city)
      .slice(0, 8)
  } catch (error) {
    console.log("⚠️ MapBox error:", error)
    return []
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query || query.length < 3) {
    return NextResponse.json({
      success: false,
      error: "Query debe tener al menos 3 caracteres",
      results: [],
    })
  }

  console.log("🔍 Búsqueda de direcciones:", query)

  try {
    // 1. Primero buscar en base de datos local (instantáneo)
    const localResults = searchLocalAddresses(query)
    console.log("🏠 Resultados locales:", localResults.length)

    // 2. Buscar en APIs externas en paralelo
    const apiPromises = [
      searchNominatim(query).catch(() => []),
      searchPhoton(query).catch(() => []),
      searchMapBox(query).catch(() => []),
    ]

    const apiResults = await Promise.all(apiPromises)

    // 3. Combinar todos los resultados
    const allResults: AddressResult[] = [
      ...localResults, // Prioridad a resultados locales
      ...apiResults[0], // Nominatim
      ...apiResults[1], // Photon
      ...apiResults[2], // MapBox
    ]

    // 4. Eliminar duplicados
    const uniqueResults = allResults.filter(
      (result, index, self) =>
        index ===
        self.findIndex(
          (r) =>
            r.street.toLowerCase().trim() === result.street.toLowerCase().trim() &&
            r.city.toLowerCase().trim() === result.city.toLowerCase().trim(),
        ),
    )

    // 5. Ordenar por relevancia
    const queryLower = query.toLowerCase()
    const sortedResults = uniqueResults.sort((a, b) => {
      const aStreet = a.street.toLowerCase()
      const bStreet = b.street.toLowerCase()
      const aFull = a.fullAddress.toLowerCase()
      const bFull = b.fullAddress.toLowerCase()

      // Prioridad máxima: resultados locales
      if (a.source === "Local" && b.source !== "Local") return -1
      if (a.source !== "Local" && b.source === "Local") return 1

      // Prioridad 1: Empieza con la query
      const aStartsWith = aStreet.startsWith(queryLower) || aFull.startsWith(queryLower)
      const bStartsWith = bStreet.startsWith(queryLower) || bFull.startsWith(queryLower)

      if (aStartsWith && !bStartsWith) return -1
      if (!aStartsWith && bStartsWith) return 1

      // Prioridad 2: Contiene la query completa
      const aContains = aFull.includes(queryLower)
      const bContains = bFull.includes(queryLower)

      if (aContains && !bContains) return -1
      if (!aContains && bContains) return 1

      return a.street.length - b.street.length
    })

    const sources = {
      local: localResults.length,
      nominatim: apiResults[0].length,
      photon: apiResults[1].length,
      mapbox: apiResults[2].length,
    }

    console.log("✅ Resultados finales:", sortedResults.length)
    console.log("📊 Por fuente:", sources)

    return NextResponse.json({
      success: true,
      results: sortedResults.slice(0, 12),
      sources,
      query,
    })
  } catch (error) {
    console.error("❌ Error general:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        results: [],
      },
      { status: 500 },
    )
  }
}
