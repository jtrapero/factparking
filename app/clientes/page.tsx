"use client"

import { Label } from "@/components/ui/label"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Search, Plus, Mail, Phone, Edit, Trash2, MapPin, Download, Upload } from "lucide-react"
import Link from "next/link"
import { exportToCsv } from "@/lib/exportToCsv"
import { importFromCsv } from "@/lib/importFromCsv"
import { useState } from "react"

export default function ClientesPage() {
  const [clients, setClients] = useState([
    {
      id: "1",
      name: "María",
      surname: "García López",
      cifNif: "12345678A",
      email: "maria.garcia@email.com",
      phone: "+34 666 123 456",
      address: "Calle Falsa 123",
      cp: "28001",
      city: "Madrid",
      parkingSpot: "A-15",
      subscriptionType: "Mensual",
      status: "Activo",
      startDate: "01/01/2024",
      monthlyFee: "€85.00",
      lastPayment: "15/01/2024",
    },
    {
      id: "2",
      name: "Carlos",
      surname: "Rodríguez Pérez",
      cifNif: "87654321B",
      email: "carlos.rodriguez@email.com",
      phone: "+34 666 789 012",
      address: "Avenida Siempre Viva 45",
      cp: "08001",
      city: "Barcelona",
      parkingSpot: "B-08",
      subscriptionType: "Mensual",
      status: "Activo",
      startDate: "15/12/2023",
      monthlyFee: "€85.00",
      lastPayment: "15/01/2024",
    },
    {
      id: "3",
      name: "Ana",
      surname: "Martín Sánchez",
      cifNif: "11223344C",
      email: "ana.martin@email.com",
      phone: "+34 666 345 678",
      address: "Plaza Mayor 1",
      cp: "41001",
      city: "Sevilla",
      parkingSpot: "C-22",
      subscriptionType: "Anual",
      status: "Activo",
      startDate: "01/01/2024",
      monthlyFee: "€120.00",
      lastPayment: "01/01/2024",
    },
    {
      id: "4",
      name: "José Luis",
      surname: "Fernández",
      cifNif: "55667788D",
      email: "joseluis.fernandez@email.com",
      phone: "+34 666 901 234",
      address: "Calle del Sol 7",
      cp: "46001",
      city: "Valencia",
      parkingSpot: "A-03",
      subscriptionType: "Mensual",
      status: "Moroso",
      startDate: "01/11/2023",
      monthlyFee: "€85.00",
      lastPayment: "15/12/2023",
    },
    {
      id: "5",
      name: "Laura",
      surname: "Jiménez Torres",
      cifNif: "99001122E",
      email: "laura.jimenez@email.com",
      phone: "+34 666 567 890",
      address: "Ronda de Dalt 50",
      cp: "08035",
      city: "Barcelona",
      parkingSpot: "D-11",
      subscriptionType: "Mensual",
      status: "Activo",
      startDate: "01/02/2024",
      monthlyFee: "€95.00",
      lastPayment: "15/01/2024",
    },
  ])

  const handleExport = () => {
    exportToCsv("clientes.csv", clients)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const headers = Object.keys(clients[0] || {}) // Usar los encabezados de los datos existentes
      importFromCsv(
        file,
        (data) => {
          // En una aplicación real, aquí validarías y fusionarías los datos
          setClients((prevClients) => [...prevClients, ...(data as typeof clients)]) // Añadir, no reemplazar
          alert(`Se han importado ${data.length} clientes (simulado).`)
        },
        headers,
      )
    }
  }

  const handleDelete = (id: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar al cliente ${id}?`)) {
      console.log(`Eliminando cliente ${id}`)
      setClients(clients.filter((client) => client.id !== id))
      // Lógica para eliminar el cliente de la BBDD
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
                <Link href="/clientes/nuevo">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Cliente
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
          <Link href="/clientes" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-2">
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
                <Input placeholder="Buscar cliente por nombre o NIF/CIF..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="moroso">Moroso</SelectItem>
                  <SelectItem value="suspendido">Suspendido</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Abono" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">Aplicar Filtros</Button>
            </div>
          </CardContent>
        </Card>

        {/* Clients Grid */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Listado de Clientes</CardTitle>
                <CardDescription>Gestiona los clientes abonados en el sistema</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar a Excel
                </Button>
                <Input id="import-clients" type="file" accept=".csv" className="hidden" onChange={handleImport} />
                <Label
                  htmlFor="import-clients"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importar desde Excel
                </Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((client) => (
                <Card key={client.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {client.name} {client.surname}
                        </CardTitle>
                        <CardDescription>{client.cifNif}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          client.status === "Activo"
                            ? "default"
                            : client.status === "Moroso"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {client.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {client.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {client.phone}
                      </div>
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 mt-1" />
                        <div>
                          {client.address}, {client.cp} {client.city}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Plaza Asignada</p>
                        <p className="font-medium">{client.parkingSpot}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tipo de Abono</p>
                        <p className="font-medium">{client.subscriptionType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Cuota Mensual</p>
                        <p className="font-medium">{client.monthlyFee}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Inicio Abono</p>
                        <p className="font-medium">{client.startDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/clientes/editar/${client.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleDelete(client.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
