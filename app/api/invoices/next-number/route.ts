import { NextResponse } from "next/server"

// Simulación de un contador de factura en el "backend"
let lastInvoiceNumber = 9 // Empezamos desde 0009 como en tu ejemplo

export async function GET() {
  // En una aplicación real, esto leería el último número de factura de una base de datos
  // y lo incrementaría de forma segura (ej. con transacciones o bloqueos).
  lastInvoiceNumber++
  const nextNumber = String(lastInvoiceNumber).padStart(4, "0") // Formato 00XX
  return NextResponse.json({ nextInvoiceNumber: nextNumber })
}
