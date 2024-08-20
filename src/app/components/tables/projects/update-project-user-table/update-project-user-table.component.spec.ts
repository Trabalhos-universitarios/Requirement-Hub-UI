import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProjectUserTableComponent } from './update-project-user-table.component';

describe('UpdateProjectUserTableComponent', () => {
  let component: UpdateProjectUserTableComponent;
  let fixture: ComponentFixture<UpdateProjectUserTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateProjectUserTableComponent]
    });
    fixture = TestBed.createComponent(UpdateProjectUserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
