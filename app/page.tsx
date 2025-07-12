"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Ship, Clock, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, MapPin, FileText } from "lucide-react"
import dynamic from "next/dynamic"
import PDFUploadDrawer from "../components/pdf-upload-drawer"

const IndividualVesselMap = dynamic(() => import("../components/individual-vessel-map"), { ssr: false })

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
    containerId: "TCLU-9832145",
    vessel: "MSC Tokyo",
    eta: "2025-07-17",
    status: "In Transit",
    transitTime: "14 days",
    lastPosition: "Lat: -34.6, Lon: -58.4",
    originPort: "Shanghai",
    destinationPort: "Buenos Aires",
    originCoords: [31.2, 121.5] as [number, number],
    destinationCoords: [-34.6, -58.4] as [number, number],
  },
  {
    client: "Global Freight",
    containerId: "MSCU-4567890",
    vessel: "Ever Green",
    eta: "2025-07-13",
    status: "Delayed",
    transitTime: "18 days",
    lastPosition: "Lat: -33.8, Lon: -70.6",
    originPort: "Hong Kong",
    destinationPort: "Valparaíso",
    originCoords: [22.3, 114.2] as [number, number],
    destinationCoords: [-33.0, -71.6] as [number, number],
  },
  {
    client: "Ocean Traders",
    containerId: "HJMU-1234567",
    vessel: "HMM Algeciras",
    eta: "2025-07-19",
    status: "In Transit",
    transitTime: "10 days",
    lastPosition: "Lat: -22.9, Lon: -43.2",
    originPort: "Busan",
    destinationPort: "Rio de Janeiro",
    originCoords: [35.1, 129.0] as [number, number],
    destinationCoords: [-22.9, -43.2] as [number, number],
  },
  {
    client: "Delta Import",
    containerId: "MSKU-7891234",
    vessel: "Maersk Line",
    eta: "2025-07-15",
    status: "In Port",
    transitTime: "12 days",
    lastPosition: "Lat: -12.0, Lon: -77.0",
    originPort: "Rotterdam",
    destinationPort: "Callao",
    originCoords: [51.9, 4.1] as [number, number],
    destinationCoords: [-12.0, -77.0] as [number, number],
  },
  {
    client: "FastLog",
    containerId: "CSNU-5678901",
    vessel: "COSCO Beijing",
    eta: "2025-07-18",
    status: "Delayed",
    transitTime: "15 days",
    lastPosition: "Lat: -1.3, Lon: 36.8",
    originPort: "Dubai",
    destinationPort: "Mombasa",
    originCoords: [25.2, 55.3] as [number, number],
    destinationCoords: [-4.0, 39.7] as [number, number],
  },
  {
    client: "Continental Cargo",
    containerId: "ONEU-2345678",
    vessel: "ONE Apus",
    eta: "2025-07-20",
    status: "In Transit",
    transitTime: "11 days",
    lastPosition: "Lat: 25.2, Lon: 55.3",
    originPort: "Long Beach",
    destinationPort: "Dubai",
    originCoords: [33.8, -118.2] as [number, number],
    destinationCoords: [25.2, 55.3] as [number, number],
  },
  {
    client: "LogiTrade",
    containerId: "NYKU-8901234",
    vessel: "NYK Venus",
    eta: "2025-07-16",
    status: "In Port",
    transitTime: "13 days",
    lastPosition: "Lat: 1.3, Lon: 103.8",
    originPort: "Singapore",
    destinationPort: "Singapore",
    originCoords: [1.3, 103.8] as [number, number],
    destinationCoords: [1.3, 103.8] as [number, number],
  },
  {
    client: "Importex",
    containerId: "APLU-3456789",
    vessel: "APL Savannah",
    eta: "2025-07-14",
    status: "Delayed",
    transitTime: "16 days",
    lastPosition: "Lat: 35.6, Lon: 139.7",
    originPort: "Hamburg",
    destinationPort: "Tokyo",
    originCoords: [53.6, 10.0] as [number, number],
    destinationCoords: [35.6, 139.7] as [number, number],
  },
  {
    client: "SeaLine",
    containerId: "ZIMU-6789012",
    vessel: "ZIM Rotterdam",
    eta: "2025-07-13",
    status: "In Transit",
    transitTime: "17 days",
    lastPosition: "Lat: 19.4, Lon: -99.1",
    originPort: "Antwerp",
    destinationPort: "Veracruz",
    originCoords: [51.2, 4.4] as [number, number],
    destinationCoords: [19.2, -96.1] as [number, number],
  },
  {
    client: "Blue Cargo",
    containerId: "MSCU-9012345",
    vessel: "MSC Gaia",
    eta: "2025-07-21",
    status: "In Transit",
    transitTime: "9 days",
    lastPosition: "Lat: 50.1, Lon: 8.6",
    originPort: "Los Angeles",
    destinationPort: "Le Havre",
    originCoords: [33.8, -118.2] as [number, number],
    destinationCoords: [49.5, 0.1] as [number, number],
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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const toggleRow = (orderId: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(orderId)) {
      newExpandedRows.delete(orderId)
    } else {
      newExpandedRows.add(orderId)
    }
    setExpandedRows(newExpandedRows)
  }

  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Ship className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">MariTime Dashboard</h1>
            </div>
            
            {/* PDF Upload Button */}
            <button
              onClick={openDrawer}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <FileText className="h-4 w-4" />
              <span className="font-medium">Cargar PDF</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat) => (
            <Card key={stat.title}>
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
                    <TableHead className="w-12">Mapa</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Container ID</TableHead>
                    <TableHead>Vessel Name</TableHead>
                    <TableHead>Puerto de Origen</TableHead>
                    <TableHead>Puerto de Destino</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Transit Time</TableHead>
                    <TableHead>Last Position</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipmentsData.map((shipment) => (
                    <React.Fragment key={shipment.containerId}>
                      <TableRow>
                        <TableCell>
                          <button
                            onClick={() => toggleRow(shipment.containerId)}
                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            {expandedRows.has(shipment.containerId) ? (
                              <ChevronUp className="h-4 w-4 text-gray-600" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-600" />
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="font-medium">{shipment.client}</TableCell>
                        <TableCell>{shipment.containerId}</TableCell>
                        <TableCell>{shipment.vessel}</TableCell>
                        <TableCell className="font-medium text-blue-600">{shipment.originPort}</TableCell>
                        <TableCell className="font-medium text-red-600">{shipment.destinationPort}</TableCell>
                        <TableCell>{shipment.eta}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                        </TableCell>
                        <TableCell>{shipment.transitTime}</TableCell>
                        <TableCell className="font-mono text-sm">{shipment.lastPosition}</TableCell>
                      </TableRow>
                      {expandedRows.has(shipment.containerId) && (
                        <TableRow>
                          <TableCell colSpan={10} className="p-4 bg-gray-50">
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <MapPin className="h-4 w-4 text-blue-600" />
                                <span>Ruta de {shipment.vessel}: {shipment.originPort} → {shipment.destinationPort}</span>
                              </div>
                              <IndividualVesselMap shipment={shipment} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* PDF Upload Drawer */}
      <PDFUploadDrawer 
        isOpen={isDrawerOpen} 
        onClose={closeDrawer} 
      />
    </div>
  )
}