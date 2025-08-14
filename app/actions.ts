"use server"

import pdf from "pdf-parse"
import { createOpenAIModel, createBOLPrompt, createJSONParser } from "@/lib/langchain-config"
import { BillOfLading } from "@/types/billOfLanding"
import { prisma } from "@/lib/prisma"
import { TrackingResponse } from "./type"

export const getPositionShip = async (mmsi: string) => {
    try {
        console.log(process.env.NEXT_PUBLIC_API_URL)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ais/mt/${mmsi}/location/latest`)
        const data: TrackingResponse = await res.json()
        return {
            success: true,
            data: data.data.data
        }
    } catch (error) {
        console.error("Error fetching ship positions:", error)
        return {
            success: false,
            error: "Error al obtener las posiciones de los barcos"
        }
    }
}

export async function parsePDFAction(formData: FormData) {
    const file = formData.get("pdf") as File

    if (!file) {
        return {
            success: false,
            error: "No se proporcionó ningún archivo",
        }
    }

    if (file.type !== "application/pdf") {
        return {
            success: false,
            error: "El archivo debe ser un PDF",
        }
    }

    try {
        // Convertir el archivo a buffer
        const buffer = Buffer.from(await file.arrayBuffer())

        // Parsear el PDF
        const data = await pdf(buffer)
        const pdfText = data.text

        // Extraer información con IA
        const bolData = await completeShipmentIA(pdfText)

        if (bolData) {
            // Guardar en la base de datos
            const savedBOL = await saveBillOfLadingToDatabase(bolData)

            return {
                success: true,
                data: {
                    bolData: bolData,
                    databaseId: savedBOL.id
                },
            }
        } else {
            return {
                success: false,
                error: "No se pudo extraer información del PDF",
            }
        }
    } catch (error) {
        console.error("Error parsing PDF:", error)
        return {
            success: false,
            error: "Error al procesar el PDF",
        }
    }
}

export async function getAllBillsOfLading() {
    // TODO:definir mmsi en prisma y en el tipo BillOfLading
    try {
        const billsOfLading = await prisma.billOfLading.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Convertir a formato BillOfLading
        const formattedBOLs: BillOfLading[] = billsOfLading.map(bol => ({
            billOfLadingNumber: bol.billOfLadingNumber,
            bookingNumber: bol.bookingNumber || undefined,
            shipper: {
                name: bol.shipperName,
                address: bol.shipperAddress
            },
            consignee: {
                name: bol.consigneeName,
                address: bol.consigneeAddress
            },
            notifyParty: bol.notifyPartyName ? {
                name: bol.notifyPartyName,
                address: bol.notifyPartyAddress || ''
            } : undefined,
            forwardingAgent: bol.forwardingAgentName ? {
                name: bol.forwardingAgentName,
                address: bol.forwardingAgentAddress || undefined,
                phone: bol.forwardingAgentPhone || undefined
            } : undefined,
            vessel: {
                name: bol.vesselName,
                voyageNumber: bol.vesselVoyageNumber || undefined,
                flag: bol.vesselFlag || undefined,
                mmsi: "636022201"
            },
            ports: {
                portOfLoading: bol.portOfLoading,
                portOfDischarge: bol.portOfDischarge,
                placeOfReceipt: bol.placeOfReceipt || undefined,
                placeOfDelivery: bol.placeOfDelivery || undefined
            },
            cargo: {
                containerNumber: bol.containerNumber || undefined,
                sealNumber: bol.sealNumber || undefined,
                packages: bol.packages,
                description: bol.cargoDescription,
                grossWeightKg: bol.grossWeightKg || undefined,
                volumeCbm: bol.volumeCbm || undefined
            },
            freight: {
                basis: bol.freightBasis || undefined,
                rate: bol.freightRate || undefined,
                prepaid: bol.freightPrepaid || undefined,
                collect: bol.freightCollect || undefined,
                total: bol.freightTotal || undefined
            },
            declaredValueUSD: bol.declaredValueUSD || undefined,
            numberOfOriginals: bol.numberOfOriginals || undefined,
            shipmentDate: bol.shipmentDate?.toISOString() || undefined
        }))

        await Promise.all(formattedBOLs.map(async (bill) => {
            if (bill.shipmap == null) {
                // Manejar el caso donde shipmap es null
                if (!bill.vessel.mmsi) return
                const { data, success } = await getPositionShip(bill.vessel.mmsi)
                if (success) {
                    const shipMap = {
                        latitude: data?.latitude!,
                        longitude: data?.longitude!,
                        course: data?.course!,
                        speed: data?.speed!,
                        draught: data?.originalResponse.draught!,
                        navigationalStatus: data?.originalResponse.navigationalStatus!
                    }
                    bill.shipmap = shipMap
                }
            }
        })
        )
        console.log('Formatted BOLs:', formattedBOLs) // Verifica los datos formateados
        return {
            success: true,
            data: formattedBOLs
        }
    } catch (error) {
        console.error("Error getting Bills of Lading:", error)
        return {
            success: false,
            error: "Error al obtener los Bills of Lading",
            data: []
        }
    }

}

export async function extractTextFromPDF(formData: FormData) {
    const file = formData.get("pdf") as File

    if (!file) {
        return { text: "", error: "No file provided" }
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer())
        const data = await pdf(buffer)

        return {
            text: data.text,
            error: null,
        }
    } catch (error) {
        return {
            text: "",
            error: "Error extracting text from PDF",
        }
    }
}

export async function getPDFMetadata(formData: FormData) {
    const file = formData.get("pdf") as File

    if (!file) {
        return { metadata: null, error: "No file provided" }
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer())
        const data = await pdf(buffer)

        return {
            metadata: {
                pages: data.numpages,
                info: data.info,
                metadata: data.metadata,
                version: data.version,
            },
            error: null,
        }
    } catch (error) {
        return {
            metadata: null,
            error: "Error getting PDF metadata",
        }
    }
}

// Función para guardar BOL en la base de datos
async function saveBillOfLadingToDatabase(bolData: BillOfLading) {
    try {
        // Validar y parsear la fecha de embarque
        let shipmentDate = null
        if (bolData.shipmentDate) {
            const parsedDate = new Date(bolData.shipmentDate)
            // Verificar que la fecha es válida
            if (!isNaN(parsedDate.getTime())) {
                shipmentDate = parsedDate
            } else {
                console.warn('Fecha de embarque inválida:', bolData.shipmentDate)
            }
        }

        const savedBOL = await prisma.billOfLading.create({
            data: {
                billOfLadingNumber: bolData.billOfLadingNumber,
                bookingNumber: bolData.bookingNumber || null,
                shipperName: bolData.shipper.name,
                shipperAddress: bolData.shipper.address,
                consigneeName: bolData.consignee.name,
                consigneeAddress: bolData.consignee.address,
                notifyPartyName: bolData.notifyParty?.name || null,
                notifyPartyAddress: bolData.notifyParty?.address || null,
                forwardingAgentName: bolData.forwardingAgent?.name || null,
                forwardingAgentAddress: bolData.forwardingAgent?.address || null,
                forwardingAgentPhone: bolData.forwardingAgent?.phone || null,
                vesselName: bolData.vessel.name,
                vesselVoyageNumber: bolData.vessel.voyageNumber || null,
                vesselFlag: bolData.vessel.flag || null,
                portOfLoading: bolData.ports.portOfLoading,
                portOfDischarge: bolData.ports.portOfDischarge,
                placeOfReceipt: bolData.ports.placeOfReceipt || null,
                placeOfDelivery: bolData.ports.placeOfDelivery || null,
                containerNumber: bolData.cargo.containerNumber || null,
                sealNumber: bolData.cargo.sealNumber || null,
                packages: bolData.cargo.packages,
                cargoDescription: bolData.cargo.description,
                grossWeightKg: bolData.cargo.grossWeightKg || null,
                volumeCbm: bolData.cargo.volumeCbm || null,
                freightBasis: bolData.freight?.basis || null,
                freightRate: bolData.freight?.rate || null,
                freightPrepaid: bolData.freight?.prepaid || null,
                freightCollect: bolData.freight?.collect || null,
                freightTotal: bolData.freight?.total || null,
                declaredValueUSD: bolData.declaredValueUSD || null,
                numberOfOriginals: bolData.numberOfOriginals || null,
                shipmentDate: shipmentDate,
            }
        })

        return savedBOL
    } catch (error) {
        console.error("Error saving BOL to database:", error)
        throw error
    }
}

// Función para limpiar la respuesta de la IA y extraer JSON válido
function cleanAIResponse(response: string): string {
    // Remover markdown code blocks
    let cleaned = response.replace(/```json\s*/g, '').replace(/```\s*$/g, '')

    // Remover espacios en blanco al inicio y final
    cleaned = cleaned.trim()

    // Si la respuesta empieza con { y termina con }, es JSON válido
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
        return cleaned
    }

    // Buscar el primer { y último } para extraer solo el JSON
    const startIndex = cleaned.indexOf('{')
    const endIndex = cleaned.lastIndexOf('}')

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        return cleaned.substring(startIndex, endIndex + 1)
    }

    return cleaned
}

async function completeShipmentIA(pdfText: string): Promise<BillOfLading | null> {
    try {
        // Verificar que tenemos la API key
        if (!process.env.OPENAI_API_KEY) {
            console.error("OPENAI_API_KEY no está configurada")
            return null
        }

        // Crear el modelo de OpenAI
        const model = createOpenAIModel()

        // Crear el prompt
        const prompt = createBOLPrompt()

        // Crear el parser
        const parser = createJSONParser()

        // Crear la cadena de procesamiento
        const chain = prompt.pipe(model).pipe(parser)

        // Ejecutar la cadena
        const result = await chain.invoke({
            text: pdfText
        })

        // Limpiar la respuesta y parsear el JSON
        const cleanedResult = cleanAIResponse(result)
        console.log("Respuesta limpia:", cleanedResult)

        const bolData = JSON.parse(cleanedResult) as BillOfLading

        return bolData
    } catch (error) {
        console.error("Error en completeShipmentIA:", error)
        return null
    }
}





