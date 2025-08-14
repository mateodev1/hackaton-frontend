'use client'

import { useEffect, useState } from 'react'
import Navbar from './navbar'
import StatsCards from './stats-cards'
import BillsOfLadingTable from './bills-of-lading-table'
import { STATS_DATA } from '@/lib/constants'
import { useDrawer } from '@/hooks/use-drawer'
import { Shipment } from '@/types/shipment'
import { BillOfLading } from '@/types/billOfLanding'
import { PdfUploadDrawer } from '../pdf-upload-drawer'
import { getAllBillsOfLading } from '@/app/actions'

interface MaritimeDashboardProps {
	shipments: Shipment[]
}

export default function MaritimeDashboard({ shipments }: MaritimeDashboardProps) {
	const { isOpen, open, close } = useDrawer()
	const [billsOfLading, setBillsOfLading] = useState<BillOfLading[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchBillsOfLading = async () => {
			try {
				const result = await getAllBillsOfLading()
				if (result.success) {
					setBillsOfLading(result.data)
					// Aquí puedes manejar la respuesta exitosa
				}
			} catch (error) {
				console.error('Error fetching Bills of Lading:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchBillsOfLading()
	}, [])

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar onUploadClick={open} />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<StatsCards stats={STATS_DATA} />

				{/* Bills of Lading Table */}
				<div className="mt-8">
					<BillsOfLadingTable billsOfLading={billsOfLading} />
				</div>

				{/* Shipments Table */}
				{/* <div className="mt-8">
					<ShipmentsTable shipments={shipments} />
				</div> */}
			</div>

			<PdfUploadDrawer isOpen={isOpen} close={close} />
		</div>
	)
}
