export interface CreateProjectDataModel {
    name: string,
    manager: string,
    requirementAnalysts: string[],
    businessAnalysts: string[],
    commonUsers: string[]
    creationDate: Date;
    version: string;
    status: string;
    actions: string;
}