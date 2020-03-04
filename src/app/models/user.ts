export interface User {
    id: string
    ts: string

    firstName: string
    lastName: string

    email: string
    verified: boolean

    password: string
    phone: string

    is2FA: boolean

}