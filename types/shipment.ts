export interface Shipment {
  containerId: string
  client: string
  vessel: string
  originPort: string
  destinationPort: string
  eta: string
  status: 'In Transit' | 'In Port' | 'Delayed'
  transitTime: string
  lastPosition: string
  originCoords: [number, number]
  destinationCoords: [number, number]
}

export interface StatData {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color: string
} 
