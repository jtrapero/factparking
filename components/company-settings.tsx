"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Building2, Save } from "lucide-react"

interface CompanyInfo {
  nombre: string
  direccion: string
  cp: string
  ciudad: string
  cif: string
  telefono: string
  email: string
  cuentaBancaria: string
  entidadBancaria: string
  ccc: string
}

export function CompanySettings() {
  const [companyInfo, setCompanyInfo] = useLocalStorage<CompanyInfo>("parking-company", {
    nombre: "ALMACENAMIENTOS Y ESPACIOS MULTIFUNCION S.L",
    direccion: "AV CARABANCHEL ALTO, 7 BAJO",
    cp: "28044",
    ciudad: "MADRID",
    cif: "B-88551544",
    telefono: "",
    email: "",
    cuentaBancaria: "ES51 2100 1549 6102 0029 2896",
    entidadBancaria: "LA CAIXA",
    ccc: "",
  })

  const [formData, setFormData] = useState(companyInfo)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCompanyInfo(formData)
    alert("Información de la empresa actualizada correctamente")
  }

  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Configuración de la Empresa
        </CardTitle>
        <CardDescription>Configure los datos de su empresa que aparecerán en las facturas</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nombre">Nombre de la Empresa</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="cp">Código Postal</Label>
              <Input id="cp" value={formData.cp} onChange={(e) => handleInputChange("cp", e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                value={formData.ciudad}
                onChange={(e) => handleInputChange("ciudad", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="cif">CIF</Label>
              <Input
                id="cif"
                value={formData.cif}
                onChange={(e) => handleInputChange("cif", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Bancaria</h3>

            <div>
              <Label htmlFor="entidadBancaria">Entidad Bancaria</Label>
              <Input
                id="entidadBancaria"
                value={formData.entidadBancaria}
                onChange={(e) => handleInputChange("entidadBancaria", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="cuentaBancaria">Cuenta Bancaria (IBAN)</Label>
              <Input
                id="cuentaBancaria"
                value={formData.cuentaBancaria}
                onChange={(e) => handleInputChange("cuentaBancaria", e.target.value)}
                placeholder="ES00 0000 0000 0000 0000 0000"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Guardar Configuración
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
