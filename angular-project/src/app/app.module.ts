import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InsertWordComponent } from './components/insert-word/insert-word.component';
import { VersusPageComponent } from './components/versus-page/versus-page.component';
import { ResultBoxComponent } from './components/result-box/result-box.component';
import { HelperPageComponent } from './components/helper-page/helper-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { WordleComponent } from './components/wordle/wordle.component';

@NgModule({
  declarations: [
    AppComponent,
    InsertWordComponent,
    VersusPageComponent,
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
