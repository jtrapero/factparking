"use client"

import type React from "react"
import ExcelTools from "@/components/ExcelTools";

export default function ClientsManager() {
  return (
    <div>
<ExcelTools storageKey="facturas" fileName="facturas" />
     </div>
  );
}

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, FileText, Car, CheckCircle } from "lucide-react"
import { InvoicePDF } from "@/components/invoice-pdf"

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
  estado: "pendiente" | "pagada" | "vencida"
  sociedadId: string
}

interface Client {
  id: string
  nombre: string
  apellidos: string
  cifNif: string
  direccion: string
  cp: string
  ciudad: string
}

interface Vehicle {
  id: string
  matricula: string
  cifNif: string
  coche: string
  pvp: number
  activo: boolean
}

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "1",
    numeroFactura: "202401001",
    fechaFactura: "2024-01-15",
    clienteCifNif: "50312463D",
    vehiculoId: "1",
    mes: "1",
    año: "2024",
    baseImponible: 99.17,
    iva: 20.83,
    total: 120.0,
    estado: "pagada",
    sociedadId: "PARKING001",
  },
  {
    id: "2",
    numeroFactura: "202401002",
    fechaFactura: "2024-01-15",
    clienteCifNif: "B44807287",
    vehiculoId: "2",
    mes: "1",
    año: "2024",
    baseImponible: 82.64,
    iva: 17.36,
    total: 100.0,
    estado: "pagada",
    sociedadId: "PARKING001",
  },
  {
    id: "3",
    numeroFactura: "202402001",
    fechaFactura: "2024-02-15",
    clienteCifNif: "B87550075",
    vehiculoId: "3",
    mes: "2",
    año: "2024",
    baseImponible: 123.97,
    iva: 26.03,
    total: 150.0,
    estado: "pendiente",
    sociedadId: "PARKING001",
  },
  {
    id: "4",
    numeroFactura: "202402002",
    fechaFactura: "2024-02-15",
    clienteCifNif: "B03093093",
    vehiculoId: "4",
    mes: "2",
    año: "2024",
    baseImponible: 165.29,
    iva: 34.71,
    total: 200.0,
    estado: "pendiente",
    sociedadId: "PARKING001",
  },
  {
    id: "5",
    numeroFactura: "202403001",
    fechaFactura: "2024-03-15",
    clienteCifNif: "1269547Q",
    vehiculoId: "5",
    mes: "3",
    año: "2024",
    baseImponible: 74.38,
    iva: 15.62,
    total: 90.0,
    estado: "vencida",
    sociedadId: "PARKING001",
  },
]

export function InvoicesManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showPDF, setShowPDF] = useState(false)
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [invoiceType, setInvoiceType] = useState<"individual" | "combined">("individual")

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  // Initialize form data with proper default values
  const getInitialFormData = () => ({
    clienteCifNif: "",
    mes: currentMonth.toString(),
    año: currentYear.toString(),
    estado: "pendiente" as const,
    sociedadId: "PARKING001",
  })

  const [formData, setFormData] = useState(getInitialFormData())

  useEffect(() => {
    try {
      // Cargar facturas
      const storedInvoices = localStorage.getItem("parking-invoices")
      if (storedInvoices) {
        setInvoices(JSON.parse(storedInvoices))
      } else {
        setInvoices(INITIAL_INVOICES)
        localStorage.setItem("parking-invoices", JSON.stringify(INITIAL_INVOICES))
      }

      // Cargar clientes
      const storedClients = localStorage.getItem("parking-clients")
      if (storedClients) {
        setClients(JSON.parse(storedClients))
      }

      // Cargar vehículos
      const storedVehicles = localStorage.getItem("parking-vehicles")
      if (storedVehicles) {
        setVehicles(JSON.parse(storedVehicles))
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setInvoices(INITIAL_INVOICES)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const saveInvoices = (newInvoices: Invoice[]) => {
    setInvoices(newInvoices)
    localStorage.setItem("parking-invoices", JSON.stringify(newInvoices))
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const client = clients.find((c) => c.cifNif === invoice.clienteCifNif)
    const vehicle = vehicles.find((v) => v.id === invoice.vehiculoId)
    const searchLower = searchTerm.toLowerCase()

    return (
      invoice.numeroFactura.toLowerCase().includes(searchLower) ||
      client?.nombre.toLowerCase().includes(searchLower) ||
      client?.apellidos.toLowerCase().includes(searchLower) ||
      vehicle?.matricula.toLowerCase().includes(searchLower)
    )
  })

  const getClientName = (cifNif: string) => {
    const client = clients.find((c) => c.cifNif === cifNif)
    return client ? `${client.nombre} ${client.apellidos}` : cifNif
  }

  const getVehicleInfo = (vehicleId: string) => {
    if (vehicleId.includes(",")) {
      // Factura combinada con múltiples vehículos
      const vehicleIds = vehicleId.split(",")
      const vehicleCount = vehicleIds.length
      const firstVehicle = vehicles.find((v) => v.id === vehicleIds[0])
      return firstVehicle ? `${firstVehicle.matricula} + ${vehicleCount - 1} más` : `${vehicleCount} vehículos`
    }

    const vehicle = vehicles.find((v) => v.id === vehicleId)
    return vehicle ? `${vehicle.matricula} - ${vehicle.coche}` : vehicleId
  }

  const generateInvoiceNumber = (mes: string, año: string) => {
    const month = mes.padStart(2, "0")
    const count = invoices.filter((inv) => inv.año === año && inv.mes === mes).length + 1
    return `${año}${month}${count.toString().padStart(3, "0")}`
  }

  const calculateInvoiceAmounts = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId)
    if (!vehicle) return { baseImponible: 0, iva: 0, total: 0 }

    const baseImponible = vehicle.pvp
    const iva = baseImponible * 0.21 // 21% IVA
    const total = baseImponible + iva

    return { baseImponible, iva, total }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedVehicles.length === 0) {
      alert("Debe seleccionar al menos un vehículo para facturar")
      return
    }

    if (invoiceType === "individual") {
      // Crear una factura por cada vehículo seleccionado
      const newInvoices: Invoice[] = []

      selectedVehicles.forEach((vehicleId, index) => {
        const amounts = calculateInvoiceAmounts(vehicleId)
        const numeroFactura = generateInvoiceNumber(formData.mes, formData.año) + (index > 0 ? `-${index + 1}` : "")

        const invoiceData = {
          clienteCifNif: formData.clienteCifNif,
          vehiculoId: vehicleId,
          mes: formData.mes,
          año: formData.año,
          estado: formData.estado,
          sociedadId: formData.sociedadId,
          numeroFactura,
          fechaFactura: new Date().toISOString().split("T")[0],
          ...amounts,
        }

        if (editingInvoice && selectedVehicles.length === 1) {
          newInvoices.push({ ...invoiceData, id: editingInvoice.id })
        } else {
          newInvoices.push({ ...invoiceData, id: `${Date.now()}-${index}` })
        }
      })

      if (editingInvoice && selectedVehicles.length === 1) {
        const updatedInvoices = invoices.map((invoice) => (invoice.id === editingInvoice.id ? newInvoices[0] : invoice))
        saveInvoices(updatedInvoices)
      } else {
        saveInvoices([...invoices, ...newInvoices])
      }
    } else {
      // Crear una sola factura combinada con todos los vehículos
      const totalAmounts = selectedVehicles.reduce(
        (acc, vehicleId) => {
          const amounts = calculateInvoiceAmounts(vehicleId)
          return {
            baseImponible: acc.baseImponible + amounts.baseImponible,
            iva: acc.iva + amounts.iva,
            total: acc.total + amounts.total,
          }
        },
        { baseImponible: 0, iva: 0, total: 0 },
      )

      const numeroFactura = generateInvoiceNumber(formData.mes, formData.año)

      // Para factura combinada, usamos el primer vehículo como referencia pero guardamos todos los IDs
      const combinedInvoiceData = {
        clienteCifNif: formData.clienteCifNif,
        vehiculoId: selectedVehicles.join(","), // Guardamos todos los IDs separados por coma
        mes: formData.mes,
        año: formData.año,
        estado: formData.estado,
        sociedadId: formData.sociedadId,
        numeroFactura,
        fechaFactura: new Date().toISOString().split("T")[0],
        ...totalAmounts,
      }

      if (editingInvoice) {
        const updatedInvoices = invoices.map((invoice) =>
          invoice.id === editingInvoice.id ? { ...combinedInvoiceData, id: editingInvoice.id } : invoice,
        )
        saveInvoices(updatedInvoices)
      } else {
        const newInvoice: Invoice = {
          ...combinedInvoiceData,
          id: Date.now().toString(),
        }
        saveInvoices([...invoices, newInvoice])
      }
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData(getInitialFormData())
    setSelectedVehicles([])
    setInvoiceType("individual")
    setEditingInvoice(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setFormData({
      clienteCifNif: invoice.clienteCifNif || "",
      mes: invoice.mes || currentMonth.toString(),
      año: invoice.año || currentYear.toString(),
      estado: invoice.estado || "pendiente",
      sociedadId: invoice.sociedadId || "PARKING001",
    })
    setSelectedVehicles([invoice.vehiculoId])
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar esta factura?")) {
      const updatedInvoices = invoices.filter((invoice) => invoice.id !== id)
      saveInvoices(updatedInvoices)
    }
  }

  const handleViewPDF = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowPDF(true)
  }

  const getClientVehicles = (cifNif: string) => {
    if (!cifNif) return []
    return vehicles.filter((v) => v.cifNif === cifNif && v.activo === true)
  }

  const months = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ]

  const handleClientChange = (value: string) => {
    setFormData({ ...formData, clienteCifNif: value })

    // Automáticamente seleccionar TODOS los vehículos activos del cliente
    const clientVehicles = getClientVehicles(value)
    const vehicleIds = clientVehicles.map((v) => v.id)
    setSelectedVehicles(vehicleIds)
  }

  const toggleVehicleSelection = (vehicleId: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId],
    )
  }

  const getTotalAmount = () => {
    return selectedVehicles.reduce((total, vehicleId) => {
      const amounts = calculateInvoiceAmounts(vehicleId)
      return total + amounts.total
    }, 0)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Facturas</CardTitle>
          <CardDescription>Genere y administre las facturas mensuales de parking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar facturas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingInvoice(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Factura
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingInvoice ? "Editar Factura" : "Nueva Factura"}</DialogTitle>
                  <DialogDescription>
                    Seleccione el cliente y automáticamente se cargarán todos sus vehículos activos
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cliente">Cliente</Label>
                      <Select value={formData.clienteCifNif} onValueChange={handleClientChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.cifNif}>
                              {client.nombre} {client.apellidos}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="estado">Estado</Label>
                      <Select
                        value={formData.estado}
                        onValueChange={(value: "pendiente" | "pagada" | "vencida") =>
                          setFormData({ ...formData, estado: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="pagada">Pagada</SelectItem>
                          <SelectItem value="vencida">Vencida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mes">Mes</Label>
                      <Select value={formData.mes} onValueChange={(value) => setFormData({ ...formData, mes: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="año">Año</Label>
                      <Input
                        id="año"
                        type="number"
                        value={formData.año}
                        onChange={(e) => setFormData({ ...formData, año: e.target.value })}
                        min="2020"
                        max="2030"
                        required
                      />
                    </div>
                  </div>

                  {/* Vehículos del cliente */}
                  {formData.clienteCifNif && (
                    <div>
                      <Label>Vehículos del Cliente</Label>
                      <div className="border rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
                        {getClientVehicles(formData.clienteCifNif).length > 0 ? (
                          getClientVehicles(formData.clienteCifNif).map((vehicle) => (
                            <div
                              key={vehicle.id}
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                                selectedVehicles.includes(vehicle.id)
                                  ? "bg-blue-50 border-blue-200"
                                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                              }`}
                              onClick={() => toggleVehicleSelection(vehicle.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    selectedVehicles.includes(vehicle.id)
                                      ? "bg-blue-500 border-blue-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {selectedVehicles.includes(vehicle.id) && (
                                    <CheckCircle className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <Car className="w-4 h-4 text-gray-500" />
                                <div>
                                  <div className="font-medium">{vehicle.matricula}</div>
                                  <div className="text-sm text-gray-500">{vehicle.coche}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{vehicle.pvp.toFixed(2)} €</div>
                                <div className="text-sm text-gray-500">mensual</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Car className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>Este cliente no tiene vehículos activos.</p>
                            <p className="text-sm">Vaya a la pestaña "Vehículos" para añadir uno.</p>
                          </div>
                        )}
                      </div>

                      {selectedVehicles.length > 0 && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-green-800">
                              {selectedVehicles.length} vehículo{selectedVehicles.length > 1 ? "s" : ""} seleccionado
                              {selectedVehicles.length > 1 ? "s" : ""}
                            </span>
                            <span className="font-bold text-green-800">Total: {getTotalAmount().toFixed(2)} €</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tipo de Facturación */}
                  {selectedVehicles.length > 1 && (
                    <div>
                      <Label>Tipo de Facturación</Label>
                      <div className="flex gap-4 mt-2">
                        <div
                          className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                            invoiceType === "individual"
                              ? "bg-blue-50 border-blue-200"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`}
                          onClick={() => setInvoiceType("individual")}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              invoiceType === "individual" ? "border-blue-500" : "border-gray-300"
                            }`}
                          >
                            {invoiceType === "individual" && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          </div>
                          <div>
                            <div className="font-medium text-sm">Una factura por vehículo</div>
                            <div className="text-xs text-gray-500">
                              Se crearán {selectedVehicles.length} facturas separadas
                            </div>
                          </div>
                        </div>

                        <div
                          className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                            invoiceType === "combined"
                              ? "bg-blue-50 border-blue-200"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`}
                          onClick={() => setInvoiceType("combined")}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              invoiceType === "combined" ? "border-blue-500" : "border-gray-300"
                            }`}
                          >
                            {invoiceType === "combined" && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          </div>
                          <div>
                            <div className="font-medium text-sm">Una factura combinada</div>
                            <div className="text-xs text-gray-500">Todos los vehículos en una sola factura</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={selectedVehicles.length === 0}>
                      {editingInvoice ? "Actualizar" : "Crear"}
                      {selectedVehicles.length > 1
                        ? invoiceType === "individual"
                          ? ` ${selectedVehicles.length} Facturas`
                          : " Factura Combinada"
                        : " Factura"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {!isLoaded ? (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-gray-500">Cargando datos...</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Factura</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono font-medium">{invoice.numeroFactura}</TableCell>
                      <TableCell>{getClientName(invoice.clienteCifNif)}</TableCell>
                      <TableCell>{getVehicleInfo(invoice.vehiculoId)}</TableCell>
                      <TableCell>
                        {months.find((m) => m.value === invoice.mes)?.label} {invoice.año}
                      </TableCell>
                      <TableCell>{invoice.total.toFixed(2)} €</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.estado === "pagada"
                              ? "default"
                              : invoice.estado === "vencida"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {invoice.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewPDF(invoice)}>
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(invoice)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(invoice.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No se encontraron facturas
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {showPDF && selectedInvoice && (
        <InvoicePDF
          invoice={selectedInvoice}
          client={clients.find((c) => c.cifNif === selectedInvoice.clienteCifNif)!}
          vehicle={
            selectedInvoice.vehiculoId.includes(",")
              ? selectedInvoice.vehiculoId
                  .split(",")
                  .map((id) => vehicles.find((v) => v.id === id)!)
                  .filter(Boolean)
              : vehicles.find((v) => v.id === selectedInvoice.vehiculoId)!
          }
          onClose={() => setShowPDF(false)}
        />
      )}
    </>
  )
}
