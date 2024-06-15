import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {

  private URL = 'http://localhost:8180/artifacts'; // URL para o servidor de upload


  constructor() { }
}
