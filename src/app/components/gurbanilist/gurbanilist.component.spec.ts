import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GurbanilistComponent } from './gurbanilist.component';

describe('GurbanilistComponent', () => {
  let component: GurbanilistComponent;
  let fixture: ComponentFixture<GurbanilistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GurbanilistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GurbanilistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
