// Validación de CIF/NIF españoles
export function validateSpanishNIF(nif: string): { isValid: boolean; type: string; error?: string } {
  if (!nif) {
    return { isValid: false, type: 'unknown', error: 'Campo requerido' }
  }

  const cleanNIF = nif.replace(/\s+/g, '').toUpperCase()

  // Validar NIF (DNI) - 8 números + 1 letra
  if (cleanNIF.match(/^\d{8}[A-Z]$/)) {
    const numbers = cleanNIF.substring(0, 8)
    const letter = cleanNIF.substring(8, 9)
    const expectedLetter = 'TRWAGMYFPDXBNJZSQVHLCKE'[parseInt(numbers) % 23]
    
    if (letter === expectedLetter) {
      return { isValid: true, type: 'NIF' }
    } else {
      return { isValid: false, type: 'NIF', error: 'Letra de control incorrecta' }
    }
  }

  // Validar NIE - X/Y/Z + 7 números + 1 letra
  if (cleanNIF.match(/^[XYZ]\d{7}[A-Z]$/)) {
    const firstChar = cleanNIF.substring(0, 1)
    const numbers = cleanNIF.substring(1, 8)
    const letter = cleanNIF.substring(8, 9)
    
    let nieNumber = ''
    if (firstChar === 'X') nieNumber = '0' + numbers
    else if (firstChar === 'Y') nieNumber = '1' + numbers
    else if (firstChar === 'Z') nieNumber = '2' + numbers
    
    const expectedLetter = 'TRWAGMYFPDXBNJZSQVHLCKE'[parseInt(nieNumber) % 23]
    
    if (letter === expectedLetter) {
      return { isValid: true, type: 'NIE' }
    } else {
      return { isValid: false, type: 'NIE', error: 'Letra de control incorrecta' }
    }
  }

  // Validar CIF - 1 letra + 7 números + 1 dígito/letra de control
  if (cleanNIF.match(/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/)) {
    const orgType = cleanNIF.substring(0, 1)
    const numbers = cleanNIF.substring(1, 8)
    const control = cleanNIF.substring(8, 9)
    
    // Calcular dígito de control
    let sum = 0
    for (let i = 0; i < 7; i++) {
      const digit = parseInt(numbers[i])
      if (i % 2 === 0) {
        // Posiciones pares (1, 3, 5, 7)
        const doubled = digit * 2
        sum += doubled > 9 ? Math.floor(doubled / 10) + (doubled % 10) : doubled
      } else {
        // Posiciones impares (2, 4, 6)
        sum += digit
      }
    }
    
    const controlDigit = (10 - (sum % 10)) % 10
    const controlLetter = 'JABCDEFGHI'[controlDigit]
    
    // Algunos tipos de organización usan letra, otros número
    const useLetterControl = ['K', 'P', 'Q', 'S', 'N'].includes(orgType)
    const expectedControl = useLetterControl ? controlLetter : controlDigit.toString()
    
    if (control === expectedControl) {
      return { isValid: true, type: 'CIF' }
    } else {
      return { isValid: false, type: 'CIF', error: 'Dígito de control incorrecto' }
    }
  }

  return { isValid: false, type: 'unknown', error: 'Formato no válido. Use NIF (12345678A), NIE (X1234567A) o CIF (A12345674)' }
}

export function formatNIF(nif: string): string {
  return nif.replace(/\s+/g, '').toUpperCase()
}