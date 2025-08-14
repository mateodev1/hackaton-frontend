

export interface TrackingResponse {
    error: null,
    data: {
        error: null,
        data: {
            course: number,
            speed: number,
            latitude: number,
            longitude: number,
            timestamp: string,
            originalResponse: {
                shipId: number,
                lat: number,
                lon: number,
                speed: number,
                course: number,
                heading: number,
                rateOfTurn: number,
                draught: number,
                timestamp: number,
                timezone: number,
                navigationalStatus: string,
                stationId: number,
                stationType: string,
                stationName: string,
                operatorName: string,
                areaName: string,
                areaCode: string,
                isVesselInRange: boolean,
                hasNewerSatellitePosition: boolean,
                isEligibleToRequestInmarsat: boolean
            }
        }
    }
}