import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Configurar el modelo de OpenAI
export const createOpenAIModel = () => {
    return new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0,
        openAIApiKey: process.env.OPENAI_API_KEY,
    });
};

// Template para extraer información del Bill of Lading
export const createBOLPrompt = () => {
    const template = `
Eres un experto en logística marítima y documentos de transporte. Tu tarea es extraer información específica de un Bill of Lading (BOL) del siguiente texto.

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido, sin markdown, sin texto adicional, sin explicaciones.

Extrae la siguiente información en formato JSON válido:

{{
  "billOfLadingNumber": "número del BOL",
  "bookingNumber": "número de reserva si está disponible",
  "shipper": {{
    "name": "nombre del remitente",
    "address": "dirección del remitente"
  }},
  "consignee": {{
    "name": "nombre del consignatario",
    "address": "dirección del consignatario"
  }},
  "notifyParty": {{
    "name": "nombre de la parte notificada",
    "address": "dirección de la parte notificada"
  }},
  "forwardingAgent": {{
    "name": "nombre del agente de carga",
    "address": "dirección del agente de carga",
    "phone": "teléfono del agente de carga"
  }},
  "vessel": {{
    "name": "nombre del buque",
    "voyageNumber": "número de viaje",
    "flag": "bandera del buque"
  }},
  "ports": {{
    "portOfLoading": "puerto de carga",
    "portOfDischarge": "puerto de descarga",
    "placeOfReceipt": "lugar de recepción",
    "placeOfDelivery": "lugar de entrega"
  }},
  "cargo": {{
    "containerNumber": "número de contenedor",
    "sealNumber": "número de sello",
    "packages": número de paquetes,
    "description": "descripción de la carga",
    "grossWeightKg": peso bruto en kg,
    "volumeCbm": volumen en metros cúbicos
  }},
  "freight": {{
    "basis": "base del flete",
    "rate": tarifa del flete,
    "prepaid": flete prepagado,
    "collect": flete por cobrar,
    "total": total del flete
  }},
  "declaredValueUSD": valor declarado en USD,
  "numberOfOriginals": número de originales,
  "shipmentDate": "fecha de embarque en formato YYYY-MM-DD (ejemplo: 2021-12-15)"
}}

IMPORTANTE PARA FECHAS: 
- Si encuentras una fecha, conviértela al formato YYYY-MM-DD
- Si no hay fecha clara, usa null
- Ejemplos válidos: "2021-12-15", "2023-05-20", null

Si no encuentras alguna información, usa null o una cadena vacía según corresponda.

Texto del PDF:
{text}

RESPONDE SOLO CON EL JSON VÁLIDO, SIN MARKDOWN, SIN TEXTO ADICIONAL.
`;

    return PromptTemplate.fromTemplate(template);
};

// Parser para el resultado JSON
export const createJSONParser = () => {
    return new StringOutputParser();
}; 