import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArtifactProjectComponent } from './add-artifact-project.component';

describe('AddArtifactProjectComponent', () => {
  let component: AddArtifactProjectComponent;
  let fixture: ComponentFixture<AddArtifactProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddArtifactProjectComponent]
    });
    fixture = TestBed.createComponent(AddArtifactProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
