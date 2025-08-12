'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import ShipmentRow from './shipment-row'
import { TABLE_HEADERS } from '@/lib/constants'
import { useExpandedRows } from '@/hooks/use-expanded-rows'
import { Shipment } from '@/types/shipment'

interface ShipmentsTableProps {
  shipments: Shipment[]
}

export default function ShipmentsTable({ shipments }: ShipmentsTableProps) {
  const { toggleRow, isExpanded } = useExpandedRows()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Shipments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {TABLE_HEADERS.map((header) => (
                  <TableHead key={header} className={header === 'Mapa' ? 'w-12' : ''}>
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((shipment) => (
                <ShipmentRow
                  key={shipment.containerId}
                  shipment={shipment}
                  isExpanded={isExpanded(shipment.containerId)}
                  onToggle={toggleRow}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 