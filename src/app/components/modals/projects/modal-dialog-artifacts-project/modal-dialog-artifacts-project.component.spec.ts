import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogArtifactsProjectComponent } from './modal-dialog-artifacts-project.component';

describe('ModalDialogArtifactsProjectComponent', () => {
  let component: ModalDialogArtifactsProjectComponent;
  let fixture: ComponentFixture<ModalDialogArtifactsProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogArtifactsProjectComponent]
    });
    fixture = TestBed.createComponent(ModalDialogArtifactsProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
