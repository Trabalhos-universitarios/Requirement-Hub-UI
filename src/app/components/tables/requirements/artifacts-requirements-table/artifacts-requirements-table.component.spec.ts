import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactsRequirementsTableComponent } from './artifacts-requirements-table.component';

describe('ArtifactsRequirementsTableComponent', () => {
  let component: ArtifactsRequirementsTableComponent;
  let fixture: ComponentFixture<ArtifactsRequirementsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtifactsRequirementsTableComponent]
    });
    fixture = TestBed.createComponent(ArtifactsRequirementsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
