import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogUpdateProjectComponent } from './modal-dialog-update-project.component';

describe('ModalDialogUpdateProjectComponent', () => {
  let component: ModalDialogUpdateProjectComponent;
  let fixture: ComponentFixture<ModalDialogUpdateProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogUpdateProjectComponent]
    });
    fixture = TestBed.createComponent(ModalDialogUpdateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
