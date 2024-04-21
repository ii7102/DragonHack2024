import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-helper-page',
  templateUrl: './helper-page.component.html',
  styleUrl: './helper-page.component.css'
})
export class HelperPageComponent {
  isVideoPlaying: boolean = false;

  constructor(private elementRef: ElementRef) {}

  playVideo() {
    const focusButton = this.elementRef.nativeElement.querySelector('#focus_button');

    if (focusButton.innerText === 'Need more focus?') {
      // Play the video
      const video = this.elementRef.nativeElement.querySelector('.subway_surfers_container video');
      if (video) {
        video.play();
        this.isVideoPlaying = true;
      }

      // Change button text to "STOP"
      focusButton.innerText = 'STOP';
    } else {
      // Stop the video
      const video = this.elementRef.nativeElement.querySelector('.subway_surfers_container video');
      if (video) {
        video.pause();
        this.isVideoPlaying = false;
      }

      // Change button text to "Need more focus?"
      focusButton.innerText = 'Need more focus?';
    }
  }
}
