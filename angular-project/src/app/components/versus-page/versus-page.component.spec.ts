import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersusPageComponent } from './versus-page.component';

describe('VersusPageComponent', () => {
  let component: VersusPageComponent;
  let fixture: ComponentFixture<VersusPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VersusPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VersusPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
