import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceSearchComponent } from './place-search.component';

describe('PlaceSearchComponent', () => {
	let component: PlaceSearchComponent;
	let fixture: ComponentFixture<PlaceSearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PlaceSearchComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PlaceSearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
