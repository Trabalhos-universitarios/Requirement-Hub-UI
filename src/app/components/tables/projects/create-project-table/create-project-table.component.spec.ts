import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectTableComponent } from './create-project-table.component';

describe('CreateProjectTableComponent', () => {
  let component: CreateProjectTableComponent;
  let fixture: ComponentFixture<CreateProjectTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateProjectTableComponent]
    });
    fixture = TestBed.createComponent(CreateProjectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
