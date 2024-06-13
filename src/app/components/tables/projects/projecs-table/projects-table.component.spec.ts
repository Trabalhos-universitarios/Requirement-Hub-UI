import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjecsTableComponent } from './projects-table.component';

describe('ProjecsTableComponent', () => {
  let component: ProjecsTableComponent;
  let fixture: ComponentFixture<ProjecsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjecsTableComponent]
    });
    fixture = TestBed.createComponent(ProjecsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
