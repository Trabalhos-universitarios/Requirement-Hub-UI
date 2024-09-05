import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogCreateUserComponent } from './modal-dialog-create-user.component';

describe('ModalDialogCreateUserComponent', () => {
  let component: ModalDialogCreateUserComponent;
  let fixture: ComponentFixture<ModalDialogCreateUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogCreateUserComponent]
    });
    fixture = TestBed.createComponent(ModalDialogCreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
