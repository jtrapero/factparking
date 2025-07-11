export function exportToCsv(filename: string, rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) {
    console.warn("No hay datos para exportar.")
    return
  }

  const header = Object.keys(rows[0])
  const csvContent = [
    header.join(";"), // Encabezados separados por punto y coma
    ...rows.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName])).join(";")), // Datos
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  if (link.download !== undefined) {
    // Feature detection for download attribute
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
