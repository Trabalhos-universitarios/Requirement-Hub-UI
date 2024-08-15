import {Injectable} from "@angular/core";
import {BehaviorSubject, firstValueFrom, Observable} from "rxjs";
import {FormGroup} from "@angular/forms";
import {environmentLocal} from "../../../environment/environment-local";
import {HttpClient} from "@angular/common/http";
import {ProjectDataModel} from "../../models/project-data-model";


@Injectable({
    providedIn: 'root'
})
export class ProjectsService {

    private formGroupSource = new BehaviorSubject<FormGroup | null>(null);
    currentForm = this.formGroupSource.asObservable();

    private baseUrl = environmentLocal.springUrl

    constructor(private http: HttpClient) {
    }

    async getProjects(): Promise<ProjectDataModel[]> {
        return firstValueFrom(this.http.get<ProjectDataModel[]>(`${this.baseUrl}/project/all`));
    }

    //SERVIÇOS DO FORMULÁRIO
    updateForm(formGroup: FormGroup) {
        this.formGroupSource.next(formGroup);
    }

    createProject(post: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/project`, post);
    }

    deleteProject(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/project/${id}`);
    }
}
