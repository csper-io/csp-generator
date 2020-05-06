import { Report } from './report';

export interface Project {
    id: string
    name: string
    ts: string

    organizationID: string
    organizationName: string
    organizationPlanName: string

    primaryPolicy: string

    dailyEmailList: string[]

    members: Member
    invites: Member[]

    // Aggregations
    billingCycleStart: string
    reportCountBillingCycle: number
    reportCount: number
    lastReport: Report
    openAlertEvents: number
}

export interface Member {
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
