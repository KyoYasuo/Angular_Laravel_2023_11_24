import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediadurationuploadComponent } from './mediadurationupload.component';

describe('MediadurationuploadComponent', () => {
  let component: MediadurationuploadComponent;
  let fixture: ComponentFixture<MediadurationuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediadurationuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediadurationuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
