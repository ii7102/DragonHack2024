import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InsertWordComponent } from './components/insert-word/insert-word.component';
import { VersusPageComponent } from './versus-page/versus-page.component';
import { ResultBoxComponent } from './result-box/result-box.component';
import { HelperPageComponent } from './helper-page/helper-page.component';

@NgModule({
  declarations: [
    AppComponent,
    InsertWordComponent,
    VersusPageComponent,
    ResultBoxComponent,
    HelperPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
