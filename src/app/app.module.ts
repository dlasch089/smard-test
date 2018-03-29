import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { EnergydataService } from './services/energydata.service';
import { DataviewComponent } from './components/dataview/dataview.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    DataviewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    EnergydataService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
