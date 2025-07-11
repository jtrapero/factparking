import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Users, Plus, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const stats = [
    {
      title: "Clientes Activos",
      value: "248",
      description: "+12% desde el mes pasado",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Facturas Pendientes",
      value: "23",
      description: "€2,340 por cobrar",
      icon: FileText,
      color: "text-orange-600",
    },
    {
      title: "Ingresos del Mes",
      value: "€18,450",
      description: "+8% vs mes anterior",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Plazas Ocupadas",
      value: "186/200",
      description: "93% ocupación",
      icon: Car,
      color: "text-purple-600",
    },
  ]

  const recentInvoices = [
    {
      id: "FAC-2024-001",
      subscriber: "María García López",
      amount: "€85.00",
      status: "Pagada",
      date: "15/01/2024",
      period: "Enero 2024",
    },
    {
      id: "FAC-2024-002",
      subscriber: "Carlos Rodríguez Pérez",
      amount: "€85.00",
      status: "Pendiente",
      date: "15/01/2024",
      period: "Enero 2024",
    },
    {
      id: "FAC-2024-003",
      subscriber: "Ana Martín Sánchez",
      amount: "€120.00",
      status: "Pagada",
      date: "15/01/2024",
      period: "Enero 2024",
    },
    {
      id: "FAC-2024-004",
      subscriber: "José Luis Fernández",
      amount: "€85.00",
      status: "Vencida",
      date: "15/01/2024",
      period: "Enero 2024",
    },
  ]

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
          <Link href="/" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-2">
            Dashboard
          </Link>
          <Link href="/facturas" className="text-gray-500 hover:text-gray-700 pb-2">
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Facturas Recientes</CardTitle>
                <CardDescription>Últimas facturas generadas en el sistema</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/facturas">Ver Todas</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.subscriber}</p>
                      <p className="text-sm text-gray-500">
                        {invoice.id} • {invoice.period}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{invoice.amount}</p>
                      <p className="text-sm text-gray-500">{invoice.date}</p>
                    </div>
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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
