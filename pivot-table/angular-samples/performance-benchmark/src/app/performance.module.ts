import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PivotViewAllModule, PivotFieldListAllModule } from '@syncfusion/ej2-angular-pivotview';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonAllModule } from '@syncfusion/ej2-angular-buttons';

import { PerformanceAppComponent } from './performance.component';

@NgModule({
  imports: [
    BrowserModule,
    PivotViewAllModule,
    PivotFieldListAllModule,
    DropDownListAllModule,
    ButtonAllModule
  ],
  declarations: [PerformanceAppComponent],
  bootstrap: [PerformanceAppComponent]
})
export class PerformanceAppModule { }
