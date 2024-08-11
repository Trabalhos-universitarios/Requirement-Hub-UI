import {Injectable} from '@angular/core';
import {environmentLocal} from "../../../environment/environment-local";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {UserResponseModel} from "../../models/user-model";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = environmentLocal.springUrl

  constructor(private http: HttpClient) {}

  async getManager(): Promise<UserResponseModel[]> {
    return firstValueFrom(this.http.get<UserResponseModel[]>(`${this.baseUrl}/user/managers`));
  }

  async getRequirementAnalysts(): Promise<UserResponseModel[]> {
    return firstValueFrom(this.http.get<UserResponseModel[]>(`${this.baseUrl}/user/requirement-analysts`))
  }

  async getBusinessAnalysts(): Promise<UserResponseModel[]> {
    return firstValueFrom(this.http.get<UserResponseModel[]>(`${this.baseUrl}/user/business-analysts`))
  }

  async getCommonUsers(): Promise<UserResponseModel[]> {
    return firstValueFrom(this.http.get<UserResponseModel[]>(`${this.baseUrl}/user/common-users`))
  }

  async getUsers(): Promise<UserResponseModel[]> {
    return firstValueFrom(this.http.get<UserResponseModel[]>(`${this.baseUrl}/user/all`))
  }
}
