import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectsTableService {

  public currentProject = ''
  public currentIdProject : number = 0;

  constructor() { }

  setCurrentProjectByName(value : string){
    this.currentProject = value;
  }

  getCurrentProjectByName(){
    return this.currentProject;
  }

  setCurrentProjectById(value : number){
    this.currentIdProject = value;
  }

  getCurrentProjectById(){
    return this.currentIdProject;
  }
}
