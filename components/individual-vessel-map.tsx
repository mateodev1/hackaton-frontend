"use client"

import { useEffect, useRef } from "react"
import type { Map as LeafletMap } from "leaflet"

interface Shipment {
  client: string
  containerId: string
  vessel: string
  eta: string
  status: string
  transitTime: string
  lastPosition: string
  originPort: string
  destinationPort: string
  originCoords: [number, number]
  destinationCoords: [number, number]
}

interface IndividualVesselMapProps {
  shipment: Shipment
}

// Parse coordinates from "Lat: X, Lon: Y" format
const parseCoordinates = (position: string): [number, number] | null => {
  const match = position.match(/Lat:\s*(-?\d+\.?\d*),\s*Lon:\s*(-?\d+\.?\d*)/)
  if (match) {
    return [Number.parseFloat(match[1]), Number.parseFloat(match[2])]
  }
  return null
}

// Get marker color based on status
const getMarkerColor = (status: string): string => {
  switch (status) {
    case "In Transit":
      return "#3b82f6" // blue
    case "In Port":
      return "#10b981" // green
    case "Delayed":
      return "#ef4444" // red
    default:
      return "#6b7280" // gray
  }
}

export default function IndividualVesselMap({ shipment }: IndividualVesselMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<LeafletMap | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Dynamically import Leaflet
    import("leaflet").then((L) => {
      // Import Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      if (mapRef.current && !mapInstanceRef.current) {
        const currentCoords = parseCoordinates(shipment.lastPosition)
        if (!currentCoords) return

        const [currentLat, currentLng] = currentCoords
        const [originLat, originLng] = shipment.originCoords
        const [destLat, destLng] = shipment.destinationCoords

        // Initialize map
        const map = L.map(mapRef.current)

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map)

        // Create custom icon functions
        const createPortIcon = (color: string, isDestination: boolean = false) => {
          return L.divIcon({
            html: `
              <div style="
                background-color: ${color};
                width: 28px;
                height: 28px;
                border-radius: ${isDestination ? '4px' : '50%'};
                border: 3px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="
                  width: 12px;
                  height: 12px;
                  background-color: white;
                  border-radius: ${isDestination ? '2px' : '50%'};
                "></div>
              </div>
            `,
            className: "custom-port-marker",
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          })
        }

        const createVesselIcon = (color: string) => {
          return L.divIcon({
            html: `
              <div style="
                background-color: ${color};
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 4px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
              ">
                <div style="
                  width: 14px;
                  height: 14px;
                  background-color: white;
                  border-radius: 50%;
                "></div>
                <div style="
                  position: absolute;
                  top: -10px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 0;
                  height: 0;
                  border-left: 6px solid transparent;
                  border-right: 6px solid transparent;
                  border-bottom: 10px solid ${color};
                "></div>
              </div>
            `,
            className: "custom-vessel-marker",
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })
        }

        // Add route line
        const routeCoords: [number, number][] = [
          [originLat, originLng],
          [destLat, destLng]
        ]
        
        const routeLine = L.polyline(routeCoords, {
          color: '#3b82f6',
          weight: 3,
          opacity: 0.8,
          dashArray: '10, 10'
        }).addTo(map)

        // Add origin port marker
        const originMarker = L.marker([originLat, originLng], {
          icon: createPortIcon('#10b981', false),
        }).addTo(map)

        originMarker.bindPopup(`
          <div style="font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
              🚢 Puerto de Origen
            </h3>
            <div style="font-size: 14px; color: #4b5563; line-height: 1.4;">
              <p style="margin: 4px 0;"><strong>Puerto:</strong> ${shipment.originPort}</p>
              <p style="margin: 4px 0;"><strong>Coordenadas:</strong> ${originLat.toFixed(2)}, ${originLng.toFixed(2)}</p>
            </div>
          </div>
        `)

        // Add destination port marker
        const destMarker = L.marker([destLat, destLng], {
          icon: createPortIcon('#ef4444', true),
        }).addTo(map)

        destMarker.bindPopup(`
          <div style="font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
              🏁 Puerto de Destino
            </h3>
            <div style="font-size: 14px; color: #4b5563; line-height: 1.4;">
              <p style="margin: 4px 0;"><strong>Puerto:</strong> ${shipment.destinationPort}</p>
              <p style="margin: 4px 0;"><strong>ETA:</strong> ${shipment.eta}</p>
              <p style="margin: 4px 0;"><strong>Coordenadas:</strong> ${destLat.toFixed(2)}, ${destLng.toFixed(2)}</p>
            </div>
          </div>
        `)

        // Add current vessel position marker
        const vesselMarker = L.marker([currentLat, currentLng], {
          icon: createVesselIcon(getMarkerColor(shipment.status)),
        }).addTo(map)

        vesselMarker.bindPopup(`
          <div style="font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
              🚢 ${shipment.vessel}
            </h3>
                         <div style="font-size: 14px; color: #4b5563; line-height: 1.4;">
               <p style="margin: 4px 0;"><strong>Client:</strong> ${shipment.client}</p>
               <p style="margin: 4px 0;"><strong>Container ID:</strong> ${shipment.containerId}</p>
               <p style="margin: 4px 0;"><strong>Ruta:</strong> ${shipment.originPort} → ${shipment.destinationPort}</p>
              <p style="margin: 4px 0;"><strong>Status:</strong> 
                <span style="
                  background-color: ${
                    shipment.status === "In Transit"
                      ? "#dbeafe"
                      : shipment.status === "In Port"
                        ? "#d1fae5"
                        : "#fee2e2"
                  };
                  color: ${
                    shipment.status === "In Transit"
                      ? "#1e40af"
                      : shipment.status === "In Port"
                        ? "#065f46"
                        : "#991b1b"
                  };
                  padding: 2px 6px;
                  border-radius: 4px;
                  font-size: 12px;
                  font-weight: 500;
                ">${shipment.status}</span>
              </p>
              <p style="margin: 4px 0;"><strong>Transit Time:</strong> ${shipment.transitTime}</p>
              <p style="margin: 4px 0;"><strong>Posición Actual:</strong> ${shipment.lastPosition}</p>
            </div>
          </div>
        `).openPopup()

        // Fit map to show all points
        const allPoints: [number, number][] = [
          [originLat, originLng],
          [currentLat, currentLng],
          [destLat, destLng]
        ]
        
        const bounds = L.latLngBounds(allPoints)
        map.fitBounds(bounds, { padding: [30, 30] })

        mapInstanceRef.current = map
      }
    })

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [shipment])

  return (
    <div className="w-full h-64 border rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
} 