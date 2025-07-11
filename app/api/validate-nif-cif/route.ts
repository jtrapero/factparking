import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { cifNif }: { cifNif: string } = await req.json()

  const validateCifNifLogic = (value: string): string => {
    value = value.toUpperCase()
    const nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/
    const cifRegex = /^[ABCDEFGHJKLMNPQRSUVW]{1}[0-9]{7}[0-9A-J]$/
    const nieRegex = /^[XYZ]{1}[0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/

    if (!value) return "El NIF/CIF es obligatorio."

    if (nifRegex.test(value)) {
      const num = Number.parseInt(value.substring(0, 8), 10)
      const letter = value.charAt(8)
      const controlLetters = "TRWAGMYFPDXBNJZSQVHLCKE"
      if (controlLetters.charAt(num % 23) === letter) {
        return "" // NIF válido
      } else {
        return "NIF incorrecto (letra de control)."
      }
    } else if (nieRegex.test(value)) {
      const nifEquivalent = value.replace("X", "0").replace("Y", "1").replace("Z", "2")
      const num = Number.parseInt(nifEquivalent.substring(0, 8), 10)
      const letter = nifEquivalent.charAt(8)
      const controlLetters = "TRWAGMYFPDXBNJZSQVHLCKE"
      if (controlLetters.charAt(num % 23) === letter) {
        return "" // NIE válido
      } else {
        return "NIE incorrecto (letra de control)."
      }
    } else if (cifRegex.test(value)) {
      // Validación de CIF: más compleja, aquí solo formato básico.
      // Para una validación completa, se necesitaría una lógica más detallada
      // que incluya el dígito de control según el tipo de sociedad (letra inicial).
      // Esto es una simulación.
      return "" // Formato CIF válido (validación de dígito de control no implementada)
    } else {
      return "Formato de NIF/CIF/NIE incorrecto."
    }
  }

  const error = validateCifNifLogic(cifNif)

  if (error) {
    return NextResponse.json({ valid: false, error }, { status: 400 })
  } else {
    return NextResponse.json({ valid: true })
  }
}
