export function importFromCsv<T>(file: File, onDataParsed: (data: T[]) => void, headers: string[]) {
  const reader = new FileReader()

  reader.onload = (e: ProgressEvent<FileReader>) => {
    const text = e.target?.result as string
    const lines = text.split("\n").filter((line) => line.trim() !== "")

    if (lines.length === 0) {
      console.warn("El archivo CSV está vacío.")
      onDataParsed([])
      return
    }

    // Asumimos que la primera línea son los encabezados si no se proporcionan
    const fileHeaders = lines[0].split(";")
    const dataLines = lines.slice(1)

    const parsedData: T[] = dataLines.map((line) => {
      const values = line.split(";")
      const row: Record<string, any> = {}
      headers.forEach((header, index) => {
        try {
          // Intenta parsear como JSON (para números, booleanos, etc.)
          // Si el valor es una cadena vacía, se convierte a null o undefined
          row[header] = values[index] === "" ? null : JSON.parse(values[index])
        } catch (e) {
          row[header] = values[index] // Si falla, déjalo como string
        }
      })
      return row as T
    })
    onDataParsed(parsedData)
  }

  reader.onerror = (e) => {
    console.error("Error al leer el archivo:", e)
    alert("Error al leer el archivo. Por favor, inténtalo de nuevo.")
  }

  reader.readAsText(file)
}
