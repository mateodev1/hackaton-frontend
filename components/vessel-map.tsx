"use client"

import { useEffect, useRef } from "react"
import type { Map as LeafletMap } from "leaflet"

interface Shipment {
  client: string
  orderId: string
  vessel: string
  eta: string
  status: string
  transitTime: string
  lastPosition: string
}

interface MapComponentProps {
  shipments: Shipment[]
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

export default function VesselMap({ shipments }: MapComponentProps) {
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
        // Initialize map
        const map = L.map(mapRef.current).setView([0, 0], 2)

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map)

        // Create custom icon function
        const createCustomIcon = (color: string) => {
          return L.divIcon({
            html: `
              <div style="
                background-color: ${color};
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="
                  width: 8px;
                  height: 8px;
                  background-color: white;
                  border-radius: 50%;
                "></div>
              </div>
            `,
            className: "custom-vessel-marker",
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })
        }

        // Add markers for each vessel
        const bounds: [number, number][] = []

        shipments.forEach((shipment) => {
          const coords = parseCoordinates(shipment.lastPosition)
          if (coords) {
            const [lat, lng] = coords
            bounds.push([lat, lng])

            const marker = L.marker([lat, lng], {
              icon: createCustomIcon(getMarkerColor(shipment.status)),
            }).addTo(map)

            // Add popup with vessel information
            marker.bindPopup(`
              <div style="font-family: system-ui, -apple-system, sans-serif;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                  ${shipment.vessel}
                </h3>
                <div style="font-size: 14px; color: #4b5563; line-height: 1.4;">
                  <p style="margin: 4px 0;"><strong>Client:</strong> ${shipment.client}</p>
                  <p style="margin: 4px 0;"><strong>Order ID:</strong> ${shipment.orderId}</p>
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
                  <p style="margin: 4px 0;"><strong>ETA:</strong> ${shipment.eta}</p>
                  <p style="margin: 4px 0;"><strong>Transit Time:</strong> ${shipment.transitTime}</p>
                  <p style="margin: 4px 0;"><strong>Position:</strong> ${shipment.lastPosition}</p>
                </div>
              </div>
            `)
          }
        })

        // Fit map to show all markers
        if (bounds.length > 0) {
          map.fitBounds(bounds, { padding: [20, 20] })
        }

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
  }, [shipments])

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border z-[1000]">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Vessel Status</h4>
        <div className="space-y-1">
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>In Transit</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>In Port</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Delayed</span>
          </div>
        </div>
      </div>
    </div>
  )
}
