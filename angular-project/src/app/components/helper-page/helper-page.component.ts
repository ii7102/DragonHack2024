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
    const subwayContainer = this.elementRef.nativeElement.querySelector('.subway_surfers_container');

    if (focusButton.innerText === "Can't focus?") {
      // Show the container
      subwayContainer.style.display = 'block';

      // Play the video
      const video = subwayContainer.querySelector('video');
      if (video) {
        video.currentTime = 0;
        video.play();
        this.isVideoPlaying = true;
      }

      // Change button text to "STOP"
      focusButton.innerText = 'STOP';
    } else {
      // Stop the video
      const video = subwayContainer.querySelector('video');
      if (video) {
        video.pause();
        // video.stop();
        this.isVideoPlaying = false;
      }

      // Hide the container
      subwayContainer.style.display = 'none';

      // Change button text to "Need more focus?"
      focusButton.innerText = "Can't focus?";
    }
  }
}
