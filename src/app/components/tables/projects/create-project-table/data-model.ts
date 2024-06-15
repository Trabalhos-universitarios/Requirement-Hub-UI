export interface DataModel {
    nameProject: string,
    nameProjectManager: string,
    nameRequirementAnalyst: string[],
    nameBusinessAnalyst: string[],
    nameCommonUser: string[]
    creationDate: Date;
    version: string;
    status: string;
    actions: string;
}