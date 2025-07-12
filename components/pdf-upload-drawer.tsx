"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, X } from "lucide-react"

interface PDFUploadDrawerProps {
  isOpen: boolean
  onClose: () => void
}

function PDFUploadContent({ onClose }: { onClose: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const router = useRouter()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
    } else {
      alert("Por favor selecciona un archivo PDF válido")
    }
  }

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Por favor selecciona un archivo PDF primero")
      return
    }

    // Aquí solo simulamos la carga del archivo
    // En una implementación real, aquí enviarías el archivo al servidor
    console.log("Archivo seleccionado:", selectedFile.name)
    
    // Cerrar el drawer
    onClose()
    
    // Redirigir a la página principal
    router.push("/")
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      <div className="flex items-center space-x-2">
        <FileText className="h-8 w-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Cargar Documento PDF</h2>
      </div>
      
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <label className="cursor-pointer flex flex-col items-center space-y-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-900">Seleccionar archivo PDF</p>
                <p className="text-sm text-gray-500">Haz clic para seleccionar o arrastra el archivo aquí</p>
              </div>
            </label>
          </div>
          
          {selectedFile && (
            <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Archivo seleccionado:</p>
                  <p className="text-sm text-green-700">{selectedFile.name}</p>
                  <p className="text-xs text-green-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedFile
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {selectedFile ? "Cargar PDF y Continuar" : "Selecciona un archivo PDF"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PDFUploadDrawer({ isOpen, onClose }: PDFUploadDrawerProps) {
  return (
    <>
      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Cargar Documento</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="h-full overflow-y-auto">
          <PDFUploadContent onClose={onClose} />
        </div>
      </div>
    </>
  )
} 