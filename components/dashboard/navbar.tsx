'use client'

import { Ship, FileText } from 'lucide-react'

interface NavbarProps {
  onUploadClick: () => void
}

export default function Navbar({ onUploadClick }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Ship className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-semibold text-gray-900">MariTime Dashboard</h1>
          </div>

          <button 
            onClick={onUploadClick} 
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <FileText className="h-4 w-4" />
            <span className="font-medium">Cargar PDF</span>
          </button>
        </div>
      </div>
    </nav>
  )
} 