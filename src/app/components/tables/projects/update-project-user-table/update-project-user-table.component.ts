import {SelectionModel} from '@angular/cdk/collections';
import {Component, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { UserResponseModel } from 'src/app/models/user-model';
import { UsersService } from 'src/app/services/users/users.service';
import { TeamResponseModel } from 'src/app/models/user-team-model';
import { ProjectsTableService } from 'src/app/services/projects/projects-table.service';
import { UpdateProjectsService } from 'src/app/services/projects/update-projects.service';


@Component({
  selector: 'app-update-project-user-table',
  templateUrl: './update-project-user-table.component.html',
  styleUrls: ['./update-project-user-table.component.scss'],
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule],
})
export class UpdateProjectUserTableComponent implements OnInit{
  displayedColumns: string[] = ['select', 'name', 'role'];
  dataSource = new MatTableDataSource<UserResponseModel>();
  selection = new SelectionModel<UserResponseModel>(true, []);
  users?: UserResponseModel[];
  team?: TeamResponseModel[];
  preSelectedUserIds: string[] = [];

  constructor(private userService: UsersService,
              private projectTableService: ProjectsTableService,
              private updateProjectService: UpdateProjectsService) {}

  ngOnInit() {
    this.getTeam();
    this.selection.changed.subscribe(() => {
      this.onSelectionChange();
    });
  }

  getTeam(): void {
    this.userService.getTeam(this.projectTableService.getCurrentProjectById())
      .then(resp => {
        this.team = resp;
        this.preSelectedUserIds = this.team.map(teamMember => teamMember.userId);
        this.getUsers();
      })
      .catch(error => {
        console.error(`Error : ${error} -> ${error.message}`);
      });
  }

  getUsers(): void {
    this.userService.getUsers()
      .then(resp => {
        this.users = resp.filter(user => user.role.trim().toUpperCase() !== "GERENTE_DE_PROJETOS");
        this.dataSource.data = this.users;
        this.users.forEach(user => {
          if (this.preSelectedUserIds.includes(user.id)) {
            this.selection.select(user);
          }
        });
      })
      .catch(error => {
        console.error(`Error : ${error} -> ${error.message}`);
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: UserResponseModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  onSelectionChange() {
    const selectedData: UserResponseModel[] = this.selection.selected.map(item => ({
        id: item.id,
        name: item.name,
        role: item.role
    }));
    this.updateProjectService.setCurrentProjectTeam(selectedData);
}
}
