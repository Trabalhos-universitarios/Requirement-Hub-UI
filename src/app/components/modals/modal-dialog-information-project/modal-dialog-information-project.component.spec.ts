import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogInformacoesProjectComponent } from './modal-dialog-informacoes-project.component';

describe('ModalDialogInformacoesProjectComponent', () => {
  let component: ModalDialogInformacoesProjectComponent;
  let fixture: ComponentFixture<ModalDialogInformacoesProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDialogInformacoesProjectComponent]
    });
    fixture = TestBed.createComponent(ModalDialogInformacoesProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
