import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddYourPodcastComponent } from './add-your-podcast.component';

describe('AddYourPodcastComponent', () => {
  let component: AddYourPodcastComponent;
  let fixture: ComponentFixture<AddYourPodcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddYourPodcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddYourPodcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
