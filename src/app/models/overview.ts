export interface Overview {
    projectID: string
    primaryPolicy: string
    ts: string

    reportQuotaLimit: number
    planName: string

    totalPolicies: number

    totalReports: number
    totalReportsMonth: number
    totalReportsDay: number
    totalReportsQuota: number

    totalOpenAlerts: number

    totalBuilderRecommendations: number
    totalInlineRecommendations: number
    totalEvalRecommendations: number
    totalEvaluationRecommendations: number

    firstReport: string
    lastReport: string
}

