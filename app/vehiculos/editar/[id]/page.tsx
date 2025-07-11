"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Car, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Datos de clientes simulados para el selector
const clients = [
  { id: "1", name: "María García López", cifNif: "12345678A" },
  { id: "2", name: "Carlos Rodríguez Pérez", cifNif: "87654321B" },
  { id: "3", name: "Ana Martín Sánchez", cifNif: "11223344C" },
  { id: "4", name: "José Luis Fernández", cifNif: "55667788D" },
  { id: "5", name: "Laura Jiménez Torres", cifNif: "99001122E" },
]

// Datos de vehículos simulados para edición
const mockVehicles = [
  {
    id: "v1",
    cifNif: "12345678A",
    licensePlate: "1234 ABC",
    vehicleType: "Coche",
    active: true,
    price: "85.00",
  },
  {
    id: "v2",
    cifNif: "87654321B",
    licensePlate: "5678 DEF",
    vehicleType: "Moto",
    active: true,
    price: "40.00",
  },
  {
    id: "v3",
    cifNif: "11223344C",
    licensePlate: "9012 GHI",
    vehicleType: "Coche",
    active: false,
    price: "120.00",
  },
]

export default function EditarVehiculoPage() {
  const params = useParams()
  const vehicleId = params.id as string

  const [formData, setFormData] = useState({
    cifNif: "",
    licensePlate: "",
    vehicleType: "",
    active: true,
    price: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos del vehículo
    const vehicleToEdit = mockVehicles.find((vehicle) => vehicle.id === vehicleId)
    if (vehicleToEdit) {
      setFormData(vehicleToEdit)
    } else {
      console.error("Vehículo no encontrado:", vehicleId)
      // Redirigir o mostrar error
    }
    setLoading(false)
  }, [vehicleId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {}

    if (!formData.cifNif) newErrors.cifNif = "Debe seleccionar un cliente."
    if (!formData.licensePlate) newErrors.licensePlate = "La matrícula es obligatoria."
    if (!formData.vehicleType) newErrors.vehicleType = "El tipo de vehículo es obligatorio."
    if (!formData.price) newErrors.price = "El precio es obligatorio."

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      console.log("Datos del vehículo actualizados:", formData)
      // Aquí iría la lógica para actualizar el vehículo en la BBDD
      alert("Vehículo actualizado con éxito (simulado)!")
    } else {
      console.error("Errores de validación:", newErrors)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Cargando vehículo...</p>
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
              <Link href="/vehiculos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Vehículos
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Editar Vehículo: {vehicleId}</h2>
          <p className="text-gray-600 mt-2">Modifica la información del vehículo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos del Vehículo</CardTitle>
              <CardDescription>Información detallada del vehículo y su propietario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cifNif">Cliente (NIF/CIF)</Label>
                <Select value={formData.cifNif} onValueChange={(value) => setFormData({ ...formData, cifNif: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente por NIF/CIF" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.cifNif}>
                        {client.name} ({client.cifNif})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cifNif && <p className="text-red-500 text-sm">{errors.cifNif}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="licensePlate">Matrícula</Label>
                <Input
                  id="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                  placeholder="Ej: 1234 ABC"
                />
                {errors.licensePlate && <p className="text-red-500 text-sm">{errors.licensePlate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleType">Tipo de Vehículo</Label>
                <Input
                  id="vehicleType"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  placeholder="Ej: Coche, Moto, Furgoneta"
                />
                {errors.vehicleType && <p className="text-red-500 text-sm">{errors.vehicleType}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio de Abono (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Ej: 85.00"
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">Vehículo Activo</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
