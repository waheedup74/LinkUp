import { GradeCalcPipe } from '../pipes/grade-calc.pipe';
import { DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HomeComponent } from '../home/home.component';
import { HighlightDirective } from './highlight.directive';

describe('HighlightDirective', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugEl: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent, GradeCalcPipe, HighlightDirective]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();
  }));

  it('should create an instance', () => {
    // let eleMockRef = {
    //   nativeElement: document.createElement('div')
    // };

    const directive = new HighlightDirective();
    expect(directive).toBeTruthy();
  });

  it('should change the text color on mouse over', () => {
     let divs = debugEl.queryAll(By.css('div'));
     let div0 = divs[0];
    //  let div1 = divs[1];
    //  let div2 = divs[2];
    //  let div3 = divs[3];
    //  let div4 = divs[4];
     div0.triggerEventHandler('mouseenter', {});
     fixture.detectChanges();
     expect(div0.nativeElement.style.color).toBe('orange');

  });
});
