import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediacrudComponent } from './mediacrud.component';

describe('MediacrudComponent', () => {
  let component: MediacrudComponent;
  let fixture: ComponentFixture<MediacrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediacrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediacrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
