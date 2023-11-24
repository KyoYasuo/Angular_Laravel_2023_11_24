import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastsubcategoryComponent } from './podcastsubcategory.component';

describe('PodcastsubcategoryComponent', () => {
  let component: PodcastsubcategoryComponent;
  let fixture: ComponentFixture<PodcastsubcategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodcastsubcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastsubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
