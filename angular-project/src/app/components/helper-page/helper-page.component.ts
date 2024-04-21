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

  // Plays/stops the subway surfers video and mutes/unmutes the sound of the video if the podcast is on/off 
  playVideo() {
    const focusButton = this.elementRef.nativeElement.querySelector('#focus_button');
    const subwayContainer = this.elementRef.nativeElement.querySelector('.subway_surfers_container');

    if (focusButton.innerText === "Can't focus?") {
      subwayContainer.style.display = 'block';

      const video = subwayContainer.querySelector('video');
      if (video) {
        video.currentTime = 0;
        video.play();
        this.isVideoPlaying = true;
      }

      focusButton.innerText = 'STOP VIDEO';
    } else {
      const video = subwayContainer.querySelector('video');
      if (video) {
        video.pause();
       
        this.isVideoPlaying = false;
      }

      subwayContainer.style.display = 'none';

      focusButton.innerText = "Can't focus?";
    }
    const video = subwayContainer.querySelector('video');
    if (this.isAudioPlaying) {
      video.muted = true;
    } else {
      video.muted = false;
    }
  }

  // Pays/pauses the podcast and mutes/unmutes the sound of the subway surfers video if it's on
  toggleAudio() {
    const audioButton = this.elementRef.nativeElement.querySelector('#podcast_boost');
    const audio = this.elementRef.nativeElement.querySelector('audio');

    if (audioButton.innerText === 'Podcast boost') {
      audio.src = 'assets/RoganGoggins.mp3';

      if (audio) {
        audio.play();
        this.isAudioPlaying = true;
      }

      audioButton.innerText = 'STOP PODCAST';
    } else {
      if (audio) {
        audio.pause();
        this.isAudioPlaying = false;
      }

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
