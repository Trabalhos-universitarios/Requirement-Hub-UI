import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogCreateRequisitosComponent } from './modal-dialog-create-requisitos.component';

describe('ModalDialogCreateRequisitosComponent', () => {
  let component: ModalDialogCreateRequisitosComponent;
  let fixture: ComponentFixture<ModalDialogCreateRequisitosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogCreateRequisitosComponent]
    });
    fixture = TestBed.createComponent(ModalDialogCreateRequisitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
