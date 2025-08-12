import { Ship, Clock, TrendingUp, AlertTriangle } from 'lucide-react'

export const STATS_DATA = [
  { title: 'Active Shipments', value: '10', icon: Ship, color: 'text-blue-600' },
  { title: 'Delayed Shipments', value: '3', icon: Clock, color: 'text-red-600' },
  { title: 'On-time Delivery Rate', value: '70%', icon: TrendingUp, color: 'text-green-600' },
  { title: 'Ports With Congestion', value: '2', icon: AlertTriangle, color: 'text-orange-600' }
]

export const STATUS_COLORS = {
  'In Transit': 'bg-blue-100 text-blue-800',
  'In Port': 'bg-green-100 text-green-800',
  'Delayed': 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-800'
} as const

export const TABLE_HEADERS = [
  'Mapa',
  'Client',
  'Container ID',
  'Vessel Name',
  'Puerto de Origen',
  'Puerto de Destino',
  'ETA',
  'Status',
  'Transit Time',
  'Last Position'
] as const 