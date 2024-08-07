export interface ProjectDataModel {
    name: string,
    manager: string,
    status: string;
    description?: string;
    version?: string;
    creationDate?: Date;
    lastUpdate?: Date;
    draft?: string;
    actions: string;
    description?: string
}