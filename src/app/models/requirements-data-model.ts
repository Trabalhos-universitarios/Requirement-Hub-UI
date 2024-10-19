export interface RequirementsDataModel {
    id?: number
    identifier: string;
    name: string;
    author?: number;
    dateCreated?: string;
    modification_date?: string;
    priority: string;
    risk?: string
    type: string;
    version: string;
    status?: string;
    description: string;
    stakeholderIds: string[];
    responsibleIds: string[];
    effort: string;
    developerAssigned?: number;
    dependencyIds: number[];
    projectId?: number[];
    artifactIds?: number[];
    relationsData?: string;
}