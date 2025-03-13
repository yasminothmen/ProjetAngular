import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeenseignantsComponent } from './listeenseignants.component';

describe('ListeenseignantsComponent', () => {
  let component: ListeenseignantsComponent;
  let fixture: ComponentFixture<ListeenseignantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeenseignantsComponent]
    });
    fixture = TestBed.createComponent(ListeenseignantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
