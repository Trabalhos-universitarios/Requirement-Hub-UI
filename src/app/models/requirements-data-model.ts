export interface RequirementsDataModel {
    id?: number
    identifier: string;
    name: string;
    author: number;
    dateCreated?: string;
    priority: string;
    risk: string,
    type: string;
    version: string;
    status?: string;
    description: string;
    stakeholders: string[];
    responsible: string;
    effort: string;
    dependencies: number[];
    projectId?: number[];
    artifactIds?: number[];
}