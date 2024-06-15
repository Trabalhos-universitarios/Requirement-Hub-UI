import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogInformationProjectComponent } from './modal-dialog-information-project.component';

describe('ModalDialogInformationProjectComponent', () => {
  let component: ModalDialogInformationProjectComponent;
  let fixture: ComponentFixture<ModalDialogInformationProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogInformationProjectComponent]
    });
    fixture = TestBed.createComponent(ModalDialogInformationProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
