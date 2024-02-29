import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { HomeComponent } from './home.component';
import { of, delay } from 'rxjs';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let el: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct content', () => {
    let pElement = el.queryAll(By.css('p'));
    expect(pElement[0].nativeElement.textContent).toBe('home works!');

    // let button = el.queryAll(By.css('button'));
    // expect(button[0].nativeElement.disabled).toBeTrue();

    // component.message = 'Nothing found';
    // fixture.detectChanges();
    // let textMessages = el.queryAll(By.css('.msg'));
    // expect(textMessages[0].nativeElement.textContent).toBe('Nothing found');
  });

  it('should have rendered button', fakeAsync(() => {
    component.submitBtn = 'Submit';
    component.message = 'Nothing found';
    fixture.detectChanges();

    let buttons = el.queryAll(By.css('.btn'));
    buttons[0].nativeElement.click();
    fixture.detectChanges();
    expect(buttons[0].nativeElement.textContent).toBe('Submitted');

    let textMessages = el.queryAll(By.css('.msg'));
    expect(textMessages[0].nativeElement.textContent).toBe('Nothing found');

    setTimeout(() => {
      fixture.detectChanges();

    }, 3000);

    flush();
    expect(buttons[0].nativeElement.textContent).toBe('Submitted');
  })
  );

  it("should test promise", fakeAsync(() => {
    let counter = 0;

    setTimeout(() => {
      counter = counter + 2;
    }, 2000);

    setTimeout(() => {
      counter = counter + 3;
    }, 3000);


    Promise.resolve().then(() => {
      counter = counter + 1;
    });

    flush();
    expect(counter).toBe(6);
  }));

  it("should test the observable", fakeAsync(() => {
    let isSubscribed = false;
    let myObs = of(isSubscribed).pipe(delay(1000));

    myObs.subscribe(res => {
      isSubscribed = true;
    });

    tick(2000);
    expect(isSubscribed).toBe(true);
  }));

});
