import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastsubcategorycrudComponent } from './podcastsubcategorycrud.component';

describe('PodcastsubcategorycrudComponent', () => {
  let component: PodcastsubcategorycrudComponent;
  let fixture: ComponentFixture<PodcastsubcategorycrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodcastsubcategorycrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastsubcategorycrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
