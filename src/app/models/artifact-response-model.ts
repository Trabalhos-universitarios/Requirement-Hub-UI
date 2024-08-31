export interface ArtifactResponseModel {
    id?: string;
    name: string;
    fileName: string,
    size: any,
    type: string,
    contentBase64: string,
    projectId: string
    identifier: string;
    description: string;
    file: string;
    requirementId?: any;
}
