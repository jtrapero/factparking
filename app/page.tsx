"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientsManager } from "@/components/clients-manager"
import { VehiclesManager } from "@/components/vehicles-manager"
import { InvoicesManager } from "@/components/invoices-manager"
import { CompanySettings } from "@/components/company-settings"
import { Building2, Users, Car, FileText, Settings } from "lucide-react"
import { ReportsPanel } from "@/components/reports-panel"

export default function ParkingInvoiceSystem() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Facturación - Parking</h1>
          <p className="text-gray-600 mt-2">Gestión completa de clientes, vehículos y facturación mensual</p>
        </div>

        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Vehículos
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Facturas
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Reportes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <ClientsManager />
          </TabsContent>

          <TabsContent value="vehicles">
            <VehiclesManager />
          </TabsContent>

          <TabsContent value="invoices">
            <InvoicesManager />
          </TabsContent>

          <TabsContent value="company">
            <CompanySettings />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
