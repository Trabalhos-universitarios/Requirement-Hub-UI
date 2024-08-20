export interface RequirementsDataModel {
    id?: string
    identifier: string;
    name: string;
    author: number;
    createdDate?: string;
    priority: string;
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