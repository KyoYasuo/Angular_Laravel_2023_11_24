import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailypodcastComponent } from './dailypodcast.component';

describe('DailypodcastComponent', () => {
  let component: DailypodcastComponent;
  let fixture: ComponentFixture<DailypodcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailypodcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailypodcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
