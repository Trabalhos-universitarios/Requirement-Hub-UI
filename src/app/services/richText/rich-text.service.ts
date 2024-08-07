import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RichTextService {
  private contentSource = new BehaviorSubject<string>('');
  currentContent = this.contentSource.asObservable();

  constructor() {}

  changeContent(content: string) {
    this.contentSource.next(content);
  }
}
