import {ShipmentFormValues} from "@/app/rrr/shipment-form/schema";

export class FieldError extends Error {

    field: string

    constructor(
        field: keyof ShipmentFormValues,
        message: string
    ) {
        super(message);
        this.field = field
        this.name = 'FieldError'
    }


}


export async function createShipment(shipment: any) {
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (shipment.email.endsWith('@blocked.com')) {
        throw new FieldError('email', "Ten adres email jest zablokowany")
    }
    if (shipment.senderName.trim().toLowerCase() === "error") {
        throw new Error("Serwer niedostępny, spróbuj ponownie")
    }

    return {trackingNumber: Math.random()}
}