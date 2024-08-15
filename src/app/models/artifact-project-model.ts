export interface ArtifactProjectDataModel {
    id?: string;
    name: string;
    file: {
        fileName: string,
        size: any,
        type: string,
        contentBase64: any
    },
    projectId: string
}