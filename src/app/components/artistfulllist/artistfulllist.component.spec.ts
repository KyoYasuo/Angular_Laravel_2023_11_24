import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistfulllistComponent } from './artistfulllist.component';

describe('ArtistfulllistComponent', () => {
  let component: ArtistfulllistComponent;
  let fixture: ComponentFixture<ArtistfulllistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistfulllistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistfulllistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
