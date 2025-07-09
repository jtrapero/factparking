"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Invoice {
  id: string
  numeroFactura: string
  fechaFactura: string
  clienteCifNif: string
  vehiculoId: string
  mes: string
  año: string
  baseImponible: number
  iva: number
  total: number
  estado: string
}

interface Client {
  nombre: string
  apellidos: string
  cifNif: string
  direccion: string
  cp: string
  ciudad: string
}

interface Vehicle {
  matricula: string
  coche: string
  pvp: number
}

interface CompanyInfo {
  nombre: string
  direccion: string
  cp: string
  ciudad: string
  cif: string
  cuentaBancaria: string
  entidadBancaria: string
}

interface InvoicePDFProps {
  invoice: Invoice
  client: Client
  vehicle: Vehicle | Vehicle[] // Puede ser un vehículo o array de vehículos
  onClose: () => void
}

export function InvoicePDF({ invoice, client, vehicle, onClose }: InvoicePDFProps) {
  const [companyInfo] = useLocalStorage<CompanyInfo>("parking-company", {
    nombre: "ALMACENAMIENTOS Y ESPACIOS MULTIFUNCION S.L",
    direccion: "AV CARABANCHEL ALTO, 7 BAJO",
    cp: "28044",
    ciudad: "MADRID",
    cif: "B-88551544",
    cuentaBancaria: "ES51 2100 1549 6102 0029 2896",
    entidadBancaria: "LA CAIXA",
  })

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const monthNames = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ]
    const day = date.getDate()
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    return `${day} de ${month} de ${year}`
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Factura {invoice.numeroFactura}
            <div className="flex gap-2">
              <Button onClick={handlePrint} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button onClick={onClose} variant="outline" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="bg-white p-8 text-black" style={{ fontFamily: "Arial, sans-serif" }}>
          {/* Header */}
          <div className="border-2 border-black mb-6">
            <div className="bg-white p-4">
              <div className="flex justify-between">
                <div className="border-2 border-black p-3 flex-1 mr-4">
                  <div className="font-bold text-sm mb-2">{companyInfo.nombre}</div>
                  <div className="text-sm">{companyInfo.direccion}</div>
                  <div className="text-sm">
                    {companyInfo.cp} {companyInfo.ciudad}
                  </div>
                  <div className="text-sm font-bold">{companyInfo.cif}</div>
                </div>

                <div className="border-2 border-black p-3 flex-1">
                  <div className="font-bold text-sm mb-2">CLIENTE</div>
                  <div className="text-sm font-bold">
                    {client.nombre} {client.apellidos}
                  </div>
                  <div className="text-sm">{client.direccion}</div>
                  <div className="text-sm">{client.ciudad}</div>
                  <div className="text-sm">{client.cp}</div>
                  <div className="text-sm font-bold">{client.cifNif}</div>
                </div>
              </div>

              <div className="flex mt-4 gap-4">
                <div>
                  <span className="font-bold">Fecha Factura:</span>
                  <span className="ml-2 border-b border-black px-2">{formatDate(invoice.fechaFactura)}</span>
                </div>
                <div>
                  <span className="font-bold">Nº de Factura:</span>
                  <span className="ml-2 border-b border-black px-2">{invoice.numeroFactura}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="mb-4">
            <div className="border border-black p-2">
              <div className="font-bold text-sm">Observaciones</div>
              <div className="h-8"></div>
            </div>
          </div>

          {/* Details Table */}
          <div className="mb-4">
            <div className="font-bold text-sm mb-2">DETALLE</div>
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr>
                  <th className="border border-black p-2 text-left font-bold text-sm">DENOMINACIÓN</th>
                  <th className="border border-black p-2 text-center font-bold text-sm">Precio</th>
                  <th className="border border-black p-2 text-center font-bold text-sm">Unidades, Cantidad</th>
                  <th className="border border-black p-2 text-center font-bold text-sm">Importe</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(vehicle) ? (
                  // Múltiples vehículos
                  vehicle.map((v, index) => (
                    <tr key={index}>
                      <td className="border border-black p-2 text-sm">
                        ABONO PLAZA PARKING {months[Number.parseInt(invoice.mes) - 1].toUpperCase()} {invoice.año} -{" "}
                        {v.matricula}
                      </td>
                      <td className="border border-black p-2 text-center text-sm">{v.pvp.toFixed(2)} €</td>
                      <td className="border border-black p-2 text-center text-sm">1</td>
                      <td className="border border-black p-2 text-center text-sm">{v.pvp.toFixed(2)} €</td>
                    </tr>
                  ))
                ) : (
                  // Un solo vehículo
                  <tr>
                    <td className="border border-black p-2 text-sm">
                      ABONO PLAZA PARKING {months[Number.parseInt(invoice.mes) - 1].toUpperCase()} {invoice.año}
                    </td>
                    <td className="border border-black p-2 text-center text-sm">
                      {invoice.baseImponible.toFixed(2)} €
                    </td>
                    <td className="border border-black p-2 text-center text-sm">1</td>
                    <td className="border border-black p-2 text-center text-sm">
                      {invoice.baseImponible.toFixed(2)} €
                    </td>
                  </tr>
                )}
                {/* Empty rows */}
                {[...Array(Array.isArray(vehicle) ? Math.max(0, 4 - vehicle.length) : 4)].map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="border border-black p-2 h-8"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment and Total */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="border-2 border-black p-3 mb-4">
                <div className="font-bold text-sm mb-2">FORMA DE PAGO</div>
                <div className="mb-2">
                  <span className="font-bold text-sm">Tipo:</span>
                  <span className="ml-2 text-sm">TRANSFERENCIA</span>
                </div>
                <div className="mb-2">
                  <span className="font-bold text-sm">Entidad:</span>
                  <span className="ml-2 text-sm">{companyInfo.entidadBancaria}</span>
                </div>
                <div>
                  <span className="font-bold text-sm">C.C.C:</span>
                  <span className="ml-2 text-sm">{companyInfo.cuentaBancaria}</span>
                </div>
              </div>
            </div>

            <div className="w-64">
              <table className="w-full border-collapse border border-black mb-4">
                <tbody>
                  <tr>
                    <td className="border border-black p-2 text-sm">Base Imponible</td>
                    <td className="border border-black p-2 text-right text-sm">{invoice.baseImponible.toFixed(2)} €</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-sm">I.V.A. 21,00%</td>
                    <td className="border border-black p-2 text-right text-sm">{invoice.iva.toFixed(2)} €</td>
                  </tr>
                </tbody>
              </table>

              <div className="border-2 border-black p-2 text-center">
                <div className="font-bold text-sm">TOTAL A PAGAR</div>
                <div className="font-bold text-lg">{invoice.total.toFixed(2)} €</div>
              </div>
            </div>
          </div>

          {/* Other Observations */}
          <div className="mb-6">
            <div className="font-bold text-sm mb-2">Otras OBSERVACIONES</div>
            <div className="border border-black p-2 h-32">
              <div className="text-center mt-16 text-sm font-bold">¡Gracias por su confianza!</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
