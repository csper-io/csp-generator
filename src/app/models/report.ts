export interface Report {
	id: string
	projectID: string
	policyID: string
	ts: any
	hash: string

	count: number

	blockedURI: string
	disposition: string
	documentURI: string
	effectiveDirective: string
	originalPolicy: string
	referrer: string
	scriptSample: string
	statusCode: string
	violatedDirective: string

	sourceFile: string
	columnNumber: number
	lineNumber: number

	classification: string
	oddities: any

	// If Event
	rawReport: string
	userAgent: string

	os: string
	device: string
	browser: string
}

