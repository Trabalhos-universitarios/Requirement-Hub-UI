import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserTableComponent } from './delete-user-table.component';

describe('DeleteUserTableComponent', () => {
  let component: DeleteUserTableComponent;
  let fixture: ComponentFixture<DeleteUserTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteUserTableComponent]
    });
    fixture = TestBed.createComponent(DeleteUserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
