"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, DollarSign, Users, FileText, AlertTriangle, Calendar, PieChart } from "lucide-react"

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
}

export function ReportsPanel() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const storedInvoices = localStorage.getItem("parking-invoices")
      const storedClients = localStorage.getItem("parking-clients")
      const storedVehicles = localStorage.getItem("parking-vehicles")

      if (storedInvoices) setInvoices(JSON.parse(storedInvoices))
      if (storedClients) setClients(JSON.parse(storedClients))
      if (storedVehicles) setVehicles(JSON.parse(storedVehicles))
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Cargando estadísticas...</p>
      </div>
    )
  }

  // Cálculos de estadísticas
  const totalFacturado = invoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const facturasPagadas = invoices.filter((inv) => inv.estado === "pagada")
  const facturasPendientes = invoices.filter((inv) => inv.estado === "pendiente")
  const facturasVencidas = invoices.filter((inv) => inv.estado === "vencida")

  const ingresosPagados = facturasPagadas.reduce((sum, invoice) => sum + invoice.total, 0)
  const ingresosPendientes = facturasPendientes.reduce((sum, invoice) => sum + invoice.total, 0)
  const ingresosVencidos = facturasVencidas.reduce((sum, invoice) => sum + invoice.total, 0)

  // Estadísticas por mes
  const facturasPorMes = invoices.reduce(
    (acc, invoice) => {
      const key = `${invoice.año}-${invoice.mes.padStart(2, "0")}`
      if (!acc[key]) {
        acc[key] = { total: 0, count: 0, pagadas: 0, pendientes: 0, vencidas: 0 }
      }
      acc[key].total += invoice.total
      acc[key].count += 1
      acc[key][invoice.estado] += 1
      return acc
    },
    {} as Record<string, any>,
  )

  const mesesOrdenados = Object.keys(facturasPorMes).sort().slice(-6) // Últimos 6 meses

  // Top clientes por ingresos
  const clientesPorIngresos = invoices.reduce(
    (acc, invoice) => {
      if (!acc[invoice.clienteCifNif]) {
        acc[invoice.clienteCifNif] = { total: 0, facturas: 0 }
      }
      acc[invoice.clienteCifNif].total += invoice.total
      acc[invoice.clienteCifNif].facturas += 1
      return acc
    },
    {} as Record<string, any>,
  )

  const topClientes = Object.entries(clientesPorIngresos)
    .map(([cifNif, data]) => {
      const client = clients.find((c) => c.cifNif === cifNif)
      return {
        cifNif,
        nombre: client ? `${client.nombre} ${client.apellidos}` : cifNif,
        ...data,
      }
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  const getClientName = (cifNif: string) => {
    const client = clients.find((c) => c.cifNif === cifNif)
    return client ? `${client.nombre} ${client.apellidos}` : cifNif
  }

  const months = [
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

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split("-")
    return `${months[Number.parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFacturado.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground">{invoices.length} facturas emitidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Cobrados</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{ingresosPagados.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground">{facturasPagadas.length} facturas pagadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes de Cobro</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{ingresosPendientes.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground">{facturasPendientes.length} facturas pendientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{ingresosVencidos.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground">{facturasVencidas.length} facturas vencidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de barras de facturación mensual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Facturación Mensual
          </CardTitle>
          <CardDescription>Evolución de ingresos en los últimos meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mesesOrdenados.map((monthKey) => {
              const data = facturasPorMes[monthKey]
              const maxValue = Math.max(...mesesOrdenados.map((k) => facturasPorMes[k].total))
              const percentage = maxValue > 0 ? (data.total / maxValue) * 100 : 0

              return (
                <div key={monthKey} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{getMonthName(monthKey)}</span>
                    <span className="text-sm font-bold">{data.total.toFixed(2)} €</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>📊 {data.count} facturas</span>
                    <span className="text-green-600">✅ {data.pagadas} pagadas</span>
                    <span className="text-yellow-600">⏳ {data.pendientes} pendientes</span>
                    {data.vencidas > 0 && <span className="text-red-600">❌ {data.vencidas} vencidas</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top clientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Clientes por Ingresos
            </CardTitle>
            <CardDescription>Clientes que más facturación generan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClientes.slice(0, 8).map((cliente, index) => (
                <div key={cliente.cifNif} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{cliente.nombre}</p>
                      <p className="text-xs text-muted-foreground">{cliente.facturas} facturas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{cliente.total.toFixed(2)} €</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumen por estados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Estado de Facturas
            </CardTitle>
            <CardDescription>Distribución por estado de pago</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Facturas Pagadas</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{facturasPagadas.length}</p>
                    <p className="text-sm text-green-600">{ingresosPagados.toFixed(2)} €</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Facturas Pendientes</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-600">{facturasPendientes.length}</p>
                    <p className="text-sm text-yellow-600">{ingresosPendientes.toFixed(2)} €</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium">Facturas Vencidas</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{facturasVencidas.length}</p>
                    <p className="text-sm text-red-600">{ingresosVencidos.toFixed(2)} €</p>
                  </div>
                </div>
              </div>

              {/* Porcentajes */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Tasa de Cobro</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cobrado</span>
                    <span className="font-medium">
                      {totalFacturado > 0 ? ((ingresosPagados / totalFacturado) * 100).toFixed(1) : "0.0"}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pendiente</span>
                    <span className="font-medium">
                      {totalFacturado > 0 ? ((ingresosPendientes / totalFacturado) * 100).toFixed(1) : "0.0"}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Vencido</span>
                    <span className="font-medium">
                      {totalFacturado > 0 ? ((ingresosVencidos / totalFacturado) * 100).toFixed(1) : "0.0"}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de facturas vencidas */}
      {facturasVencidas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Facturas Vencidas - Acción Requerida
            </CardTitle>
            <CardDescription>Facturas que requieren seguimiento inmediato</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Factura</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Importe</TableHead>
                  <TableHead>Días Vencida</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facturasVencidas.map((invoice) => {
                  const fechaFactura = new Date(invoice.fechaFactura)
                  const hoy = new Date()
                  const diasVencida = Math.floor((hoy.getTime() - fechaFactura.getTime()) / (1000 * 60 * 60 * 24))

                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono">{invoice.numeroFactura}</TableCell>
                      <TableCell>{getClientName(invoice.clienteCifNif)}</TableCell>
                      <TableCell>{fechaFactura.toLocaleDateString("es-ES")}</TableCell>
                      <TableCell className="font-bold text-red-600">{invoice.total.toFixed(2)} €</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{diasVencida} días</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Promedio por Factura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices.length > 0 ? (totalFacturado / invoices.length).toFixed(2) : "0.00"} €
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Clientes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">{vehicles.length} vehículos registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Facturación Promedio Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mesesOrdenados.length > 0
                ? (
                    mesesOrdenados.reduce((sum, key) => sum + facturasPorMes[key].total, 0) / mesesOrdenados.length
                  ).toFixed(2)
                : "0.00"}{" "}
              €
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
