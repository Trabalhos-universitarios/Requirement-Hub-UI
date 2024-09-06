import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogDeleteUserComponent } from './modal-dialog-delete-user.component';

describe('ModalDialogDeleteUserComponent', () => {
  let component: ModalDialogDeleteUserComponent;
  let fixture: ComponentFixture<ModalDialogDeleteUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogDeleteUserComponent]
    });
    fixture = TestBed.createComponent(ModalDialogDeleteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
