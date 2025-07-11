"use client"

import { Label } from "@/components/ui/label"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Search, Plus, Edit, Trash2, Download, Upload } from "lucide-react"
import Link from "next/link"
import { exportToCsv } from "@/lib/exportToCsv"
import { importFromCsv } from "@/lib/importFromCsv"
import { useState } from "react"

export default function VehiculosPage() {
  const [vehicles, setVehicles] = useState([
    {
      id: "v1",
      cifNif: "12345678A",
      clientName: "María García López",
      licensePlate: "1234 ABC",
      type: "Coche",
      active: true,
      price: "€85.00",
    },
    {
      id: "v2",
      cifNif: "87654321B",
      clientName: "Carlos Rodríguez Pérez",
      licensePlate: "5678 DEF",
      type: "Moto",
      active: true,
      price: "€40.00",
    },
    {
      id: "v3",
      cifNif: "11223344C",
      clientName: "Ana Martín Sánchez",
      licensePlate: "9012 GHI",
      type: "Coche",
      active: false,
      price: "€120.00",
    },
    {
      id: "v4",
      cifNif: "55667788D",
      clientName: "José Luis Fernández",
      licensePlate: "3456 JKL",
      type: "Coche",
      active: true,
      price: "€85.00",
    },
    {
      id: "v5",
      cifNif: "99001122E",
      clientName: "Laura Jiménez Torres",
      licensePlate: "7890 MNO",
      type: "Furgoneta",
      active: true,
      price: "€95.00",
    },
  ])

  // Datos de clientes simulados para el filtro
  const clients = [
    { id: "1", name: "María García López", cifNif: "12345678A" },
    { id: "2", name: "Carlos Rodríguez Pérez", cifNif: "87654321B" },
    { id: "3", name: "Ana Martín Sánchez", cifNif: "11223344C" },
    { id: "4", name: "José Luis Fernández", cifNif: "55667788D" },
    { id: "5", name: "Laura Jiménez Torres", cifNif: "99001122E" },
  ]

  const handleExport = () => {
    exportToCsv("vehiculos.csv", vehicles)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const headers = Object.keys(vehicles[0] || {}) // Usar los encabezados de los datos existentes
      importFromCsv(
        file,
        (data) => {
          // En una aplicación real, aquí validarías y fusionarías los datos
          setVehicles((prevVehicles) => [...prevVehicles, ...(data as typeof vehicles)]) // Añadir, no reemplazar
          alert(`Se han importado ${data.length} vehículos (simulado).`)
        },
        headers,
      )
    }
  }

  const handleDelete = (id: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el vehículo ${id}?`)) {
      console.log(`Eliminando vehículo ${id}`)
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id))
      // Lógica para eliminar el vehículo de la BBDD
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
                <Link href="/vehiculos/nuevo">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Vehículo
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
          <Link href="/facturas" className="text-gray-500 hover:text-gray-700 pb-2">
            Facturas
          </Link>
          <Link href="/clientes" className="text-gray-500 hover:text-gray-700 pb-2">
            Clientes
          </Link>
          <Link href="/vehiculos" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-2">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Buscar por matrícula o tipo..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por Cliente (NIF/CIF)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los Clientes</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.cifNif}>
                      {client.name} ({client.cifNif})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vehículos Registrados</CardTitle>
                <CardDescription>Gestiona los vehículos asociados a los clientes</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar a Excel
                </Button>
                <Input id="import-vehicles" type="file" accept=".csv" className="hidden" onChange={handleImport} />
                <Label
                  htmlFor="import-vehicles"
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
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Matrícula</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Tipo de Vehículo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Cliente (NIF/CIF)</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Precio Abono</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">{vehicle.licensePlate}</td>
                      <td className="py-4 px-4">{vehicle.type}</td>
                      <td className="py-4 px-4">
                        <div className="font-medium">{vehicle.clientName}</div>
                        <div className="text-sm text-gray-500">{vehicle.cifNif}</div>
                      </td>
                      <td className="py-4 px-4">{vehicle.price}</td>
                      <td className="py-4 px-4">
                        <Badge variant={vehicle.active ? "default" : "secondary"}>
                          {vehicle.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/vehiculos/editar/${vehicle.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => handleDelete(vehicle.id)}
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
