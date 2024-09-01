export interface ProjectDataModel {
    id: number,
    name: string,
    manager: string,
    status: string;
    version?: string;
    creationDate?: Date;
    lastUpdate?: Date;
    draft?: string;
    actions: string;
}