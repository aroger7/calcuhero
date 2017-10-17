import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { HorizontalScrollerComponent } from './horizontal-scroller/horizontal-scroller.component';

import { CalculatorService } from './calculator.service';
import { EquationBuilderService } from './equation-builder.service';
import { NumberService } from './number.service';

import { HotkeyModule } from 'angular2-hotkeys';

@NgModule({
    declarations: [
        AppComponent,
        CalculatorComponent,
        HorizontalScrollerComponent,
    ],

    imports: [
        BrowserModule,
        HotkeyModule.forRoot(),
    ],

    providers: [
        EquationBuilderService,
        CalculatorService,
        NumberService
    ],

    bootstrap: [AppComponent]
})

export class AppModule { }
