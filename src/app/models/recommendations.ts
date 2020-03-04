import { Report } from './report';

export interface Recommendations {
	projectID: string
	policyID: string

	currentPolicy: string
	suggestedPolicy: string

	recommendationsFromParsing: Recommendation[]
	recommendationsFromPolicy: Recommendation[]
	recommendations: Recommendation[]
}

interface Recommendation {
	title: string
	severity: string

	directive: string
	source: string


	message: string
	recommendation: string

	docs: string
	docsTitle: string

	selectedOption: string
	options: RecommendationOption[]
	report: Report
}

interface RecommendationOption {
	key: string
	label: string

	isRecommended: boolean
	isSelectable: boolean
}

// type ParsedPolicy struct {
// 	Policy string `json:"policy"`

// 	Directives     map[string][]string `json:"directives"`
// 	DirectiveOrder []string            `json:"directiveOrder"`

// 	SourceMapping map[string]string `json:"sourceMapping"`
// }

export interface ParsedPolicy {
	policy: string

	directives: Map<string, string[]>
	directiveOrder: string[]
	sourceMapping: Map<string, string>
}

export interface Evaluation {
	id: string
	ts: string

	projectID: string
	policyID: string

	isURL: boolean
	URL: string
	isHidden: boolean

	mode: string
	parsedPolicy: ParsedPolicy

	disposition: string
	source: string

	policies: string[]
	recommendations: Recommendation[]

	stats: Stats
}

interface Stats {
	totalHigh: number
	totalMedium: number
	totalLow: number
	totalInfo: number
}

export interface BuilderRecommendations {
	projectID: string
	policyID: string

	recommendedPolicy: string
	recommendedPolicyParsed: ParsedPolicy

	originalPolicy: string
	originalPolicyParsed: ParsedPolicy

	recommendations: BuilderRecommendation[]
}

interface BuilderRecommendation {
	isAccepted: boolean
	isIgnored: boolean

	directive: string
	url: string
	reportHashes: string[]
	reportURLs: string[]
	reportCount: number
}
