import { Component, ElementRef } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-project';
  isVideoPlaying: boolean = false;
  questionMarks = 0
  charCountArray: number[] = Array(26).fill(0);

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

  constructor(private elementRef: ElementRef) {
    this.fetchFiveLetterWordsWithoutLetters(['d','a','n','c','e','i','o','t','s'], ['r'], "?????").then(words => {
      words.forEach(str => {
        const charSet: Set<string> = new Set();
        for (let ch of str) {
            if (ch >= 'a' && ch <= 'z' && !charSet.has(ch)) {
                this.charCountArray[ch.charCodeAt(0) - 'a'.charCodeAt(0)]++
                charSet.add(ch);
            }
        }
    });
      console.log(words[this.selectWord(words)])
    });
  }

  selectWord(words: string[]): number {
    let max = 0, lmax = 0, maxIndex = -1
      for(let i = 0;i<words.length;i++) {
        lmax = 0;
        const charSet: Set<string> = new Set();
        for (let ch of words[i])
          if (ch >= 'a' && ch <= 'z' && !charSet.has(ch)) {
              lmax+= this.charCountArray[ch.charCodeAt(0) - 'a'.charCodeAt(0)]
              charSet.add(ch);
          }
        if(lmax > max) {
          max = lmax;
          maxIndex = i;
        }
      }
    return maxIndex
  }

  filter(words: string[], lettersOUT: string[], lettersIN: string[], regex: string): string[] {
    const result: string[] = []
    if(this.questionMarks == 0) return words
    for(const word of words) {
      let questionMarks = this.questionMarks;
      let letters = lettersIN.length
      const usedLetters: boolean[] = Array(letters).fill(false)
      let add = true
      for(let i = 0; i<5 && add;i++)
        if(regex.charAt(i) === '?') {
          let found = false
          for(let j = 0; j < lettersIN.length && !found; j++)
              if(!usedLetters[j] && lettersIN.includes(word.charAt(i))) {
                usedLetters[j] = true
                letters--
                found = true
              }
          if(!found)
              if(lettersOUT.includes(word.charAt(i)) || letters === questionMarks) add = false
          questionMarks--
        }
      if(add && letters == 0) result.push(word)
    }
    return result
  }
  
  async fetchFiveLetterWordsWithoutLetters(lettersOUT: string[], lettersIN: string[], regex: string): Promise<string[]> {
    try {
      const words: string[] = []
      for(let i = 0; i < 5; i++)
          if(regex.charAt(i) === '?') this.questionMarks++
      if(this.questionMarks == 4) {
        let q = 0
          if(regex.charAt(0) != '?') q = 1
            for (let charCode = 'a'.charCodeAt(0); charCode <= 'z'.charCodeAt(0); charCode++)
              if(!lettersOUT.includes(String.fromCharCode(charCode)) ) {
                if(q === 0)
                  regex = String.fromCharCode(charCode) + regex.slice(1);
                else
                  regex = regex.slice(0, 1) + String.fromCharCode(charCode) + regex.slice(2);
                const response = await axios.get(`https://api.datamuse.com/words?sp=${regex}&max=1000`);
                words.push(...this.filter(response.data.map((wordInfo: any) => wordInfo.word),lettersOUT,lettersIN,regex))
              }
        if(q === 0)
          regex = '?' + regex.slice(1);
        else
          regex = regex.slice(0, 1) + '?' + regex.slice(2);
      } else if(this.questionMarks == 5) {
        for (let charCode = 'a'.charCodeAt(0); charCode <= 'z'.charCodeAt(0); charCode++)
          if(!lettersOUT.includes(String.fromCharCode(charCode)) ) {
            regex = String.fromCharCode(charCode) + regex.slice(1);
            for (let charCode2 = 'a'.charCodeAt(0); charCode2 <= 'z'.charCodeAt(0); charCode2++)
              if(!lettersOUT.includes(String.fromCharCode(charCode2)) ) {
                regex = regex.slice(0, 1) + String.fromCharCode(charCode2) + regex.slice(2);
                const response = await axios.get(`https://api.datamuse.com/words?sp=${regex}&max=1000`);
                words.push(...this.filter(response.data.map((wordInfo: any) => wordInfo.word),lettersOUT,lettersIN,regex))
              }
          }
      } else {
        const response = await axios.get(`https://api.datamuse.com/words?sp=${regex}&max=1000`);
        words.push(...this.filter(response.data.map((wordInfo: any) => wordInfo.word),lettersOUT,lettersIN,regex))
      }
      return words;
    }
    catch (error) {
      console.error('Error fetching words:', error);
      return [];
    }
  }
}
