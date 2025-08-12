'use client'

import React from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Shipment } from '@/types/shipment'
import { STATUS_COLORS } from '@/lib/constants'

const IndividualVesselMap = dynamic(() => import('../individual-vessel-map'), { ssr: false })

interface ShipmentRowProps {
  shipment: Shipment
  isExpanded: boolean
  onToggle: (orderId: string) => void
}

export default function ShipmentRow({ 
  shipment, 
  isExpanded, 
  onToggle
}: ShipmentRowProps) {
  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default
  }

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <button
            onClick={() => onToggle(shipment.containerId)}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
          >
            {isExpanded ? (
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
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={10} className="p-4 bg-gray-50">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>
                  Ruta de {shipment.vessel}: {shipment.originPort} → {shipment.destinationPort}
                </span>
              </div>
              <IndividualVesselMap shipment={shipment} />
            </div>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  )
} 