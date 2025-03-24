import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheEmploiComponent } from './affiche-emploi.component';

describe('AfficheEmploiComponent', () => {
  let component: AfficheEmploiComponent;
  let fixture: ComponentFixture<AfficheEmploiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AfficheEmploiComponent]
    });
    fixture = TestBed.createComponent(AfficheEmploiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
