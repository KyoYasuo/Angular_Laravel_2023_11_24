import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastcrudComponent } from './podcastcrud.component';

describe('PodcastcrudComponent', () => {
  let component: PodcastcrudComponent;
  let fixture: ComponentFixture<PodcastcrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodcastcrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastcrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
