import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface Task {
  title: string;
}

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent {
  columns = [
    { name: 'To do', tasks: [{ title: 'Task 1' }, { title: 'Task 2' }], editing: false },
    { name: 'Done', tasks: [{ title: 'Task 3' }, { title: 'Task 4' }], editing: false }
  ];

  drop(event: CdkDragDrop<Task[]>, columnIndex: number): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
      );
    }
  }

  enableColumnEdit(index: number): void {
    this.columns[index].editing = true;
  }

  disableColumnEdit(index: number): void {
    this.columns[index].editing = false;
  }

  addColumn(): void {
    this.columns.push({ name: 'New Column', tasks: [], editing: true });
  }

  deleteColumn(index: number): void {
    if (this.columns[index].tasks.length === 0) {
      this.columns.splice(index, 1); // Remove a coluna se não tiver tarefas
    }
  }
}
