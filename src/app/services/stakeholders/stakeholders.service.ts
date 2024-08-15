import {Injectable} from '@angular/core';
import {environmentLocal} from "../../../environment/environment-local";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {StakeholdersModel} from "../../models/stakeholders-model";

@Injectable({
  providedIn: 'root'
})
export class StakeholdersService {
  private baseUrl = environmentLocal.springUrl

  constructor(private http: HttpClient) {}

  async getStakeholders(): Promise<StakeholdersModel[]> {
    return firstValueFrom(this.http.get<StakeholdersModel[]>(`${this.baseUrl}/stakeholders`));
  }
}
