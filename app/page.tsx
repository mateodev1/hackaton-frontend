"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Ship, Clock, TrendingUp, AlertTriangle } from "lucide-react"
import dynamic from "next/dynamic"

const MapComponent = dynamic(() => import("../components/vessel-map"), { ssr: false })

// Stats data
const statsData = [
  { title: "Active Shipments", value: "10", icon: Ship, color: "text-blue-600" },
  { title: "Delayed Shipments", value: "3", icon: Clock, color: "text-red-600" },
  { title: "On-time Delivery Rate", value: "70%", icon: TrendingUp, color: "text-green-600" },
  { title: "Ports With Congestion", value: "2", icon: AlertTriangle, color: "text-orange-600" },
]

// Shipments data
const shipmentsData = [
  {
    client: "Acme Corp",
    orderId: "ORD-9832",
    vessel: "MSC Tokyo",
    eta: "2025-07-17",
    status: "In Transit",
    transitTime: "14 days",
    lastPosition: "Lat: -34.6, Lon: -58.4",
  },
  {
    client: "Global Freight",
    orderId: "ORD-9320",
    vessel: "Ever Green",
    eta: "2025-07-13",
    status: "Delayed",
    transitTime: "18 days",
    lastPosition: "Lat: -33.8, Lon: -70.6",
  },
  {
    client: "Ocean Traders",
    orderId: "ORD-7834",
    vessel: "HMM Algeciras",
    eta: "2025-07-19",
    status: "In Transit",
    transitTime: "10 days",
    lastPosition: "Lat: -22.9, Lon: -43.2",
  },
  {
    client: "Delta Import",
    orderId: "ORD-6112",
    vessel: "Maersk Line",
    eta: "2025-07-15",
    status: "In Port",
    transitTime: "12 days",
    lastPosition: "Lat: -12.0, Lon: -77.0",
  },
  {
    client: "FastLog",
    orderId: "ORD-5009",
    vessel: "COSCO Beijing",
    eta: "2025-07-18",
    status: "Delayed",
    transitTime: "15 days",
    lastPosition: "Lat: -1.3, Lon: 36.8",
  },
  {
    client: "Continental Cargo",
    orderId: "ORD-4021",
    vessel: "ONE Apus",
    eta: "2025-07-20",
    status: "In Transit",
    transitTime: "11 days",
    lastPosition: "Lat: 25.2, Lon: 55.3",
  },
  {
    client: "LogiTrade",
    orderId: "ORD-3107",
    vessel: "NYK Venus",
    eta: "2025-07-16",
    status: "In Port",
    transitTime: "13 days",
    lastPosition: "Lat: 1.3, Lon: 103.8",
  },
  {
    client: "Importex",
    orderId: "ORD-2990",
    vessel: "APL Savannah",
    eta: "2025-07-14",
    status: "Delayed",
    transitTime: "16 days",
    lastPosition: "Lat: 35.6, Lon: 139.7",
  },
  {
    client: "SeaLine",
    orderId: "ORD-2883",
    vessel: "ZIM Rotterdam",
    eta: "2025-07-13",
    status: "In Transit",
    transitTime: "17 days",
    lastPosition: "Lat: 19.4, Lon: -99.1",
  },
  {
    client: "Blue Cargo",
    orderId: "ORD-2705",
    vessel: "MSC Gaia",
    eta: "2025-07-21",
    status: "In Transit",
    transitTime: "9 days",
    lastPosition: "Lat: 50.1, Lon: 8.6",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Transit":
      return "bg-blue-100 text-blue-800"
    case "In Port":
      return "bg-green-100 text-green-800"
    case "Delayed":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function MaritimeDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Ship className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Maritime KPI Dashboard</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Map */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ship className="h-5 w-5 mr-2" />
                Vessel Tracking Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <MapComponent shipments={shipmentsData} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Current Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Vessel Name</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Transit Time</TableHead>
                    <TableHead>Last Position</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipmentsData.map((shipment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{shipment.client}</TableCell>
                      <TableCell>{shipment.orderId}</TableCell>
                      <TableCell>{shipment.vessel}</TableCell>
                      <TableCell>{shipment.eta}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                      </TableCell>
                      <TableCell>{shipment.transitTime}</TableCell>
                      <TableCell className="font-mono text-sm">{shipment.lastPosition}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
