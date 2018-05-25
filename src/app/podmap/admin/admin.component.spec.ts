import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodmapAdminComponent } from './admin.component';

describe('PodmapAdminComponent', () => {
	let component: PodmapAdminComponent;
	let fixture: ComponentFixture<PodmapAdminComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PodmapAdminComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PodmapAdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
