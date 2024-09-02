import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogInformationRequirementComponent } from './modal-dialog-information-requirement.component';

describe('ModalDialogInformationRequirementComponent', () => {
  let component: ModalDialogInformationRequirementComponent;
  let fixture: ComponentFixture<ModalDialogInformationRequirementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogInformationRequirementComponent]
    });
    fixture = TestBed.createComponent(ModalDialogInformationRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
