export interface BillOfLading {
    billOfLadingNumber: string;         // "KKLU54861"
    bookingNumber?: string;             // Si está disponible
    shipper: {
        name: string;                     // "Los Frutales S.A.C"
        address: string;                  // "AV. EL EJERCITO 4567 ATE VITARTE – LIMA - PERÚ"
    };
    consignee: {
        name: string;                     // "Frutos Mágicos S.A"
        address: string;
    };
    notifyParty?: {
        name: string;
        address: string;
    };
    forwardingAgent?: {
        name: string;
        address?: string;
        phone?: string;
    };
    vessel: {
        name: string;                     // "MAERKS ALABAMA"
        voyageNumber?: string;            // "V/24"
        flag?: string;
    };
    ports: {
        portOfLoading: string;           // "Callao - Perú"
        portOfDischarge: string;         // "Miami"
        placeOfReceipt?: string;
        placeOfDelivery?: string;
    };
    cargo: {
        containerNumber?: string;
        sealNumber?: string;
        packages: number;                // 500
        description: string;             // "Prendas de vestir: camisas, pantalones"
        grossWeightKg?: number;
        volumeCbm?: number;
    };
    freight?: {
        basis?: string;
        rate?: number;
        prepaid?: number;                 // $2500
        collect?: number;
        total?: number;                   // $2800
    };
    declaredValueUSD?: number;
    numberOfOriginals?: number;        // 3
    shipmentDate?: string;             // "2021-12-15"
}
