import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherEditModalComponent } from './teacher-edit-modal.component';

describe('TeacherEditModalComponent', () => {
  let component: TeacherEditModalComponent;
  let fixture: ComponentFixture<TeacherEditModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherEditModalComponent]
    });
    fixture = TestBed.createComponent(TeacherEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
