import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistgurbanilistComponent } from './artistgurbanilist.component';

describe('ArtistgurbanilistComponent', () => {
  let component: ArtistgurbanilistComponent;
  let fixture: ComponentFixture<ArtistgurbanilistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistgurbanilistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistgurbanilistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
