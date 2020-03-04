export interface Invoice {
    id: string

    total: number
    attemptCount: number

    customerID: string
    customerEmail: string

    invoiceURL: string

    created: number
    nextPaymentAttempt: number

    lines: InvoiceLine[]
}

interface InvoiceLine {
    amount: number
    description: string
}
