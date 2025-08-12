'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { FileText, Ship, MapPin, Package, DollarSign, Calendar, Eye } from 'lucide-react'
import { BillOfLading } from '@/types/billOfLanding'

interface BillsOfLadingTableProps {
	billsOfLading: BillOfLading[]
}

export default function BillsOfLadingTable({ billsOfLading }: BillsOfLadingTableProps) {
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

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
							<>
								<TableRow key={bol.billOfLadingNumber} className="cursor-pointer hover:bg-gray-50">
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
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												{/* Información básica */}
												<div className="space-y-2">
													<h4 className="font-semibold text-gray-900">Información Básica</h4>
													<div className="space-y-1 text-sm">
														<div>
															<span className="font-medium">Booking:</span> {bol.bookingNumber || 'N/A'}
														</div>
														<div>
															<span className="font-medium">Contenedor:</span> {bol.cargo.containerNumber || 'N/A'}
														</div>
														<div>
															<span className="font-medium">Sello:</span> {bol.cargo.sealNumber || 'N/A'}
														</div>
														<div>
															<span className="font-medium">Originales:</span> {bol.numberOfOriginals || 'N/A'}
														</div>
													</div>
												</div>

												{/* Detalles de carga */}
												<div className="space-y-2">
													<h4 className="font-semibold text-gray-900">Detalles de Carga</h4>
													<div className="space-y-1 text-sm">
														<div>
															<span className="font-medium">Descripción:</span> {bol.cargo.description}
														</div>
														<div>
															<span className="font-medium">Peso:</span> {bol.cargo.grossWeightKg ? `${bol.cargo.grossWeightKg} kg` : 'N/A'}
														</div>
														<div>
															<span className="font-medium">Volumen:</span> {bol.cargo.volumeCbm ? `${bol.cargo.volumeCbm} m³` : 'N/A'}
														</div>
														<div>
															<span className="font-medium">Valor declarado:</span> {formatCurrency(bol.declaredValueUSD)}
														</div>
													</div>
												</div>

												{/* Información de flete */}
												<div className="space-y-2">
													<h4 className="font-semibold text-gray-900">Información de Flete</h4>
													<div className="space-y-1 text-sm">
														<div>
															<span className="font-medium">Prepagado:</span> {formatCurrency(bol.freight?.prepaid)}
														</div>
														<div>
															<span className="font-medium">Por cobrar:</span> {formatCurrency(bol.freight?.collect)}
														</div>
														<div>
															<span className="font-medium">Base:</span> {bol.freight?.basis || 'N/A'}
														</div>
														<div>
															<span className="font-medium">Tarifa:</span> {formatCurrency(bol.freight?.rate)}
														</div>
													</div>
												</div>

												{/* Direcciones */}
												<div className="space-y-2">
													<h4 className="font-semibold text-gray-900">Direcciones</h4>
													<div className="space-y-1 text-sm">
														<div>
															<span className="font-medium">Remitente:</span> {bol.shipper.address}
														</div>
														<div>
															<span className="font-medium">Consignatario:</span> {bol.consignee.address}
														</div>
														{bol.notifyParty && (
															<div>
																<span className="font-medium">Notificar a:</span> {bol.notifyParty.address}
															</div>
														)}
													</div>
												</div>

												{/* Información del buque */}
												<div className="space-y-2">
													<h4 className="font-semibold text-gray-900">Buque</h4>
													<div className="space-y-1 text-sm">
														<div>
															<span className="font-medium">Viaje:</span> {bol.vessel.voyageNumber || 'N/A'}
														</div>
														<div>
															<span className="font-medium">Bandera:</span> {bol.vessel.flag || 'N/A'}
														</div>
														<div>
															<span className="font-medium">Lugar recepción:</span> {bol.ports.placeOfReceipt || 'N/A'}
														</div>
														<div>
															<span className="font-medium">Lugar entrega:</span> {bol.ports.placeOfDelivery || 'N/A'}
														</div>
													</div>
												</div>

												{/* Agente de carga */}
												{bol.forwardingAgent && (
													<div className="space-y-2">
														<h4 className="font-semibold text-gray-900">Agente de Carga</h4>
														<div className="space-y-1 text-sm">
															<div>
																<span className="font-medium">Nombre:</span> {bol.forwardingAgent.name}
															</div>
															{bol.forwardingAgent.address && (
																<div>
																	<span className="font-medium">Dirección:</span> {bol.forwardingAgent.address}
																</div>
															)}
															{bol.forwardingAgent.phone && (
																<div>
																	<span className="font-medium">Teléfono:</span> {bol.forwardingAgent.phone}
																</div>
															)}
														</div>
													</div>
												)}
											</div>
										</TableCell>
									</TableRow>
								)}
							</>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
