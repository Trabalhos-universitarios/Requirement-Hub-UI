import {SelectionModel} from '@angular/cdk/collections';
import {Component} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { UserResponseModel } from 'src/app/models/user-model';
import { UsersService } from 'src/app/services/users/users.service';


@Component({
  selector: 'app-update-project-user-table',
  templateUrl: './update-project-user-table.component.html',
  styleUrls: ['./update-project-user-table.component.scss'],
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule],
})
export class UpdateProjectUserTableComponent {
  displayedColumns: string[] = ['select', 'name', 'role'];
  dataSource = new MatTableDataSource<UserResponseModel>();
  selection = new SelectionModel<UserResponseModel>(true, []);
  users?: UserResponseModel[];


  constructor(private userService: UsersService)
  {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers()
        .then(resp => {
          this.users = resp.filter(user => user.role.trim().toUpperCase() !== "GERENTE_DE_PROJETOS");
            this.dataSource.data = this.users;
            console.log(this.users);
        })
        .catch(error => {
            console.error(`Error : ${error} -> ${error.message}`);
        });
   }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: UserResponseModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }
}
