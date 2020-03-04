import { Report } from './report';

export interface Alert {
    id: string
    projectID: string
    ts: string

    conditionType: string

    report: Report
    reportID: string

    message: string
    link: string

    emailList: string[]

    isAcknowledged: boolean
    acknowledgedTime: string
    acknowledgedComment: string
    acknowledgedAuthor: string
}
