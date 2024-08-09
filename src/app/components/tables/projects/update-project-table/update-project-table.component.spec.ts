import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProjectTableComponent } from './update-project-table.component';

describe('UpdateProjectTableComponent', () => {
  let component: UpdateProjectTableComponent;
  let fixture: ComponentFixture<UpdateProjectTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateProjectTableComponent]
    });
    fixture = TestBed.createComponent(UpdateProjectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
