import {Injectable} from '@angular/core';
import {environmentLocal} from "../../../environment/environment-local";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {UserResponseModel} from "../../models/user-model";
import { TeamResponseModel } from 'src/app/models/user-team-model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = environmentLocal.springUrl

  constructor(private http: HttpClient) {}

  async createUser(userData: any): Promise<UserResponseModel> {
    return firstValueFrom(
      this.http.post<UserResponseModel>(`${this.baseUrl}/auth/register`, userData)
    );
  }

  async deleteUser(id: string): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.baseUrl}/auth/${id}`));
}

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

  async getUserById(id: number | undefined): Promise<UserResponseModel> {
    return firstValueFrom(this.http.get<UserResponseModel>(`${this.baseUrl}/user/${id}`))
  }

  async getTeam(id: number): Promise<TeamResponseModel[]> {
    return firstValueFrom(this.http.get<TeamResponseModel[]>(`${this.baseUrl}/team/${id}`))
  }

  async updateUserImage(id: number | undefined, imageBase64: string): Promise<any> {
    return firstValueFrom(this.http.patch<any>(`${this.baseUrl}/user/${id}/image`, imageBase64));
  }
}
