import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogUpdateRequirementComponent } from './modal-dialog-update-requirement.component';

describe('ModalDialogUpdateRequirementComponent', () => {
  let component: ModalDialogUpdateRequirementComponent;
  let fixture: ComponentFixture<ModalDialogUpdateRequirementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogUpdateRequirementComponent]
    });
    fixture = TestBed.createComponent(ModalDialogUpdateRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
