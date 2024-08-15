import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ArtifactProjectDataModel } from 'src/app/models/artifact-project-model';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';
import { ArtifactProjectService } from 'src/app/services/projects/artifacts/artifact-project.service';
import { ProjectsTableService } from 'src/app/services/projects/projects-table.service';
import { AlertService } from 'src/app/services/sweetalert/alert.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-artifacts-project-table',
  templateUrl: './artifacts-project-table.component.html',
  styleUrls: ['./artifacts-project-table.component.scss']
})
export class ArtifactsProjectTableComponent {

  dataSource = new MatTableDataSource<ArtifactProjectDataModel>();

  displayedColumns: string[] =
        [
            'name',
            'filename',
            'size',
            'actions'
        ];

  constructor(protected themeService: ThemeService,
              private localStorage : LocalStorageService,
              private dialog: MatDialog,
              private artifactProjectService: ArtifactProjectService,
              private projectsTableService: ProjectsTableService,
              private alertService: AlertService )
              {this.getData();}
        
  getData() {
      this.artifactProjectService.getArtifactByProjectId(this.projectsTableService.getCurrentIdProject())
            .then(artifacts => {
              console.log(artifacts);
              this.dataSource.data = artifacts;
          });
  }

  formatSize(sizeInBytes: number): string {
    return (sizeInBytes / 1024).toFixed(2) + ' KB';
  }
        
  stylesIconColor(iconName: string) {
    let colorIcon: string = '#616161';
    if (this.themeService.isDarkMode()) {
        colorIcon = '#e0e0e0';
    }
    switch (iconName) {
        case "border_color":
            return { color: colorIcon };
        case "delete_forever":
            return { color: colorIcon };
        case "info":
            return { color: colorIcon };
        case "add_circle":
            return { color: colorIcon };
        default:
            return { color: '#f44336' };
    }
  }

  isPermited(){
        if(this.localStorage.getItem('role') == "GERENTE_DE_PROJETOS"){
            return false;
        }
        return true;
  }

  downloadArtifact(id: number){
    this.artifactProjectService.getDownloadArtifactById(id)
      .subscribe({
        next: (blob) => {
          this.download(blob, id);
        },
        error: (error) => {
          console.error("Erro ao realizar o download:", error);
        }
      });
  }

  download(blob: Blob, id: number) {
    // Obtenha o nome do arquivo (opcional)
    const fileName = `arquivo_${id}`;

    // Crie uma URL temporária para o Blob
    const url = window.URL.createObjectURL(blob);

    // Crie um elemento <a> para iniciar o download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // Nome do arquivo para o download
    document.body.appendChild(a);
    a.click();

    // Limpar recursos temporários
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  deleteArtifact(id: number) {
    this.artifactProjectService.deleteArtifactById(id)
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
