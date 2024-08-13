import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProjectTabComponent } from './update-project-tab.component';

describe('UpdateProjectTabComponent', () => {
  let component: UpdateProjectTabComponent;
  let fixture: ComponentFixture<UpdateProjectTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateProjectTabComponent]
    });
    fixture = TestBed.createComponent(UpdateProjectTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
