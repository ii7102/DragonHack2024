import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { InsertWordComponent } from './components/insert-word/insert-word.component';
import { ResultBoxComponent } from './components/result-box/result-box.component';
import { HelperPageComponent } from './components/helper-page/helper-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { WordleComponent } from './components/wordle/wordle.component';
import { AppRoutingModule } from './app.routes'



@NgModule({
  declarations: [
    AppComponent,
    InsertWordComponent,
    ResultBoxComponent,
    HelperPageComponent,
    NavbarComponent,
    WordleComponent
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
