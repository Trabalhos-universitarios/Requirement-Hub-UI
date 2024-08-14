export interface ArtifactProjectDataModel {
    id?: string;
    name: string;
    file: {
        filename: string,
        originalname:string,
        mimetype: string,
        size: number,
        content: string
    },
    projectId: string
}