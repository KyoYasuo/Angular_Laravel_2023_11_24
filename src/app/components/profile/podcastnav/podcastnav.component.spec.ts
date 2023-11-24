import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastnavComponent } from './podcastnav.component';

describe('PodcastnavComponent', () => {
  let component: PodcastnavComponent;
  let fixture: ComponentFixture<PodcastnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodcastnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
