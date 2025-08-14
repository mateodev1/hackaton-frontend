export default function BillOfLadingPage({ params }: { params: { id: string } }) {
	const bol = {
		bookingNumber: 'BOL-123456',
		cargo: {
			containerNumber: 'CONT-123456',
			sealNumber: 'SEAL-123456',
			description: 'Cargo Description',
			grossWeightKg: 1000,
			volumeCbm: 10
		},
		numberOfOriginals: 3,
		declaredValueUSD: 1000,
		freight: {
			prepaid: 500,
			collect: 500,
			basis: 'Weight',
			rate: 100
		},
		shipper: {
			address: 'Shipper Address'
		},
		consignee: {
			address: 'Consignee Address'
		},
		notifyParty: {
			address: 'Notify Party Address'
		},
		vessel: {
			voyageNumber: 'VY-123456',
			flag: 'Panama'
		},
		ports: {
			placeOfReceipt: 'Port of Receipt',
			placeOfDelivery: 'Port of Delivery'
		},
		forwardingAgent: {
			name: 'Forwarding Agent Name',
			address: 'Forwarding Agent Address',
			phone: 'Forwarding Agent Phone'
		}
	}
	const formatCurrency = (amount: number | undefined) => {
		if (!amount) return 'N/A'
		return new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: 'USD'
		}).format(amount)
	}
	return (
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
	)
}
