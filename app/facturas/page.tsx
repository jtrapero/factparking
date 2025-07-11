"use client"

import { Label } from "@/components/ui/label"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Search, Filter, Download, Plus, Edit, Trash2, Upload } from "lucide-react"
import Link from "next/link"
import { exportToCsv } from "@/lib/exportToCsv"
import { importFromCsv } from "@/lib/importFromCsv"
import { useState } from "react"

export default function FacturasPage() {
  const [invoices, setInvoices] = useState([
    {
      id: "FAC-2024-001",
      subscriber: "María García López",
      email: "maria.garcia@email.com",
      amount: "€85.00",
      status: "Pagada",
      date: "15/01/2024",
      dueDate: "31/01/2024",
      period: "Enero 2024",
      parkingSpot: "A-15",
    },
    {
      id: "FAC-2024-002",
      subscriber: "Carlos Rodríguez Pérez",
      email: "carlos.rodriguez@email.com",
      amount: "€85.00",
      status: "Pendiente",
      date: "15/01/2024",
      dueDate: "31/01/2024",
      period: "Enero 2024",
      parkingSpot: "B-08",
    },
    {
      id: "FAC-2024-003",
      subscriber: "Ana Martín Sánchez",
      email: "ana.martin@email.com",
      amount: "€120.00",
      status: "Pagada",
      date: "15/01/2024",
      dueDate: "31/01/2024",
      period: "Enero 2024",
      parkingSpot: "C-22",
    },
    {
      id: "FAC-2024-004",
      subscriber: "José Luis Fernández",
      email: "joseluis.fernandez@email.com",
      amount: "€85.00",
      status: "Vencida",
      date: "15/01/2024",
      dueDate: "31/01/2024",
      period: "Enero 2024",
      parkingSpot: "A-03",
    },
    {
      id: "FAC-2024-005",
      subscriber: "Laura Jiménez Torres",
      email: "laura.jimenez@email.com",
      amount: "€95.00",
      status: "Pendiente",
      date: "15/01/2024",
      dueDate: "31/01/2024",
      period: "Enero 2024",
      parkingSpot: "D-11",
    },
  ])

  const handleExport = () => {
    exportToCsv("facturas.csv", invoices)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const headers = Object.keys(invoices[0] || {}) // Usar los encabezados de los datos existentes
      importFromCsv(
        file,
        (data) => {
          // En una aplicación real, aquí validarías y fusionarías los datos
          setInvoices((prevInvoices) => [...prevInvoices, ...(data as typeof invoices)]) // Añadir, no reemplazar
          alert(`Se han importado ${data.length} facturas (simulado).`)
        },
        headers,
      )
    }
  }

  const handleDelete = (id: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la factura ${id}?`)) {
      console.log(`Eliminando factura ${id}`)
      setInvoices(invoices.filter((invoice) => invoice.id !== id))
      // Lógica para eliminar la factura de la BBDD
    }
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
            <div className="flex items-center space-x-4">
              <Button asChild>
                <Link href="/facturas/nueva">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Factura
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="flex space-x-8 mb-8">
          <Link href="/" className="text-gray-500 hover:text-gray-700 pb-2">
            Dashboard
          </Link>
          <Link href="/facturas" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-2">
            Facturas
          </Link>
          <Link href="/clientes" className="text-gray-500 hover:text-gray-700 pb-2">
            Clientes
          </Link>
          <Link href="/vehiculos" className="text-gray-500 hover:text-gray-700 pb-2">
            Vehículos
          </Link>
          <Link href="/configuracion" className="text-gray-500 hover:text-gray-700 pb-2">
            Configuración
          </Link>
        </nav>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Buscar por nombre o ID..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="pagada">Pagada</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="vencida">Vencida</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enero-2024">Enero 2024</SelectItem>
                  <SelectItem value="diciembre-2023">Diciembre 2023</SelectItem>
                  <SelectItem value="noviembre-2023">Noviembre 2023</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Facturas</CardTitle>
                <CardDescription>Gestiona todas las facturas de los abonados</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar a Excel
                </Button>
                <Input id="import-invoices" type="file" accept=".csv" className="hidden" onChange={handleImport} />
                <Label
                  htmlFor="import-invoices"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importar desde Excel
                </Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">ID Factura</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Abonado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Plaza</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Período</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Importe</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Vencimiento</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium">{invoice.id}</div>
                        <div className="text-sm text-gray-500">{invoice.date}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium">{invoice.subscriber}</div>
                        <div className="text-sm text-gray-500">{invoice.email}</div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline">{invoice.parkingSpot}</Badge>
                      </td>
                      <td className="py-4 px-4">{invoice.period}</td>
                      <td className="py-4 px-4 font-medium">{invoice.amount}</td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            invoice.status === "Pagada"
                              ? "default"
                              : invoice.status === "Pendiente"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">{invoice.dueDate}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/facturas/editar/${invoice.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => handleDelete(invoice.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
