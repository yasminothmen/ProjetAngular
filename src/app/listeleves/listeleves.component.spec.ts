import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListelevesComponent } from './listeleves.component';

describe('ListelevesComponent', () => {
  let component: ListelevesComponent;
  let fixture: ComponentFixture<ListelevesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListelevesComponent]
    });
    fixture = TestBed.createComponent(ListelevesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
