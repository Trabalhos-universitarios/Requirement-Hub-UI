export interface CreateProjectDataModel {
    name: string,
    manager: string,
    description: string;
    requirementAnalysts: string[],
    businessAnalysts: string[],
    commonUsers: string[]
    creationDate: Date;
    version: string;
    status: string;
    lastUpdate?: Date;
    draft?: string;
    actions: string;
}