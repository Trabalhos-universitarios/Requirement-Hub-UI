import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementHistoryTableComponent } from './requirement-history-table.component';

describe('RequirementHistoryTableComponent', () => {
  let component: RequirementHistoryTableComponent;
  let fixture: ComponentFixture<RequirementHistoryTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequirementHistoryTableComponent]
    });
    fixture = TestBed.createComponent(RequirementHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
