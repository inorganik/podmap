import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastSearchComponent } from './podcast-search.component';

describe('PodcastSearchComponent', () => {
  let component: PodcastSearchComponent;
  let fixture: ComponentFixture<PodcastSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodcastSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
