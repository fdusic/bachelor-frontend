import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMachineComponent } from './update-machine.component';

describe('UpdateMachineComponent', () => {
  let component: UpdateMachineComponent;
  let fixture: ComponentFixture<UpdateMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
