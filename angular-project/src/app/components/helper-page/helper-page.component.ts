import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-helper-page',
  templateUrl: './helper-page.component.html',
  styleUrl: './helper-page.component.css'
})
export class HelperPageComponent {
  isVideoPlaying: boolean = false;
  isAudioPlaying: boolean = false;

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
      focusButton.innerText = 'STOP VIDEO';
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
    const video = subwayContainer.querySelector('video');
    if (this.isAudioPlaying) {
      video.muted = true;
    } else {
      video.muted = false;
    }
  }

  toggleAudio() {
    const audioButton = this.elementRef.nativeElement.querySelector('#podcast_boost');
    const audio = this.elementRef.nativeElement.querySelector('audio');

    if (audioButton.innerText === 'Podcast boost') {
      // Set the source for the audio
      audio.src = 'assets/RoganGoggins.mp3'; // Replace 'your-audio-file.mp3' with the path to your audio file

      // Play the audio
      if (audio) {
        audio.play();
        this.isAudioPlaying = true;
      }

      // Change button text to "Stop"
      audioButton.innerText = 'STOP PODCAST';
    } else {
      // Stop the audio
      if (audio) {
        audio.pause();
        this.isAudioPlaying = false;
      }

      // Change button text to "Podcast boost"
      audioButton.innerText = 'Podcast boost';
    }
    const subwayContainer = this.elementRef.nativeElement.querySelector('.subway_surfers_container');
    const video = subwayContainer.querySelector('video');
    if (this.isAudioPlaying) {
      video.muted = true;
    } else {
      video.muted = false;
    }
  }
}
