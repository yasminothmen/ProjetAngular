import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeclassesComponent } from './listeclasses.component';

describe('ListeclassesComponent', () => {
  let component: ListeclassesComponent;
  let fixture: ComponentFixture<ListeclassesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeclassesComponent]
    });
    fixture = TestBed.createComponent(ListeclassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
