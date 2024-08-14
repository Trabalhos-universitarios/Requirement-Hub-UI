import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactsProjectTableComponent } from './artifacts-project-table.component';

describe('ArtifactsProjectTableComponent', () => {
  let component: ArtifactsProjectTableComponent;
  let fixture: ComponentFixture<ArtifactsProjectTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtifactsProjectTableComponent]
    });
    fixture = TestBed.createComponent(ArtifactsProjectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
