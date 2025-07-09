"use client"

import type React from "react"
import ExcelTools from "@/components/ExcelTools";

export default function ClientsManager() {
  return (
    <div>
	<ExcelTools storageKey="vehiculos" fileName="vehiculos" />

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
import { Plus, Edit, Trash2, Search, Loader2, CheckCircle, AlertCircle, Globe, ExternalLink } from "lucide-react"
import { lookupVehicleInfo, generateVehicleModel, validateSpanishLicensePlate } from "@/lib/vehicle-lookup"
import { Badge } from "@/components/ui/badge"
import ExcelTools from "@/components/ExcelTools"

interface Vehicle {
  id: string
  matricula: string
  cifNif: string
  coche: string
  pvp: number
  activo: boolean
  sociedadId: string
}

interface Client {
  id: string
  nombre: string
  apellidos: string
  cifNif: string
}

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "1",
    matricula: "1234ABC",
    cifNif: "50312463D",
    coche: "Toyota Corolla (2020) - Gasolina",
    pvp: 99.17,
    activo: true,
    sociedadId: "PARKING001",
  },
  {
    id: "2",
    matricula: "5678DEF",
    cifNif: "B44807287",
    coche: "Ford Focus (2019) - Diésel",
    pvp: 82.64,
    activo: true,
    sociedadId: "PARKING001",
  },
  {
    id: "3",
    matricula: "9012GHI",
    cifNif: "B87550075",
    coche: "Volkswagen Golf (2021) - Gasolina",
    pvp: 123.97,
    activo: false,
    sociedadId: "PARKING001",
  },
]

export function VehiclesManager() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [lookupStatus, setLookupStatus] = useState<{
    type: "success" | "error" | "not_found" | null
    message: string
    note?: string
  }>({ type: null, message: "" })

  // Initialize form data with proper default values
  const getInitialFormData = () => ({
    matricula: "",
    cifNif: "",
    coche: "",
    pvp: 0,
    activo: true,
    sociedadId: "PARKING001",
  })

  const [formData, setFormData] = useState(getInitialFormData())

  useEffect(() => {
    try {
      // Cargar vehículos
      const storedVehicles = localStorage.getItem("parking-vehicles")
      if (storedVehicles) {
        setVehicles(JSON.parse(storedVehicles))
      } else {
        setVehicles(INITIAL_VEHICLES)
        localStorage.setItem("parking-vehicles", JSON.stringify(INITIAL_VEHICLES))
      }

      // Cargar clientes
      const storedClients = localStorage.getItem("parking-clients")
      if (storedClients) {
        setClients(JSON.parse(storedClients))
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setVehicles(INITIAL_VEHICLES)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const saveVehicles = (newVehicles: Vehicle[]) => {
    setVehicles(newVehicles)
    localStorage.setItem("parking-vehicles", JSON.stringify(newVehicles))
  }

  const handleMatriculaChange = async (matricula: string) => {
    const upperMatricula = matricula.toUpperCase()
    setFormData({ ...formData, matricula: upperMatricula })
    setLookupStatus({ type: null, message: "" })

    // Solo buscar si la matrícula tiene el formato correcto (4 números + 3 letras)
    if (upperMatricula.length === 7 && validateSpanishLicensePlate(upperMatricula)) {
      setIsLookingUp(true)

      try {
        const result = await lookupVehicleInfo(upperMatricula)

        if (result.success && result.data) {
          const vehicleModel = generateVehicleModel(
            result.data.marca,
            result.data.modelo,
            result.data.año,
            result.data.combustible,
            result.data.cv,
          )
          setFormData((prev) => ({ ...prev, coche: vehicleModel }))

          setLookupStatus({
            type: "success",
            message: "Información encontrada en historialvehiculo.com",
            note: (result as any).note,
          })
        } else {
          setLookupStatus({
            type: "not_found",
            message: result.error || "No se encontró información para esta matrícula",
          })
        }
      } catch (error) {
        setLookupStatus({
          type: "error",
          message: "Error al conectar con el servicio de consulta",
        })
      } finally {
        setIsLookingUp(false)
      }
    }
  }

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.coche.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.cifNif.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getClientName = (cifNif: string) => {
    const client = clients.find((c) => c.cifNif === cifNif)
    return client ? `${client.nombre} ${client.apellidos}` : cifNif
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingVehicle) {
      const updatedVehicles = vehicles.map((vehicle) =>
        vehicle.id === editingVehicle.id ? { ...formData, id: editingVehicle.id } : vehicle,
      )
      saveVehicles(updatedVehicles)
    } else {
      const newVehicle: Vehicle = {
        ...formData,
        id: Date.now().toString(),
      }
      saveVehicles([...vehicles, newVehicle])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData(getInitialFormData())
    setEditingVehicle(null)
    setIsDialogOpen(false)
    setLookupStatus({ type: null, message: "" })
    setIsLookingUp(false)
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      matricula: vehicle.matricula || "",
      cifNif: vehicle.cifNif || "",
      coche: vehicle.coche || "",
      pvp: vehicle.pvp || 0,
      activo: vehicle.activo ?? true,
      sociedadId: vehicle.sociedadId || "PARKING001",
    })
    setIsDialogOpen(true)
    setLookupStatus({ type: null, message: "" })
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar este vehículo?")) {
      const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== id)
      saveVehicles(updatedVehicles)
    }
  }

  const getLookupIcon = () => {
    if (isLookingUp) return <Loader2 className="h-4 w-4 animate-spin" />
    if (lookupStatus.type === "success") return <CheckCircle className="h-4 w-4 text-green-600" />
    if (lookupStatus.type === "error") return <AlertCircle className="h-4 w-4 text-red-600" />
    if (lookupStatus.type === "not_found") return <AlertCircle className="h-4 w-4 text-yellow-600" />
    return null
  }

  const getLookupStatusColor = () => {
    switch (lookupStatus.type) {
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      case "not_found":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Vehículos</CardTitle>
        <CardDescription>
          Administre los vehículos y sus tarifas de parking ({vehicles.length} vehículos registrados)
          <br />
          <span className="text-sm text-blue-600 flex items-center gap-1 mt-1">
            <Globe className="h-3 w-3" />
            Información obtenida de{" "}
            <a
              href="https://www.historialvehiculo.com/informes-gratis-vehiculos"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-800 flex items-center gap-1"
            >
              historialvehiculo.com
              <ExternalLink className="h-3 w-3" />
            </a>
          </span>
          <br />
          <span className="text-sm text-gray-600 mt-1">
            💡 Los vehículos activos aparecerán automáticamente al crear facturas
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar vehículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingVehicle(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Vehículo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingVehicle ? "Editar Vehículo" : "Nuevo Vehículo"}</DialogTitle>
                <DialogDescription>
                  Introduzca la matrícula (formato 1234ABC) para obtener automáticamente la información del vehículo.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="matricula">Matrícula</Label>
                  <div className="relative">
                    <Input
                      id="matricula"
                      value={formData.matricula}
                      onChange={(e) => handleMatriculaChange(e.target.value)}
                      placeholder="1234ABC"
                      className="pr-10"
                      maxLength={7}
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">{getLookupIcon()}</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Formato: 4 números + 3 letras (ej: 1234ABC)</p>
                  {lookupStatus.message && (
                    <div className={`flex items-center gap-2 mt-2 text-sm ${getLookupStatusColor()}`}>
                      <Globe className="h-3 w-3" />
                      {lookupStatus.message}
                      {lookupStatus.note && <span className="text-xs text-gray-500">({lookupStatus.note})</span>}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="cifNif">Cliente (CIF/NIF)</Label>
                  <Select
                    value={formData.cifNif}
                    onValueChange={(value) => setFormData({ ...formData, cifNif: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.cifNif}>
                          {client.nombre} {client.apellidos} - {client.cifNif}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="coche">Modelo del Coche</Label>
                  <Input
                    id="coche"
                    value={formData.coche}
                    onChange={(e) => setFormData({ ...formData, coche: e.target.value })}
                    placeholder="Se completará automáticamente..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Se obtiene automáticamente de historialvehiculo.com</p>
                </div>

                <div>
                  <Label htmlFor="pvp">Precio Mensual (€)</Label>
                  <Input
                    id="pvp"
                    type="number"
                    step="0.01"
                    value={formData.pvp.toString()}
                    onChange={(e) => setFormData({ ...formData, pvp: Number.parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="activo">Vehículo activo (se facturará mensualmente)</Label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLookingUp}>
                    {isLookingUp ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Consultando...
                      </>
                    ) : editingVehicle ? (
                      "Actualizar"
                    ) : (
                      "Crear"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-end">
          <ExcelTools storageKey="parking-vehicles" fileName="vehiculos" />
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
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Precio Mensual</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium font-mono">{vehicle.matricula}</TableCell>
                    <TableCell>{getClientName(vehicle.cifNif)}</TableCell>
                    <TableCell>{vehicle.coche}</TableCell>
                    <TableCell>{vehicle.pvp.toFixed(2)} €</TableCell>
                    <TableCell>
                      <Badge variant={vehicle.activo ? "default" : "secondary"}>
                        {vehicle.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(vehicle)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(vehicle.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredVehicles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No se encontraron vehículos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
