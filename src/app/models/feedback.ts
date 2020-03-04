export interface Feedback {
    id : string 
    projectID : string

    isProjectCancel : boolean

    feedback : string 
    canEmail : boolean
    email : string 
}
