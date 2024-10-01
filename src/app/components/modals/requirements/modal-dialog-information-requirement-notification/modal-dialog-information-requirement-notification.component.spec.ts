import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogInformationRequirementNotificationComponent } from './modal-dialog-information-requirement-notification.component';

describe('ModalDialogInformationRequirementNotificationComponent', () => {
  let component: ModalDialogInformationRequirementNotificationComponent;
  let fixture: ComponentFixture<ModalDialogInformationRequirementNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogInformationRequirementNotificationComponent]
    });
    fixture = TestBed.createComponent(ModalDialogInformationRequirementNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
