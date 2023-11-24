import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpodcastcrudComponent } from './addpodcastcrud.component';

describe('AddpodcastcrudComponent', () => {
  let component: AddpodcastcrudComponent;
  let fixture: ComponentFixture<AddpodcastcrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpodcastcrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpodcastcrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
