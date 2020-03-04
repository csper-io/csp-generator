export interface BlogPost {
    id: string
    ts: string

    number: number
    title: string
    slug: string
    description: string
    category: string

    coverImage: string

    content: BlogContent[]

    isPublic: boolean
}

interface BlogContent {
    contentType: string
    textText: string

    titleSize: number
    titleText: string

    videoURL: string

    htmlHTML: string

    policyPolicyStr: string
    tocTOC: TableOfContents[]
}

interface TableOfContents {
    title: string
    id: string
    children: TableOfContents[]
}