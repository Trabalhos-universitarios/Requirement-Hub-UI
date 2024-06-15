import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogCreateProjectComponent } from './modal-dialog-create-project';

describe('ModalDialogComponent', () => {
  let component: ModalDialogCreateProjectComponent;
  let fixture: ComponentFixture<ModalDialogCreateProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogCreateProjectComponent]
    });
    fixture = TestBed.createComponent(ModalDialogCreateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
