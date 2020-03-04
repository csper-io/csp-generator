export interface Project {
    id: string
    name: string
    ts: string

    primaryPolicy: string

    planName: string
    reportQuotaLimit: number
    subscriptionID: string
    customerID: string
    checkoutSessionID: string

    dailyEmailList: string[]
    newReportAlertEmailList: string[]

    members: Membership[]
    invites: Membership[]
}

interface Membership {
    email: string
    role: string

    inviter: string
}

export interface ProjectInvite {
    projectID: string
    ts: string

    token: string
    isActive: boolean
    isOneTimeUse: boolean

}
