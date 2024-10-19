import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {BehaviorSubject, catchError, firstValueFrom, Observable, throwError} from "rxjs";
import {RequirementsDataModel} from "../../models/requirements-data-model";
import {environmentLocal} from "../../../environment/environment-local";
import {ArtifactResponseModel} from 'src/app/models/artifact-response-model';

@Injectable({
    providedIn: 'root'
})
export class RequirementsService {

    private _currentForm = new BehaviorSubject<any>({});
    currentForm = this._currentForm.asObservable();
    _verificationsFormValid = new BehaviorSubject<any>({});
    verificationsFormValid = this._verificationsFormValid.asObservable();
    private baseUrl = environmentLocal.springUrl;

    constructor(private http: HttpClient) {}

    verifierFormValid(formValid: boolean) {
        this._verificationsFormValid.next(formValid);
    }

    updateForm(formValue: RequirementsDataModel | any) {
        this._currentForm.next(formValue);
    }

    async getRequirementById(requirementId: number | undefined): Promise<RequirementsDataModel[]> {
        return firstValueFrom(this.http.get<RequirementsDataModel[]>(`${this.baseUrl}/requirements/requirement-id/${requirementId}`))
    }

    async getRequirementsByIdsList(ids: number[]): Promise<RequirementsDataModel[]> {
        return firstValueFrom(this.http.get<RequirementsDataModel[]>(`${this.baseUrl}/requirements/requirement-id`,
            { params: { ids: ids.join(',') } }));
    }

    async getRequirementsByProjectId(projectId: number): Promise<RequirementsDataModel[]> {
        return firstValueFrom(this.http.get<RequirementsDataModel[]>(`${this.baseUrl}/requirements/byproject/${projectId}`))
    }

    async createRequirements(post: any): Promise<RequirementsDataModel[] | any> {
        return firstValueFrom(
            this.http.post(`${this.baseUrl}/requirements`, post).pipe(
                catchError((error: HttpErrorResponse) => {

                    switch (error.status) {
                        case 409:
                            return throwError(() => HttpStatusCode.Conflict);
                        case 404:
                            return throwError(() => HttpStatusCode.NotFound);
                        case 405:
                            return throwError(() => HttpStatusCode.MethodNotAllowed);
                        case 500:
                            return throwError(() => HttpStatusCode.InternalServerError);
                        case 503:
                            return throwError(() => HttpStatusCode.ServiceUnavailable);
                        default:
                            return throwError(() => new Error(error.message));
                    }
                })
            )
        );
    }

    async createAndSendToApprovalFlow(post: any): Promise<RequirementsDataModel[] | any> {
        return firstValueFrom(
            this.http.post(`${this.baseUrl}/requirements/flow`, post).pipe(
                catchError((error: HttpErrorResponse) => {

                    switch (error.status) {
                        case 409:
                            return throwError(() => HttpStatusCode.Conflict);
                        case 404:
                            return throwError(() => HttpStatusCode.NotFound);
                        case 405:
                            return throwError(() => HttpStatusCode.MethodNotAllowed);
                        case 500:
                            return throwError(() => HttpStatusCode.InternalServerError);
                        case 503:
                            return throwError(() => HttpStatusCode.ServiceUnavailable);
                        default:
                            return throwError(() => new Error(error.message));
                    }
                })
            )
        );
    }

    async updateRequirements(id: number | undefined, post: any): Promise<RequirementsDataModel[] | any> {
        return firstValueFrom(this.http.put(`${this.baseUrl}/requirements/${id}`, post)
            .pipe(catchError((error: HttpErrorResponse) => {

                    switch (error.status) {
                        case 404:
                            return throwError(() => HttpStatusCode.NotFound);
                        case 405:
                            return throwError(() => HttpStatusCode.MethodNotAllowed);
                        case 500:
                            return throwError(() => HttpStatusCode.InternalServerError);
                        case 503:
                            return throwError(() => HttpStatusCode.ServiceUnavailable);
                        default:
                            return throwError(() => new Error(error.message));
                    }
                })
            )
        );
    }

    async sendToApprovalFlowRequirementId(id?: number): Promise<any> {
        return firstValueFrom(
            this.http.patch(`${this.baseUrl}/requirements/flow/${id}`, null).pipe(
                catchError((error: HttpErrorResponse) => {
                    switch (error.status) {
                        case 404:
                            return throwError(() => HttpStatusCode.NotFound);
                        case 405:
                            return throwError(() => HttpStatusCode.MethodNotAllowed);
                        case 500:
                            return throwError(() => HttpStatusCode.InternalServerError);
                        default:
                            return throwError(() => new Error(error.message));
                    }
                })
            )
        );
    }

    async blockedRequirement(id?: number): Promise<any> {
        return firstValueFrom(
            this.http.patch(`${this.baseUrl}/requirements/blocked/${id}`, null).pipe(
                catchError((error: HttpErrorResponse) => {

                    switch (error.status) {
                        case 409:
                            return throwError(() => HttpStatusCode.Conflict);
                        case 404:
                            return throwError(() => HttpStatusCode.NotFound);
                        case 405:
                            return throwError(() => HttpStatusCode.MethodNotAllowed);
                        case 500:
                            return throwError(() => HttpStatusCode.InternalServerError);
                        case 503:
                            return throwError(() => HttpStatusCode.ServiceUnavailable);
                        default:
                            return throwError(() => new Error(error.message));
                    }
                })
            )
        );
    }

    async deleteRequirement(id: number): Promise<any> {
        return firstValueFrom(this.http.delete(`${this.baseUrl}/requirements/${id}`));
    }

    async getAllRequirementResponsible(): Promise<any> {
        return firstValueFrom(this.http.get(`${this.baseUrl}/requirements/all-responsibles`).pipe(
            catchError((error: HttpErrorResponse) => {
                switch (error.status) {
                    case 404:
                        return throwError(() => HttpStatusCode.NotFound);
                    case 500:
                        return throwError(() => HttpStatusCode.InternalServerError);
                    default:
                        return throwError(() => new Error(error.message));
                }
            })
        ));
    }

    async refuseRequirement(id: number | undefined, comment: any): Promise<any> {
        return firstValueFrom(
            this.http.patch<any>(`${this.baseUrl}/requirements/refuse/${id}`, comment).pipe(
                catchError((error: HttpErrorResponse) => {

                    switch (error.status) {
                        case 409:
                            return throwError(() => HttpStatusCode.Conflict);
                        case 404:
                            return throwError(() => HttpStatusCode.NotFound);
                        case 405:
                            return throwError(() => HttpStatusCode.MethodNotAllowed);
                        case 500:
                            return throwError(() => HttpStatusCode.InternalServerError);
                        case 503:
                            return throwError(() => HttpStatusCode.ServiceUnavailable);
                        default:
                            return throwError(() => new Error(error.message));
                    }
                })
            )
        );
    }

    async approveRequirement(id: number | undefined, post: any | null): Promise<RequirementsDataModel[] | any> {
        return firstValueFrom(this.http.patch(`${this.baseUrl}/requirements/approve/${id}`, post)
            .pipe(catchError((error: HttpErrorResponse) => {

                    switch (error.status) {
                        case 404:
                            return throwError(() => HttpStatusCode.NotFound);
                        case 405:
                            return throwError(() => HttpStatusCode.MethodNotAllowed);
                        case 500:
                            return throwError(() => HttpStatusCode.InternalServerError);
                        case 503:
                            return throwError(() => HttpStatusCode.ServiceUnavailable);
                        default:
                            return throwError(() => new Error(error.message));
                    }
                })
            )
        );
    }

    async updateRequirementStatus(id: number | undefined, status: string): Promise<any> {
        return firstValueFrom(
            this.http.patch(`${this.baseUrl}/requirements/status/${id}/${status}`, status ).pipe(
                catchError((error: HttpErrorResponse) => {
    
                    switch (error.status) {
                        case 409:
                            return throwError(() => HttpStatusCode.Conflict);
                        case 404:
                            return throwError(() => HttpStatusCode.NotFound);
                        case 405:
                            return throwError(() => HttpStatusCode.MethodNotAllowed);
                        case 500:
                            return throwError(() => HttpStatusCode.InternalServerError);
                        case 503:
                            return throwError(() => HttpStatusCode.ServiceUnavailable);
                        default:
                            return throwError(() => new Error(error.message));
                    }
                })
            )
        );
    }

    async assignDeveloper(id: number | undefined, developerAssigned: string): Promise<any> {
        return firstValueFrom(
            this.http.patch(`${this.baseUrl}/requirements/assign-developer/${id}/${developerAssigned}`, { developerAssigned }).pipe(
                catchError((error: HttpErrorResponse) => {
                    switch (error.status) {
                        case 409:
                            return throwError(() => HttpStatusCode.Conflict);
                        case 404:
                            return throwError(() => HttpStatusCode.NotFound);
                        case 405:
                            return throwError(() => HttpStatusCode.MethodNotAllowed);
                        case 500:
                            return throwError(() => HttpStatusCode.InternalServerError);
                        case 503:
                            return throwError(() => HttpStatusCode.ServiceUnavailable);
                        default:
                            return throwError(() => new Error(error.message));
                    }
                })
            )
        );
    }    
    
}
