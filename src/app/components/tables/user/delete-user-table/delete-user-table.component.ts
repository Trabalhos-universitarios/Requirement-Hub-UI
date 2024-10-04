import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserResponseModel } from 'src/app/models/user-model';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { AlertService } from 'src/app/services/sweetalert/alert.service';
import { UsersService } from 'src/app/services/users/users.service';
import { reloadPage } from "../../../../utils/reload.page";
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';
import { ProjectDataModel } from 'src/app/models/project-data-model';

@Component({
  selector: 'app-delete-user-table',
  templateUrl: './delete-user-table.component.html',
  styleUrls: ['./delete-user-table.component.scss']
})
export class DeleteUserTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'role', 'delete'];
  dataSource = new MatTableDataSource<UserResponseModel>();
  users?: UserResponseModel[];
  preSelectedUserIds: string[] = [];
  projects = new MatTableDataSource<ProjectDataModel>([]);

  constructor(private userService: UsersService,
              private alertService: AlertService,
              private spinnerService: SpinnerService,
              private projectsService: ProjectsService,
              private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.spinnerService.start();
    this.userService.getUsers()
      .then(resp => {
        this.users = resp.filter(user => user.role.trim().toUpperCase() !== "ADMIN");
        this.dataSource.data = this.users;
        this.spinnerService.stop();
      })
      .catch(error => {
        this.spinnerService.stop();
        console.error(`Error : ${error} -> ${error.message}`);
      });
  }

  async deleteUser(element: UserResponseModel) {
    const result = await this.alertService.toOptionalActionAlert(
      "Deletar usuario",
      "Deseja realmente deletar o usuário?",
        "Sim, deletar!"
    );

    if (result.isConfirmed) {
      if (element.role === 'GERENTE_DE_PROJETOS') {
        this.spinnerService.start();
        const isManager = await this.isUserManagerOfAnyProject(element);
        if (isManager) {
          this.spinnerService.stop();
          await this.alertService.toErrorAlert(
            `Erro ao deletar`,
            `O usuário ${element.name} é gerente de um ou mais projetos e não pode ser deletado.`
          );
          return;
        }
      }

      this.spinnerService.start();
      await this.userService.deleteUser(element.id)
        .then(() => {
          this.dataSource.data = this.dataSource.data.filter(user => user.id !== element.id);
          this.alertService.toSuccessAlert(`Usuário ${element.name} deletado com sucesso.`);
        })
        .catch(error => {
          this.alertService.toErrorAlert('Erro', `Erro ao deletar o usuário: ${error}`);
        });

      reloadPage();
    }
  }

  async getProjects(): Promise<ProjectDataModel[]> {
    return this.projectsService.getProjectsByUserId(this.localStorageService.getItem('id'))
      .then((projects: ProjectDataModel[]) => {
        return projects.sort((a, b) => a.name.localeCompare(b.name));
      })
      .catch(error => {
        console.error(`Error : ${error} -> ${error.message}`);
        return [];
      });
  }

  async isUserManagerOfAnyProject(element: UserResponseModel): Promise<boolean> {
    const userIdAsNumber = Number(element.id);
    const projects = await this.projectsService.getProjectsByUserId(userIdAsNumber);
    return projects.some(project => project.manager === element.name);
  }
}
