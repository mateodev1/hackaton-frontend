'use client'
import MaritimeDashboard from '@/components/dashboard/maritime-dashboard'
import { Shipment } from '@/types/shipment'
import shipmentsData from './data.json'

export default function HomePage() {
	return <MaritimeDashboard shipments={shipmentsData as Shipment[]} />
}
