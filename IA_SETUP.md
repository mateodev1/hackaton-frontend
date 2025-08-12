# Configuración de IA para Bill of Lading

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
OPENAI_API_KEY=tu_api_key_de_openai_aqui
```

## Obtener API Key de OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys"
4. Crea una nueva API key
5. Copia la key y pégala en el archivo `.env.local`

## Funcionalidades

### Extracción de Información del BOL

-   **Número de BOL**: Identificación única del documento
-   **Remitente y Consignatario**: Información de las partes
-   **Buque y Viaje**: Detalles del transporte marítimo
-   **Puertos**: Origen y destino
-   **Carga**: Descripción, peso, contenedores
-   **Flete**: Costos de transporte

### Proceso

1. Sube un PDF de Bill of Lading
2. El sistema extrae el texto del PDF
3. LangChain + OpenAI analiza el texto
4. Se extrae la información estructurada
5. Se muestra en una interfaz organizada

## Dependencias Instaladas

-   `langchain`: Framework para aplicaciones de IA
-   `@langchain/openai`: Integración con OpenAI
-   `pdf-parse`: Extracción de texto de PDFs

## Uso

1. Configura tu API key de OpenAI
2. Sube un PDF de Bill of Lading
3. El sistema procesará automáticamente el documento
4. Verás la información extraída organizada por secciones
