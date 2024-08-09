import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogDeleteProjectComponent } from './modal-dialog-delete-project.component';

describe('ModalDialogDeleteProjectComponent', () => {
  let component: ModalDialogDeleteProjectComponent;
  let fixture: ComponentFixture<ModalDialogDeleteProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogDeleteProjectComponent]
    });
    fixture = TestBed.createComponent(ModalDialogDeleteProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
