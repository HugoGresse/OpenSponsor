import { FieldValue } from 'firebase/firestore'

export type Sponsor = {
    id: string
    name: string
    logo: string
    website: string
    createdAt: FieldValue
    updatedAt: FieldValue
}

export type Sponsors = Sponsor[]

export type Project = {
    id: string
    url: string
    name: string
    sponsorIds: string[]
    projectJsonUrl: string
    createdAt: FieldValue
    updatedAt: FieldValue
}

export type Projects = Project[]

export type Scope = {
    id: string
    name: string
    owner: string
    members: string[]
    projects: Projects
    sponsors: Sponsors
    scopeJsonUrl: string
    createdAt: FieldValue
    updatedAt: FieldValue
}
