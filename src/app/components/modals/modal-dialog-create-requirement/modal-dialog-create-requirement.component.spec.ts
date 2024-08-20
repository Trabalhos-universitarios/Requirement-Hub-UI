import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogCreateRequirementComponent } from './modal-dialog-create-requirement.component';

describe('ModalDialogCreateRequisitosComponent', () => {
  let component: ModalDialogCreateRequirementComponent;
  let fixture: ComponentFixture<ModalDialogCreateRequirementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogCreateRequirementComponent]
    });
    fixture = TestBed.createComponent(ModalDialogCreateRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
