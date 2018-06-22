import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmoderatedComponent } from './unmoderated.component';

describe('UnmoderatedComponent', () => {
  let component: UnmoderatedComponent;
  let fixture: ComponentFixture<UnmoderatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnmoderatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnmoderatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
