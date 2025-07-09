// Función para hacer scraping del servicio real de historialvehiculo.com
async function fetchVehicleFromHistorialVehiculo(matricula: string): Promise<{
  success: boolean
  data?: { marca: string; modelo: string; año?: string; combustible?: string; cv?: string }
  error?: string
}> {
  try {
    // Limpiar matrícula
    const cleanMatricula = matricula.replace(/\s+/g, "").toUpperCase()

    // Validar formato español (4 números + 3 letras)
    if (!cleanMatricula.match(/^\d{4}[A-Z]{3}$/)) {
      return {
        success: false,
        error: "Formato de matrícula no válido. Use formato 1234ABC",
      }
    }

    // Hacer petición al servicio
    const response = await fetch("/api/vehicle-lookup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ matricula: cleanMatricula }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error fetching vehicle data:", error)
    return {
      success: false,
      error: "Error al conectar con el servicio de consulta de vehículos",
    }
  }
}

// Función principal de búsqueda
export async function lookupVehicleInfo(matricula: string): Promise<{
  success: boolean
  data?: { marca: string; modelo: string; año?: string; combustible?: string; cv?: string }
  source: "api" | "not_found"
  error?: string
}> {
  try {
    const result = await fetchVehicleFromHistorialVehiculo(matricula)

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
        source: "api",
      }
    }

    return {
      success: false,
      source: "not_found",
      error: result.error || "No se encontró información para esta matrícula",
    }
  } catch (error) {
    return {
      success: false,
      source: "not_found",
      error: "Error al buscar información del vehículo",
    }
  }
}

// Función para generar modelo completo
export function generateVehicleModel(
  marca: string,
  modelo: string,
  año?: string,
  combustible?: string,
  cv?: string,
): string {
  let result = `${marca} ${modelo}`

  if (año) {
    result += ` (${año})`
  }

  if (combustible || cv) {
    const extras = []
    if (combustible) extras.push(combustible)
    if (cv) extras.push(`${cv} CV`)
    result += ` - ${extras.join(", ")}`
  }

  return result
}

// Función para validar formato de matrícula española
export function validateSpanishLicensePlate(matricula: string): boolean {
  const clean = matricula.replace(/\s+/g, "").toUpperCase()

  // Formato nuevo: 1234ABC (4 números + 3 letras)
  return clean.match(/^\d{4}[A-Z]{3}$/) !== null
}
