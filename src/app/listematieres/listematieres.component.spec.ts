import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListematieresComponent } from './listematieres.component';

describe('ListematieresComponent', () => {
  let component: ListematieresComponent;
  let fixture: ComponentFixture<ListematieresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListematieresComponent]
    });
    fixture = TestBed.createComponent(ListematieresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
