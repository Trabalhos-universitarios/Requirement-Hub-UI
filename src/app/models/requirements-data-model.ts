export interface RequirementsDataModel {
    id?: number
    identifier: string;
    name: string;
    author: number;
    createdDate?: string;
    priority: string;
    risk?: string
    type: string;
    version: string;
    status?: string;
    description: string;
    stakeholderIds: string[];
    responsibleIds: number[];
    effort: string;
    dependencyIds: number[];
    projectId?: number[];
    artifactIds?: number[];

}