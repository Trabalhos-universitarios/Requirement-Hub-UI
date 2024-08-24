import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogArtifactsRequirementComponent } from './modal-dialog-artifacts-requirement.component';

describe('ModalDialogArtifactsRequirementComponent', () => {
  let component: ModalDialogArtifactsRequirementComponent;
  let fixture: ComponentFixture<ModalDialogArtifactsRequirementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogArtifactsRequirementComponent]
    });
    fixture = TestBed.createComponent(ModalDialogArtifactsRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
