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
    let max = 0, localmax = 0, maxIndex = -1
      for(let i = 0;i<words.length;i++) {
        localmax = 0;
        const charSet: Set<string> = new Set();
        for (let ch of words[i])
          if (ch >= 'a' && ch <= 'z' && !charSet.has(ch)) {
              localmax+= this.charCountArray[ch.charCodeAt(0) - 'a'.charCodeAt(0)]
              charSet.add(ch);
          }
        if(localmax > max) {
          max = localmax;
          maxIndex = i;
        }
      }
    return maxIndex
  }

  charAtStringIsEqualTo(regex: string, index: number, equalsTo: string) {
    return regex.charAt(index) === equalsTo
  }

  arrayContainsElement(array: string[], element: string) {
    return array.includes(element)
  }

  filter(words: string[], lettersOUT: string[], lettersIN: string[], regex: string): string[] {
    const result: string[] = []
    if(this.questionMarks == 0) return words
    for(const word of words) {
      let questionMarks = this.questionMarks;
      let lettersLeftForFilling = lettersIN.length
      const usedLetters: boolean[] = Array(lettersLeftForFilling).fill(false)
      let addTheWord = true
      for(let i = 0; i<5 && addTheWord;i++)
        if(this.charAtStringIsEqualTo(regex,i,"?")) {
          let foundLetter = false
          for(let j = 0; j < lettersIN.length && !foundLetter; j++)
              if(!usedLetters[j] && this.arrayContainsElement(lettersIN,word.charAt(i))) {
                usedLetters[j] = true
                lettersLeftForFilling--
                foundLetter = true
              }
          if(!foundLetter)
              if(lettersOUT.includes(word.charAt(i)) || lettersLeftForFilling === questionMarks) addTheWord = false
          questionMarks--
        }
      if(addTheWord && lettersLeftForFilling == 0) result.push(word)
    }
    return result
  }

  firstCharChangedOfString(string: string, changedTo: string) {
    return changedTo + string.slice(1);
  }
  
  secondCharChangedOfString(string: string, changedTo: string) {
    return string.slice(0, 1) + changedTo + string.slice(2);
  }
  
  async fetchFiveLetterWordsWithoutLetters(lettersOUT: string[], lettersIN: string[], regex: string): Promise<string[]> {
    try {
      const words: string[] = []
      for(let i = 0; i < 5; i++)
          if(this.charAtStringIsEqualTo(regex,i,"?")) this.questionMarks++
      if(this.questionMarks == 4) {
        let firstQuestionMarkIndex = 0
          if(!this.charAtStringIsEqualTo(regex,0,"?")) firstQuestionMarkIndex = 1
            for (let charCode = 'a'.charCodeAt(0); charCode <= 'z'.charCodeAt(0); charCode++)
              if(!this.arrayContainsElement(lettersOUT,String.fromCharCode(charCode)) ) {
                if(firstQuestionMarkIndex === 0)
                  regex = this.firstCharChangedOfString(regex,String.fromCharCode(charCode))
                else
                  regex = this.secondCharChangedOfString(regex,String.fromCharCode(charCode))
                const response = await axios.get(`https://api.datamuse.com/words?sp=${regex}&max=1000`);
                const responseToArray = response.data.map((wordInfo: any) => wordInfo.word)
                words.push(...this.filter(responseToArray,lettersOUT,lettersIN,regex))
              }
        if(firstQuestionMarkIndex === 0)
          regex = this.firstCharChangedOfString(regex,"?")
        else
          regex = this.secondCharChangedOfString(regex,"?")
      } else if(this.questionMarks == 5) {
        for (let charCode = 'a'.charCodeAt(0); charCode <= 'z'.charCodeAt(0); charCode++)
          if(!lettersOUT.includes(String.fromCharCode(charCode)) ) {
            regex = this.firstCharChangedOfString(regex,String.fromCharCode(charCode))
            for (let charCode2 = 'a'.charCodeAt(0); charCode2 <= 'z'.charCodeAt(0); charCode2++)
              if(!this.arrayContainsElement(lettersOUT,String.fromCharCode(charCode)) ) {
                regex = this.secondCharChangedOfString(regex,String.fromCharCode(charCode2))
                const response = await axios.get(`https://api.datamuse.com/words?sp=${regex}&max=1000`);
                const responseToArray = response.data.map((wordInfo: any) => wordInfo.word)
                words.push(...this.filter(responseToArray,lettersOUT,lettersIN,regex))
              }
          }
      } else {
        const response = await axios.get(`https://api.datamuse.com/words?sp=${regex}&max=1000`);
        const responseToArray = response.data.map((wordInfo: any) => wordInfo.word)
        words.push(...this.filter(responseToArray,lettersOUT,lettersIN,regex))
      }
      return words;
    }
    catch (error) {
      console.error('Error fetching words:', error);
      return [];
    }
  }
}
