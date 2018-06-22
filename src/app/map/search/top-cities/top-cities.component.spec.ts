import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCitiesComponent } from './top-cities.component';

describe('TopCitiesComponent', () => {
  let component: TopCitiesComponent;
  let fixture: ComponentFixture<TopCitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopCitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
