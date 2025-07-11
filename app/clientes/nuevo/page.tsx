"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface PlacePrediction {
  description: string
  place_id: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export default function NuevoClientePage() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    cifNif: "",
    address: "",
    cp: "",
    city: "",
    phone: "",
    email: "",
    parkingSpot: "",
    subscriptionType: "",
    monthlyFee: "",
    startDate: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [addressSuggestions, setAddressSuggestions] = useState<PlacePrediction[]>([])
  const [cifNifValidationLoading, setCifNifValidationLoading] = useState(false)

  const validateCifNif = async (cifNif: string): Promise<string> => {
    if (!cifNif) return "El NIF/CIF es obligatorio."

    setCifNifValidationLoading(true)
    try {
      const response = await fetch("/api/validate-nif-cif", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cifNif }),
      })
      const data = await response.json()
      if (!response.ok) {
        return data.error || "Error de validación de NIF/CIF."
      }
      return "" // Válido
    } catch (error) {
      console.error("Error al validar NIF/CIF:", error)
      return "Error al conectar con el servicio de validación."
    } finally {
      setCifNifValidationLoading(false)
    }
  }

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAddress = e.target.value
    setFormData({ ...formData, address: inputAddress, cp: "", city: "" })
    if (inputAddress.length > 2) {
      try {
        const response = await fetch(`/api/google-places?input=${encodeURIComponent(inputAddress)}`)
        const data = await response.json()
        if (response.ok && data.predictions) {
          setAddressSuggestions(data.predictions)
        } else {
          setAddressSuggestions([])
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error)
        setAddressSuggestions([])
      }
    } else {
      setAddressSuggestions([])
    }
  }

  const selectAddressSuggestion = async (suggestion: PlacePrediction) => {
    setFormData((prev) => ({ ...prev, address: suggestion.description }))
    setAddressSuggestions([]) // Ocultar sugerencias

    try {
      const response = await fetch(`/api/google-places?place_id=${suggestion.place_id}`)
      const data = await response.json()
      if (response.ok && data.result && data.result.address_components) {
        const cpComponent = data.result.address_components.find((comp: any) => comp.types.includes("postal_code"))
        const cityComponent = data.result.address_components.find((comp: any) => comp.types.includes("locality"))

        setFormData((prev) => ({
          ...prev,
          cp: cpComponent ? cpComponent.long_name : "",
          city: cityComponent ? cityComponent.long_name : "",
        }))
      }
    } catch (error) {
      console.error("Error fetching place details:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {}

    const cifNifError = await validateCifNif(formData.cifNif)
    if (cifNifError) newErrors.cifNif = cifNifError

    if (!formData.name) newErrors.name = "El nombre es obligatorio."
    if (!formData.surname) newErrors.surname = "El apellido es obligatorio."
    if (!formData.address) newErrors.address = "La dirección es obligatoria."
    if (!formData.phone) newErrors.phone = "El teléfono es obligatorio."
    if (!formData.email) newErrors.email = "El email es obligatorio."
    if (!formData.parkingSpot) newErrors.parkingSpot = "La plaza de parking es obligatoria."
    if (!formData.subscriptionType) newErrors.subscriptionType = "El tipo de abono es obligatorio."
    if (!formData.monthlyFee) newErrors.monthlyFee = "La cuota mensual es obligatoria."
    if (!formData.startDate) newErrors.startDate = "La fecha de inicio es obligatoria."

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      console.log("Datos del nuevo cliente:", formData)
      // Aquí iría la lógica para guardar el cliente en la BBDD
      alert("Cliente guardado con éxito (simulado)!")
      // Redirigir o limpiar formulario
    } else {
      console.error("Errores de validación:", newErrors)
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
            <Button variant="outline" asChild>
              <Link href="/clientes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Clientes
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Nuevo Cliente</h2>
          <p className="text-gray-600 mt-2">Registra un nuevo cliente abonado en el sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos Personales y de Contacto</CardTitle>
              <CardDescription>Información básica del cliente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nombre del cliente"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Apellido</Label>
                  <Input
                    id="surname"
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    placeholder="Apellido del cliente"
                  />
                  {errors.surname && <p className="text-red-500 text-sm">{errors.surname}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cifNif">CIF/NIF</Label>
                <Input
                  id="cifNif"
                  value={formData.cifNif}
                  onChange={(e) => setFormData({ ...formData, cifNif: e.target.value.toUpperCase() })}
                  placeholder="Ej: 12345678A o B12345678"
                />
                {cifNifValidationLoading && <p className="text-gray-500 text-sm">Validando...</p>}
                {errors.cifNif && <p className="text-red-500 text-sm">{errors.cifNif}</p>}
                <p className="text-xs text-gray-500">
                  {"Se valida el formato y la letra de control (simulado para NIF/NIE)."}
                </p>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={handleAddressChange}
                  placeholder="Calle, número, piso..."
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                {addressSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {addressSuggestions.map((sug) => (
                      <li
                        key={sug.place_id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectAddressSuggestion(sug)}
                      >
                        {sug.description}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-gray-500">
                  {"Escribe una dirección para ver sugerencias (integración simulada con Google Places API)."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cp">Código Postal</Label>
                  <Input id="cp" value={formData.cp} readOnly placeholder="CP" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" value={formData.city} readOnly placeholder="Ciudad" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ej: +34 6XX XXX XXX"
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@ejemplo.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Datos del Abono</CardTitle>
              <CardDescription>Información sobre la suscripción de parking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parkingSpot">Plaza de Parking Asignada</Label>
                  <Input
                    id="parkingSpot"
                    value={formData.parkingSpot}
                    onChange={(e) => setFormData({ ...formData, parkingSpot: e.target.value })}
                    placeholder="Ej: A-01, B-15"
                  />
                  {errors.parkingSpot && <p className="text-red-500 text-sm">{errors.parkingSpot}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subscriptionType">Tipo de Abono</Label>
                  <Select
                    value={formData.subscriptionType}
                    onValueChange={(value) => setFormData({ ...formData, subscriptionType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.subscriptionType && <p className="text-red-500 text-sm">{errors.subscriptionType}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyFee">Cuota Mensual (€)</Label>
                  <Input
                    id="monthlyFee"
                    type="number"
                    step="0.01"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                    placeholder="Ej: 85.00"
                  />
                  {errors.monthlyFee && <p className="text-red-500 text-sm">{errors.monthlyFee}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio del Abono</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                  {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Guardar Cliente
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
