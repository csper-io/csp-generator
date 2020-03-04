export interface Policy {
    id: string

    projectID: string
    dla: string
    ts: string

    name: string
    isHidden: boolean

    policy: string

    // stats
    firstSeenReport: string
    lastSeenReport: string
    count: number
    unique: number

    // newPolicy
    makePrimary: boolean
}