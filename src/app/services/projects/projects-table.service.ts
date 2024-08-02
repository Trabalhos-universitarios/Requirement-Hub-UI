import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectsTableService {

  public currentProject = ''

  constructor() { }

  setCurrentProject(value : string){
    this.currentProject = value;
  }

  getCurrentProject(){
    return this.currentProject;
  }
}
