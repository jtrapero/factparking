"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Car, ArrowLeft, Save, Send, Plus, X } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Datos de la empresa emisora (fijos para este ejemplo)
const COMPANY_INFO = {
  name: "ALMACENAMIENTOS Y ESPACIOS MULTIFUNCION S.L.",
  address1: "MADRID",
  address2: "28044 MADRID",
  cif: "B-88551544",
  address3: "AV CARABANCHEL ALTO, 7 BAJO",
}

// Datos de clientes simulados
const clients = [
  {
    id: "1",
    name: "AONDA SOLUCIONES SL",
    cifNif: "B44807287",
    address: "C/ SANCHEZ BARCAIZTEGUI 33",
    cp: "28007",
    city: "MADRID",
    phone: "+34 912 345 678",
    email: "aonda@soluciones.com",
  },
  {
    id: "2",
    name: "Carlos Rodríguez Pérez",
    cifNif: "87654321B",
    address: "Avenida Siempre Viva 45",
    cp: "08001",
    city: "Barcelona",
    phone: "+34 666 789 012",
    email: "carlos.rodriguez@email.com",
  },
  {
    id: "3",
    name: "Ana Martín Sánchez",
    cifNif: "11223344C",
    address: "Plaza Mayor 1",
    cp: "41001",
    city: "Sevilla",
    phone: "+34 666 345 678",
    email: "ana.martin@email.com",
  },
]

// Datos de facturas simuladas para edición
const mockInvoices = [
  {
    id: "FAC-2024-001",
    clientId: "1",
    invoiceDate: "2024-01-15",
    invoiceNumber: "0001",
    observations: "Factura de abono mensual de parking.",
    paymentType: "TRANSFERENCIA",
    paymentEntity: "LA CAIXA",
    paymentCcc: "ES51 2100 1549 6102 0029 2896",
    otherObservations: "80 DE MESES ANTERIORES",
    billingPeriod: "Enero 2024",
    items: [{ id: 1, description: "ABONO PLAZA PARKING ENERO", price: 240.0, quantity: 1, total: 240.0 }],
  },
  {
    id: "FAC-2024-002",
    clientId: "2",
    invoiceDate: "2024-01-15",
    invoiceNumber: "0002",
    observations: "Abono de parking febrero.",
    paymentType: "TARJETA",
    paymentEntity: "BBVA",
    paymentCcc: "ESXX XXXX XXXX XXXX XXXX XXXX",
    otherObservations: "",
    billingPeriod: "Febrero 2024",
    items: [{ id: 1, description: "ABONO PLAZA PARKING FEBRERO", price: 85.0, quantity: 1, total: 85.0 }],
  },
]

interface InvoiceItem {
  id: number
  description: string
  price: number
  quantity: number
  total: number
}

export default function EditarFacturaPage() {
  const params = useParams()
  const invoiceId = params.id as string

  const [invoiceData, setInvoiceData] = useState({
    clientId: "",
    invoiceDate: "",
    invoiceNumber: "",
    observations: "",
    paymentType: "",
    paymentEntity: "",
    paymentCcc: "",
    otherObservations: "",
    billingPeriod: "",
  })
  const [selectedClient, setSelectedClient] = useState<(typeof clients)[0] | null>(null)
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [loading, setLoading] = useState(true)

  // Generar opciones para el mes de facturación
  const getBillingPeriods = () => {
    const periods = []
    const today = new Date()
    const monthNames = [
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

    for (let i = 0; i < 6; i++) {
      // Últimos 6 meses
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      periods.push(`${monthNames[date.getMonth()]} ${date.getFullYear()}`)
    }
    return periods
  }

  useEffect(() => {
    // Simular carga de datos de la factura
    const invoiceToEdit = mockInvoices.find((inv) => inv.id === invoiceId)
    if (invoiceToEdit) {
      setInvoiceData({
        clientId: invoiceToEdit.clientId,
        invoiceDate: invoiceToEdit.invoiceDate,
        invoiceNumber: invoiceToEdit.invoiceNumber,
        observations: invoiceToEdit.observations,
        paymentType: invoiceToEdit.paymentType,
        paymentEntity: invoiceToEdit.paymentEntity,
        paymentCcc: invoiceToEdit.paymentCcc,
        otherObservations: invoiceToEdit.otherObservations,
        billingPeriod: invoiceToEdit.billingPeriod,
      })
      setItems(invoiceToEdit.items)
      const client = clients.find((c) => c.id === invoiceToEdit.clientId)
      setSelectedClient(client || null)
    } else {
      console.error("Factura no encontrada:", invoiceId)
      // Redirigir o mostrar error
    }
    setLoading(false)
  }, [invoiceId])

  useEffect(() => {
    if (invoiceData.clientId) {
      const client = clients.find((c) => c.id === invoiceData.clientId)
      setSelectedClient(client || null)
    } else {
      setSelectedClient(null)
    }
  }, [invoiceData.clientId])

  const handleItemChange = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "price" || field === "quantity") {
            updatedItem.total = updatedItem.price * updatedItem.quantity
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  const addItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      { id: prevItems.length + 1, description: "", price: 0, quantity: 1, total: 0 },
    ])
  }

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const ivaRate = 0.21
  const ivaAmount = subtotal * ivaRate
  const totalAmount = subtotal + ivaAmount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Datos de la factura actualizados:", {
      id: invoiceId,
      ...invoiceData,
      client: selectedClient,
      items,
      subtotal,
      ivaAmount,
      totalAmount,
    })
    // Aquí iría la lógica para actualizar la factura en la BBDD
    alert("Factura actualizada con éxito (simulado)!")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Cargando factura...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ParkingFact</h1>
                <p className="text-sm text-gray-500">Sistema de Facturación</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/facturas">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Facturas
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Editar Factura: {invoiceId}</h2>
          <p className="text-gray-600 mt-2">Modifica la información de la factura existente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Company Info */}
              <div className="border p-4 rounded-lg bg-gray-50">
                <h3 className="font-bold text-lg mb-2">FACTURA</h3>
                <p className="font-medium">{COMPANY_INFO.name}</p>
                <p className="text-sm">{COMPANY_INFO.address1}</p>
                <p className="text-sm">{COMPANY_INFO.address2}</p>
                <p className="text-sm">{COMPANY_INFO.cif}</p>
                <p className="text-sm">{COMPANY_INFO.address3}</p>
              </div>

              {/* Client Info */}
              <div className="border p-4 rounded-lg bg-gray-50">
                <h3 className="font-bold text-lg mb-2">CLIENTE</h3>
                <div className="space-y-2">
                  <Label htmlFor="clientId">Seleccionar Cliente</Label>
                  <Select
                    value={invoiceData.clientId}
                    onValueChange={(value) => setInvoiceData({ ...invoiceData, clientId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} ({client.cifNif})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedClient && (
                  <div className="mt-4 text-sm space-y-1">
                    <p>
                      <span className="font-medium">Nombre:</span> {selectedClient.name}
                    </p>
                    <p>
                      <span className="font-medium">Dirección:</span> {selectedClient.address}
                    </p>
                    <p>
                      <span className="font-medium">Ciudad:</span> {selectedClient.city}
                    </p>
                    <p>
                      <span className="font-medium">Provincia, CP:</span> {selectedClient.city}, {selectedClient.cp}
                    </p>
                    <p>
                      <span className="font-medium">CIF - NIF:</span> {selectedClient.cifNif}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {/* Invoice Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">Fecha Factura</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={invoiceData.invoiceDate}
                    onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Nº de Factura</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                    readOnly // El número de factura es automático
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="billingPeriod">Período de Facturación</Label>
                  <Select
                    value={invoiceData.billingPeriod}
                    onValueChange={(value) => setInvoiceData({ ...invoiceData, billingPeriod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      {getBillingPeriods().map((period) => (
                        <SelectItem key={period} value={period}>
                          {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                value={invoiceData.observations}
                onChange={(e) => setInvoiceData({ ...invoiceData, observations: e.target.value })}
                rows={2}
              />
            </div>

            {/* Detail Table */}
            <div className="mt-8">
              <h3 className="font-bold text-lg mb-4">DETALLE</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="text-left p-2 border">DENOMINACIÓN</th>
                      <th className="text-right p-2 border w-[120px]">Precio</th>
                      <th className="text-center p-2 border w-[100px]">Unidades</th>
                      <th className="text-right p-2 border w-[120px]">Importe</th>
                      <th className="p-2 border w-[50px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2 border">
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                          />
                        </td>
                        <td className="p-2 border">
                          <Input
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleItemChange(item.id, "price", Number.parseFloat(e.target.value) || 0)}
                            className="text-right"
                          />
                        </td>
                        <td className="p-2 border">
                          <Input
                            type="number"
                            step="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(item.id, "quantity", Number.parseInt(e.target.value) || 0)
                            }
                            className="text-center"
                          />
                        </td>
                        <td className="p-2 border text-right font-medium">€{item.total.toFixed(2)}</td>
                        <td className="p-2 border text-center">
                          <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir Línea
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Payment Info */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-2">FORMA DE PAGO</h3>
                <div className="space-y-2">
                  <Label htmlFor="paymentType">Tipo</Label>
                  <Input
                    id="paymentType"
                    value={invoiceData.paymentType}
                    onChange={(e) => setInvoiceData({ ...invoiceData, paymentType: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentEntity">Entidad</Label>
                  <Input
                    id="paymentEntity"
                    value={invoiceData.paymentEntity}
                    onChange={(e) => setInvoiceData({ ...invoiceData, paymentEntity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentCcc">C.C.C.</Label>
                  <Input
                    id="paymentCcc"
                    value={invoiceData.paymentCcc}
                    onChange={(e) => setInvoiceData({ ...invoiceData, paymentCcc: e.target.value })}
                  />
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-4 flex flex-col justify-end">
                <div className="flex justify-between text-sm">
                  <span>Base Imponible:</span>
                  <span className="font-medium">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>I.V.A. {ivaRate * 100}%:</span>
                  <span className="font-medium">€{ivaAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-4">
                  <span>TOTAL A PAGAR:</span>
                  <span>€{totalAmount.toFixed(2)}</span>
                </div>
                <p className="text-right text-gray-600 mt-4">¡Gracias por su confianza!</p>
              </div>
            </div>

            {/* Other Observations */}
            <div className="mt-8 space-y-2">
              <h3 className="font-bold text-lg mb-2">OTRAS OBSERVACIONES</h3>
              <Textarea
                id="otherObservations"
                value={invoiceData.otherObservations}
                onChange={(e) => setInvoiceData({ ...invoiceData, otherObservations: e.target.value })}
                rows={2}
              />
            </div>
          </Card>

          <div className="flex justify-end space-x-4 mt-6">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
            <Button type="button" variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Guardar y Enviar
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
