'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { Badge } from '@/components/ui/badge'
import { FileText, Ship, MapPin, Package, DollarSign, Calendar, Eye } from 'lucide-react'
import { BillOfLading } from '@/types/billOfLanding'
import React from 'react'
import { DivIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
function ShipIcon({ course }: { course: number }) {
	return new DivIcon({
		html: `
      <div style="transform: rotate(${course}deg); transform-origin: center;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L4 20L12 17L20 20L12 2Z" fill="#2563eb" stroke="#1e40af" strokeWidth="2"/>
        </svg>
      </div>
    `,
		className: 'ship-marker',
		iconSize: [32, 32],
		iconAnchor: [16, 16]
	})
}
interface BillsOfLadingTableProps {
	billsOfLading: BillOfLading[]
}
function MapUpdater({ latitude, longitude }: { latitude: number; longitude: number }) {
	const map = useMap()

	useEffect(() => {
		map.setView([latitude, longitude], map.getZoom())
	}, [latitude, longitude, map])

	return null
}
export default function BillsOfLadingTable({ billsOfLading }: BillsOfLadingTableProps) {
	console.log('Bills of Lading:', billsOfLading) // Verifica los datos recibidos
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
	}, [])

	const toggleRow = (id: string) => {
		const newExpanded = new Set(expandedRows)
		if (newExpanded.has(id)) {
			newExpanded.delete(id)
		} else {
			newExpanded.add(id)
		}
		setExpandedRows(newExpanded)
	}

	const formatDate = (dateString: string | undefined) => {
		if (!dateString) return 'N/A'
		return new Date(dateString).toLocaleDateString('es-ES')
	}

	const formatCurrency = (amount: number | undefined) => {
		if (!amount) return 'N/A'
		return new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: 'USD'
		}).format(amount)
	}
	const mapRef = useRef<any>(null)
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<FileText className="h-5 w-5 text-blue-600" />
					<span>Bills of Lading Procesados</span>
					<Badge variant="secondary" className="ml-2">
						{billsOfLading.length}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Número BOL</TableHead>
							<TableHead>Remitente</TableHead>
							<TableHead>Consignatario</TableHead>
							<TableHead>Buque</TableHead>
							<TableHead>Puertos</TableHead>
							<TableHead>Carga</TableHead>
							<TableHead>Flete</TableHead>
							<TableHead>Fecha</TableHead>
							<TableHead>Acciones</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{billsOfLading.map((bol) => (
							<React.Fragment key={bol.billOfLadingNumber}>
								<TableRow className="cursor-pointer hover:bg-gray-50">
									<TableCell className="font-medium">{bol.billOfLadingNumber}</TableCell>
									<TableCell>
										<div className="max-w-xs truncate" title={bol.shipper.name}>
											{bol.shipper.name}
										</div>
									</TableCell>
									<TableCell>
										<div className="max-w-xs truncate" title={bol.consignee.name}>
											{bol.consignee.name}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center space-x-1">
											<Ship className="h-4 w-4 text-blue-500" />
											<span className="max-w-32 truncate" title={bol.vessel.name}>
												{bol.vessel.name}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center space-x-1">
											<MapPin className="h-4 w-4 text-green-500" />
											<div className="text-xs">
												<div className="font-medium">{bol.ports.portOfLoading}</div>
												<div className="text-gray-500">→ {bol.ports.portOfDischarge}</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center space-x-1">
											<Package className="h-4 w-4 text-orange-500" />
											<span>{bol.cargo.packages} pkg</span>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center space-x-1">
											<DollarSign className="h-4 w-4 text-green-500" />
											<span>{formatCurrency(bol.freight?.total)}</span>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center space-x-1">
											<Calendar className="h-4 w-4 text-purple-500" />
											<span>{formatDate(bol.shipmentDate)}</span>
										</div>
									</TableCell>
									<TableCell>
										<button onClick={() => toggleRow(bol.billOfLadingNumber)} className="p-1 hover:bg-gray-100 rounded transition-colors" title="Ver detalles">
											<Eye className="h-4 w-4 text-gray-600" />
										</button>
									</TableCell>
								</TableRow>
								{expandedRows.has(bol.billOfLadingNumber) && (
									<TableRow>
										<TableCell colSpan={9} className="bg-gray-50 p-4">
											<div className="w-full h-96 rounded-lg overflow-hidden border border-border">
												{isClient && (
													<MapContainer center={[bol.shipmap?.latitude || 0, bol.shipmap?.longitude || 0]} zoom={13} style={{ height: '100%', width: '100%' }} ref={mapRef}>
														<TileLayer
															attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
															url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
														/>
														<MapUpdater latitude={bol.shipmap?.latitude || 0} longitude={bol.shipmap?.longitude || 0} />
														<Marker position={[bol.shipmap?.latitude || 0, bol.shipmap?.longitude || 0]} icon={ShipIcon({ course: bol.shipmap?.course || 0 })} />
													</MapContainer>
												)}
											</div>
										</TableCell>
									</TableRow>
								)}
							</React.Fragment>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
