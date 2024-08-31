import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogInformationRequirementArtifactComponent } from './modal-dialog-information-requirement-artifact.component';

describe('ModalDialogInformationRequirementArtifactComponent', () => {
  let component: ModalDialogInformationRequirementArtifactComponent;
  let fixture: ComponentFixture<ModalDialogInformationRequirementArtifactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogInformationRequirementArtifactComponent]
    });
    fixture = TestBed.createComponent(ModalDialogInformationRequirementArtifactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
