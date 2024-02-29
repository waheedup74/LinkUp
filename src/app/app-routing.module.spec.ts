import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { Location } from '@angular/common';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { appRoutes } from './app-routing.module';
import { GradeCalcPipe } from './pipes/grade-calc.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { Router } from '@angular/router';
import { HomeComponent } from './home/home.component';

describe('App Routing', () => {
    let router: Router;
    let homefixture: ComponentFixture<HomeComponent>;
    // let projectfixture: ComponentFixture<ProjectionComponent>;
    let location: Location;
    let homeEleDebug: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [HomeComponent, GradeCalcPipe, HighlightDirective],
            imports: [RouterTestingModule.withRoutes(appRoutes)]
        }).compileComponents();
    }));

    beforeEach(() => {
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        router.initialNavigation();
        homefixture = TestBed.createComponent(HomeComponent);
        // projectfixture = TestBed.createComponent(ProjectionComponent);
        homeEleDebug = homefixture.debugElement;
    });

    it('should navigate to default path: home', waitForAsync(() => {
        homefixture.detectChanges();
        homefixture.whenStable().then(() => {
            expect(location.path()).toBe('/');
        });
    }));

    // it('should navigate to projection after clicking file upload', waitForAsync(() => {
    //     projectfixture.detectChanges();
    //     let links = homeEleDebug.queryAll(By.css('h5'));
    //     links[0].nativeElement.click();

    //     projectfixture.whenStable().then(() => {
    //         expect(location.path()).toBe('/projection');
    //     })
    // }));
});