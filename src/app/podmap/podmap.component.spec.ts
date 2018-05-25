import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodmapComponent } from './podmap.component';

describe('PodmapComponent', () => {
	let component: PodmapComponent;
	let fixture: ComponentFixture<PodmapComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PodmapComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PodmapComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
