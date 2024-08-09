import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectsTableService {

  public currentProject = ''
  public currentIdProject : number = 0;

  constructor() { }

  setCurrentProject(value : string){
    this.currentProject = value;
  }

  getCurrentProject(){
    return this.currentProject;
  }

  setCurrentIdProject(value : number){
    this.currentIdProject = value;
  }

  getCurrentIdProject(){
    return this.currentIdProject;
  }
}
