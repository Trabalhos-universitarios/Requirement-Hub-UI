import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {ImageCropperComponent} from "./image-cropper/image-cropper.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent {
  file: string = '';

  constructor(private dialog: MatDialog) {}

  onFileChange(event: any) {
    const files = event.target.files as FileList;
    if (files.length > 0) {
      const _file = URL.createObjectURL(files[0]);
      this.resetInput();
      this.openAvatarEditor(_file)
          .subscribe((result) => {
            if (result) {
              this.file = result;
            }
          });
    }
  }

  openAvatarEditor(image: string): Observable<any> {
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: image,
    });
    return dialogRef.afterClosed();
  }

  resetInput() {
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }
}
