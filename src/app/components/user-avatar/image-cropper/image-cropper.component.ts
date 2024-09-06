import {Component, Inject} from '@angular/core';
import Cropper from 'cropperjs';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DomSanitizer} from "@angular/platform-browser";
import {UsersService} from "../../../services/users/users.service";
import {AlertService} from "../../../services/sweetalert/alert.service";
import {SpinnerService} from "../../../services/spinner/spinner.service";
import {reloadPage} from "../../../utils/reload.page";
import {LocalStorageService} from "../../../services/localstorage/local-storage.service";

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent {
  cropper!: Cropper;
  sanitizedUrl: any;
  userId: number | undefined;

  constructor(
      public dialogRef: MatDialogRef<ImageCropperComponent>,
      @Inject(MAT_DIALOG_DATA) public image: string,
      private sanitizer: DomSanitizer,
      private usersService: UsersService,
      private alertService: AlertService,
      private spinnerService: SpinnerService,
      private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.image);
    this.userId = parseInt(localStorage.getItem('id') || '0', 10); // Recupera o ID do usuário do localStorage
  }

  ngAfterViewInit() {
    this.initCropper();
  }

  initCropper() {
    const image = document.getElementById('image') as HTMLImageElement;
    this.cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      guides: false,
    });
  }

  getRoundedCanvas(sourceCanvas: any) {
    const canvas = document.createElement('canvas');
    const context: any = canvas.getContext('2d');
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
    return canvas;
  }

  async crop() {
    const croppedCanvas = this.cropper.getCroppedCanvas();
    const roundedCanvas = this.getRoundedCanvas(croppedCanvas);

    if (roundedCanvas) {
      const croppedImage = roundedCanvas.toDataURL('image/png');
      try {
        if (this.userId) {
          this.spinnerService.start();
          await this.usersService.updateUserImage(this.userId, croppedImage.toString());
          await this.alertService.toSuccessAlert('Imagem atualizada com sucesso!');
          this.dialogRef.close(croppedImage);
          await this.usersService.getUserById(this.userId).then((response) => {
            this.localStorageService.setItem('image', response.image);
          });
          reloadPage();
        } else {
          throw new Error("ID do usuário não encontrado.");
        }
      } catch (error) {
        await this.alertService.toErrorAlert('Erro!', 'Erro ao atualizar a imagem do usuário!');
      } finally {
        this.spinnerService.stop();
      }
    } else {
      this.dialogRef.close(null);
    }
  }

  reset() {
    this.cropper.clear();
    this.cropper.crop();
  }
}