export interface CreateCommentsMessagesResponseModel {
    id: number,
    description: string,
    requirementId: any,
    userId: any,
    userName: string,
    userRole: string,
    dateCreated: string,
    hourCreated?: string,
    reactions: string[],
    userImage: string
}

export interface SearchCommentsMessagesModel {
    id: number,
    description: string,
    requirementId: any,
    dateCreated?: string,
    hourCreated?: string,
    userId: any,
    userName: string,
    userImage: string,
    userRole: string,
    reactions: ReactionsResponseModel[];
}

export interface ReactionsResponseModel {
    id?: number,
    commentId: number,
    userId: string,
    emoji: string
}

export interface CommentsReactionsModel {
    user: any,
    reactions: CommentsReactionsResponseModel
}

export interface CommentsReactionsResponseModel {
    reaction: string
}
