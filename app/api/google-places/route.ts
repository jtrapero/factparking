import { NextResponse } from "next/server"

// Simulación de sugerencias de Google Places
const mockPlaceSuggestions = [
  {
    description: "Calle Falsa 123, Madrid",
    place_id: "mock_place_id_1",
    structured_formatting: {
      main_text: "Calle Falsa 123",
      secondary_text: "Madrid",
    },
  },
  {
    description: "Avenida Siempre Viva 45, Barcelona",
    place_id: "mock_place_id_2",
    structured_formatting: {
      main_text: "Avenida Siempre Viva 45",
      secondary_text: "Barcelona",
    },
  },
  {
    description: "Plaza Mayor 1, Sevilla",
    place_id: "mock_place_id_3",
    structured_formatting: {
      main_text: "Plaza Mayor 1",
      secondary_text: "Sevilla",
    },
  },
  {
    description: "Calle del Sol 7, Valencia",
    place_id: "mock_place_id_4",
    structured_formatting: {
      main_text: "Calle del Sol 7",
      secondary_text: "Valencia",
    },
  },
  {
    description: "Ronda de Dalt 50, Barcelona",
    place_id: "mock_place_id_5",
    structured_formatting: {
      main_text: "Ronda de Dalt 50",
      secondary_text: "Barcelona",
    },
  },
  {
    description: "Gran Vía 30, Madrid",
    place_id: "mock_place_id_6",
    structured_formatting: {
      main_text: "Gran Vía 30",
      secondary_text: "Madrid",
    },
  },
]

// Simulación de detalles de lugar (para obtener CP y Ciudad)
const mockPlaceDetails: Record<string, { cp: string; city: string }> = {
  mock_place_id_1: { cp: "28001", city: "Madrid" },
  mock_place_id_2: { cp: "08001", city: "Barcelona" },
  mock_place_id_3: { cp: "41001", city: "Sevilla" },
  mock_place_id_4: { cp: "46001", city: "Valencia" },
  mock_place_id_5: { cp: "08035", city: "Barcelona" },
  mock_place_id_6: { cp: "28013", city: "Madrid" },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const input = searchParams.get("input")
  const placeId = searchParams.get("place_id")

  // En una aplicación real, usarías la clave de API de Google Maps aquí
  // const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (placeId) {
    // Simular la llamada a la API de Place Details
    // const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`);
    // const data = await response.json();
    const details = mockPlaceDetails[placeId]
    if (details) {
      return NextResponse.json({
        result: {
          address_components: [
            { long_name: details.cp, types: ["postal_code"] },
            { long_name: details.city, types: ["locality"] },
          ],
        },
      })
    }
    return NextResponse.json({ error: "Place not found" }, { status: 404 })
  } else if (input) {
    // Simular la llamada a la API de Autocomplete
    // const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}`);
    // const data = await response.json();
    const filteredSuggestions = mockPlaceSuggestions.filter((sug) =>
      sug.description.toLowerCase().includes(input.toLowerCase()),
    )
    return NextResponse.json({ predictions: filteredSuggestions })
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 })
}
