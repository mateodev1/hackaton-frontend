'use client'

import { useState } from 'react'
import { parsePDFAction } from '@/app/actions'
import { X, Upload, FileText, Ship, MapPin, Package, DollarSign } from 'lucide-react'
import { BillOfLading } from '@/types/billOfLanding'

interface PdfUploadDrawerProps {
	isOpen: boolean
	close: () => void
}

export const PdfUploadDrawer = ({ isOpen, close }: PdfUploadDrawerProps) => {
	const [file, setFile] = useState<File | null>(null)
	const [result, setResult] = useState<any>(null)
	const [loading, setLoading] = useState(false)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0]
		if (selectedFile && selectedFile.type.includes('pdf')) {
			setFile(selectedFile)
			setResult(null) // Limpiar resultado anterior
		}
	}

	const handleUpload = async () => {
		if (!file) return

		setLoading(true)
		try {
			// Crear FormData para enviar al servidor
			const formData = new FormData()
			formData.append('pdf', file)

			// Llamar a la acción del servidor
			const serverResult = await parsePDFAction(formData)

			if (serverResult.success && serverResult.data) {
				setResult({
					success: true,
					bolData: serverResult.data.bolData
				})
			} else {
				setResult({
					success: false,
					error: serverResult.error,
					details: 'Error del servidor'
				})
			}
		} catch (error) {
			console.error('Error al procesar PDF:', error)
			setResult({
				success: false,
				error: 'Error al procesar el PDF',
				details: error instanceof Error ? error.message : 'Error desconocido'
			})
		} finally {
			setLoading(false)
		}
	}

	const renderBOLData = (bolData: BillOfLading) => {
		return (
			<div className="space-y-4">
				{/* Información básica */}
				<div className="grid grid-cols-2 gap-4">
					<div className="p-3 bg-blue-50 rounded-lg">
						<h4 className="font-semibold text-blue-900 mb-2">Número de BOL</h4>
						<p className="text-sm text-blue-700">{bolData.billOfLadingNumber}</p>
					</div>
					{bolData.bookingNumber && (
						<div className="p-3 bg-green-50 rounded-lg">
							<h4 className="font-semibold text-green-900 mb-2">Número de Reserva</h4>
							<p className="text-sm text-green-700">{bolData.bookingNumber}</p>
						</div>
					)}
				</div>

				{/* Shipper y Consignee */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="p-3 bg-gray-50 rounded-lg">
						<h4 className="font-semibold text-gray-900 mb-2 flex items-center">
							<Package className="h-4 w-4 mr-2" />
							Remitente
						</h4>
						<p className="text-sm font-medium">{bolData.shipper.name}</p>
						<p className="text-xs text-gray-600">{bolData.shipper.address}</p>
					</div>
					<div className="p-3 bg-gray-50 rounded-lg">
						<h4 className="font-semibold text-gray-900 mb-2 flex items-center">
							<Package className="h-4 w-4 mr-2" />
							Consignatario
						</h4>
						<p className="text-sm font-medium">{bolData.consignee.name}</p>
						<p className="text-xs text-gray-600">{bolData.consignee.address}</p>
					</div>
				</div>

				{/* Vessel y Puertos */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="p-3 bg-blue-50 rounded-lg">
						<h4 className="font-semibold text-blue-900 mb-2 flex items-center">
							<Ship className="h-4 w-4 mr-2" />
							Buque
						</h4>
						<p className="text-sm font-medium">{bolData.vessel.name}</p>
						{bolData.vessel.voyageNumber && <p className="text-xs text-blue-600">Viaje: {bolData.vessel.voyageNumber}</p>}
					</div>
					<div className="p-3 bg-green-50 rounded-lg">
						<h4 className="font-semibold text-green-900 mb-2 flex items-center">
							<MapPin className="h-4 w-4 mr-2" />
							Puertos
						</h4>
						<p className="text-xs text-green-700">
							<strong>Carga:</strong> {bolData.ports.portOfLoading}
						</p>
						<p className="text-xs text-green-700">
							<strong>Descarga:</strong> {bolData.ports.portOfDischarge}
						</p>
					</div>
				</div>

				{/* Cargo */}
				<div className="p-3 bg-yellow-50 rounded-lg">
					<h4 className="font-semibold text-yellow-900 mb-2">Carga</h4>
					<div className="grid grid-cols-2 gap-2 text-sm">
						<div>
							<p className="text-xs text-yellow-700">Descripción:</p>
							<p className="font-medium">{bolData.cargo.description}</p>
						</div>
						<div>
							<p className="text-xs text-yellow-700">Paquetes:</p>
							<p className="font-medium">{bolData.cargo.packages}</p>
						</div>
						{bolData.cargo.containerNumber && (
							<div>
								<p className="text-xs text-yellow-700">Contenedor:</p>
								<p className="font-medium">{bolData.cargo.containerNumber}</p>
							</div>
						)}
						{bolData.cargo.grossWeightKg && (
							<div>
								<p className="text-xs text-yellow-700">Peso (kg):</p>
								<p className="font-medium">{bolData.cargo.grossWeightKg}</p>
							</div>
						)}
					</div>
				</div>

				{/* Freight */}
				{bolData.freight && (
					<div className="p-3 bg-purple-50 rounded-lg">
						<h4 className="font-semibold text-purple-900 mb-2 flex items-center">
							<DollarSign className="h-4 w-4 mr-2" />
							Flete
						</h4>
						<div className="grid grid-cols-2 gap-2 text-sm">
							{bolData.freight.prepaid && (
								<div>
									<p className="text-xs text-purple-700">Prepagado:</p>
									<p className="font-medium">${bolData.freight.prepaid}</p>
								</div>
							)}
							{bolData.freight.total && (
								<div>
									<p className="text-xs text-purple-700">Total:</p>
									<p className="font-medium">${bolData.freight.total}</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		)
	}

	return (
		<div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={close}>
			<div
				className={`w-full max-w-md bg-white h-full flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b bg-gray-50 flex-shrink-0">
					<div className="flex items-center space-x-2">
						<FileText className="h-6 w-6 text-blue-600" />
						<h2 className="text-lg font-semibold text-gray-900">Cargar PDF</h2>
					</div>
					<button onClick={close} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
						<X className="h-5 w-5 text-gray-500" />
					</button>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto">
					<div className="p-6 space-y-6">
						{/* File Upload Area */}
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
							<label className="cursor-pointer flex flex-col items-center space-y-4">
								<input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
								<div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full">
									<Upload className="h-8 w-8 text-blue-600" />
								</div>
								<div className="text-center">
									<p className="text-lg font-medium text-gray-900">Seleccionar archivo PDF</p>
									<p className="text-sm text-gray-500">Haz clic para seleccionar o arrastra el archivo aquí</p>
								</div>
							</label>
						</div>

						{/* Selected File Info */}
						{file && (
							<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
								<div className="flex items-center space-x-2">
									<FileText className="h-5 w-5 text-green-600" />
									<div>
										<p className="text-sm font-medium text-green-900">Archivo seleccionado:</p>
										<p className="text-sm text-green-700">{file.name}</p>
										<p className="text-xs text-green-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
									</div>
								</div>
							</div>
						)}

						{/* Process Button */}
						<button
							onClick={handleUpload}
							disabled={!file || loading}
							className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
								file && !loading ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
							}`}
						>
							{loading ? 'Procesando con IA...' : 'Procesar PDF con IA'}
						</button>

						{/* Results */}
						{result && (
							<div className="mt-4 space-y-4">
								{/* Bill of Lading Data */}
								{result.success && result.bolData && (
									<div className="p-4 border rounded-lg bg-white">
										<div className="flex items-center justify-between mb-4">
											<h3 className="font-bold text-gray-900">Bill of Lading Extraído</h3>
											<span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">IA</span>
										</div>
										{renderBOLData(result.bolData)}
									</div>
								)}

								{/* Raw Text */}
								<div className="p-4 border rounded-lg">
									<div className="flex items-center justify-between mb-2">
										<h3 className="font-bold text-gray-900">Texto Extraído:</h3>
										<span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">Servidor</span>
									</div>
									{result.success ? (
										<div className="space-y-3">
											<p className="text-sm">
												<strong>Páginas:</strong> {result.pages}
											</p>
											<div>
												<p className="text-sm font-medium mb-2">
													<strong>Texto del PDF:</strong>
												</p>
												<pre className="bg-gray-100 p-3 rounded text-sm max-h-40 overflow-y-auto text-gray-800">
													{result.text?.substring(0, 500)}
													{result.text && result.text.length > 500 && '...'}
												</pre>
											</div>
										</div>
									) : (
										<div className="text-red-500">
											<p className="font-medium">Error: {result.error}</p>
											{result.details && <p className="text-sm mt-1">{result.details}</p>}
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
