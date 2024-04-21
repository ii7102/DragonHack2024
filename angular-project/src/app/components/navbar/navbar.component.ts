import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // <-- Change styleUrl to styleUrls
})
export class NavbarComponent {
  @Output() asistMe = new EventEmitter<void>();
  @Output() playMe=  new EventEmitter<void>();

  assistWordle(){
    this.asistMe.emit();
  }

  playWordle(){
    this.playMe.emit();
  }
}
