import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracebilityMatrixComponent } from './tracebility-matrix.component';

describe('TracebilityMatrixComponent', () => {
  let component: TracebilityMatrixComponent;
  let fixture: ComponentFixture<TracebilityMatrixComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TracebilityMatrixComponent]
    });
    fixture = TestBed.createComponent(TracebilityMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
