import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddArtifactProjectComponent } from 'src/app/components/modals/artifacts/add-artifact-project/add-artifact-project.component';
import { ArtifactProjectDataModel } from 'src/app/models/artifact-project-model';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-artifacts-project-table',
  templateUrl: './artifacts-project-table.component.html',
  styleUrls: ['./artifacts-project-table.component.scss']
})
export class ArtifactsProjectTableComponent {

  dataSource = new MatTableDataSource<ArtifactProjectDataModel>;

  displayedColumns: string[] =
        [
            'name',
            'filename',
            'size',
            'actions'
        ];

  constructor(protected themeService: ThemeService,
              private localStorage : LocalStorageService,
              private dialog: MatDialog
  ){}

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

  isPermited(){
    if(this.localStorage.getItem('role') == "GERENTE_DE_PROJETOS" ||
    this.localStorage.getItem('role') == "ANALISTA_DE_REQUISITOS" ||
    this.localStorage.getItem('role') == "ANALISTA_DE_NEGOCIO"){
        return false;
    }
    return true;
}

openDialog(action?: string) {
    switch (action) {
        case 'Download':
            //baixar o conteudo
            break;
        case 'Delete artifact':
             // Dialogo delete projeto
            break;
       default:
            console.error("This dialog non exists!")
    }
  }
  
}
