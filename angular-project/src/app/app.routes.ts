import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelperPageComponent } from './components/helper-page/helper-page.component';
import { WordleComponent } from './components/wordle/wordle.component';

export const routes: Routes = [
  { path: 'assist', component: HelperPageComponent },
  { path: 'play', component: WordleComponent },
  { path: '', redirectTo: '/play', pathMatch: 'full' }, // Default route

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }