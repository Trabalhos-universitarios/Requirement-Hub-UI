export interface ProjectDataModel {
    id: string,
    name: string,
    manager: string,
    status: string;
    version?: string;
    creationDate?: Date;
    lastUpdate?: Date;
    draft?: string;
    actions: string;
}