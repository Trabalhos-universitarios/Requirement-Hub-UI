import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ArtifactResponseModel } from 'src/app/models/artifact-response-model';
import { RequirementsDataModel } from 'src/app/models/requirements-data-model';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';
import { ArtifactService } from 'src/app/services/requirements/artifacts/artifact.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { AlertService } from 'src/app/services/sweetalert/alert.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-artifacts-requirements-table',
  templateUrl: './artifacts-requirements-table.component.html',
  styleUrls: ['./artifacts-requirements-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ArtifactsRequirementsTableComponent {
  
  dataSource = new MatTableDataSource<ArtifactResponseModel>();
  expandedElement: ArtifactResponseModel | null = null;

    displayedColumns: string[] =
        [
            'name',
            'filename',
            'size',
            'actions',
        ];

    constructor(protected themeService: ThemeService,
                private localStorage: LocalStorageService,
                private dialog: MatDialog,
                private artifactRequirementService: ArtifactService,
                private alertService: AlertService,
                private spinnerService: SpinnerService,
                private sanitizer: DomSanitizer,
                @Inject(MAT_DIALOG_DATA) public data: RequirementsDataModel) {
        this.getData().then();
    }

    async getData() {
        this.spinnerService.start()
        this.artifactRequirementService.getArtifactByRequirementId(this.data.id)
            .then(artifacts => {
                this.dataSource.data= artifacts;
                artifacts.forEach((element, index) => {
                    if (element.file !== undefined) {
                        const file =  JSON.parse(element.file)
                        this.dataSource.data[index].file = file;
                      }
                    console.log(`Index: ${index}, Element:`, element);
                  });
                this.spinnerService.stop();
            });

           
    }

    formatSize(sizeInBytes: number): string {
        return (sizeInBytes / 1024).toFixed(2) + ' KB';
    }

    sanitizeHtml(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    stylesIconColor(iconName: string) {
        let colorIcon: string = '#616161';
        if (this.themeService.isDarkMode()) {
            colorIcon = '#e0e0e0';
        }
        switch (iconName) {
            case "border_color":
                return {color: colorIcon};
            case "delete_forever":
                return {color: colorIcon};
            case "info":
                return {color: colorIcon};
            case "add_circle":
                return {color: colorIcon};
            default:
                return {color: '#f44336'};
        }
    }

    isPermited() {
        if (this.localStorage.getItem('role') == "GERENTE_DE_PROJETOS" ||
            this.localStorage.getItem('role') == "ANALISTA_DE_REQUISITOS" ||
            this.localStorage.getItem('role') == "ANALISTA_DE_NEGOCIO") {
            return false;
        }
        return true;
    }

    async downloadArtifact(id: number) {
      try {
          const response = await this.artifactRequirementService.getArtifactByIdentifierArtifact(id);

          // Verifique se a resposta possui a estrutura esperada
          if (response && response.file) {
              // Converter a resposta para um objeto JSON
              const file = JSON.parse(response.file);

              console.log("file: ", file)

              // Verifique se o objeto `file` possui a propriedade `content`
              if (file && file.content) {
                  // Decodificar o conteúdo base64
                  const byteCharacters = atob(file.content.split(',')[1]);
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);

                  // Criar um blob a partir do array de bytes
                  const blob = new Blob([byteArray], { type: file.type });

                  // Criar um link temporário para download
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = file.name;
                  link.click();

                  // Liberar o URL criado
                  URL.revokeObjectURL(link.href);
              } else {
                  console.error('O arquivo não contém a propriedade "content".');
              }
          } else {
              console.error('A resposta não contém o arquivo esperado.');
          }
      } catch (error) {
          console.error('Error downloading the file', error);
      }
  }

    async visualizarArtifact(id: number, fileName: string) {
        this.alertService.toInfoAlert("Visualização do arquivo","O arquivo será aberto pelo navegador");
        const response = await this.artifactRequirementService.getArtifactByIdentifierArtifact(id);

          // Verifique se a resposta possui a estrutura esperada
          if (response && response.file) {
              // Converter a resposta para um objeto JSON
              const file = JSON.parse(response.file);

              console.log("file: ", file)

              // Verifique se o objeto `file` possui a propriedade `content`
              if (file && file.content) {
                  // Decodificar o conteúdo base64
                  const byteCharacters = atob(file.content.split(',')[1]);
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);

                  // Criar um blob a partir do array de bytes
                  const blob = new Blob([byteArray], { type: file.type });

                    const fileType = file.name.split('.').pop()?.toLowerCase();
                    const url = window.URL.createObjectURL(blob);
                    
                    if (fileType === 'pdf' || ['png', 'jpg', 'jpeg', 'gif'].includes(fileType!)) {
                        window.open(url, '_blank');
                    } else {
                        console.error("Formato não suportado para visualização");
                        this.alertService.toErrorAlert('Erro', "Formato de arquivo não suportado para visualização.");
                    }
                  } else {
                    console.error('A resposta não contém o arquivo esperado.');
                }
          }else {
            console.error('A resposta não contém o arquivo esperado.');
        }
    }

  deleteArtifact(id: number) {
    this.artifactRequirementService.deleteArtifactById(id)
      .subscribe({
        next: () => {
            this.alertService.toSuccessAlert(`Artefato ${id} deletado com sucesso.`);
            this.dialog.closeAll();
        },
        error: (error) => {
          console.error("Erro ao deletar o artefato:", error);
        }
      });
  }
}

