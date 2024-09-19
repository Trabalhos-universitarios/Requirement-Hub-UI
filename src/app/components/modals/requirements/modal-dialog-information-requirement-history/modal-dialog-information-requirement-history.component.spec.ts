import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogInformationRequirementHistoryComponent } from './modal-dialog-information-requirement-history.component';

describe('ModalDialogInformationRequirementHistoryComponent', () => {
  let component: ModalDialogInformationRequirementHistoryComponent;
  let fixture: ComponentFixture<ModalDialogInformationRequirementHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogInformationRequirementHistoryComponent]
    });
    fixture = TestBed.createComponent(ModalDialogInformationRequirementHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
