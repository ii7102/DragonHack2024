import { Component, ViewChildren, QueryList } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-insert-word',
  templateUrl: './insert-word.component.html',
  styleUrls: ['./insert-word.component.css']
})
export class InsertWordComponent {
  grids: number[] = [1]; // Initialize the grids array with one element
  buttonColors: string[][] = [['#D3D3D3', '#D3D3D3', '#D3D3D3', '#D3D3D3', '#D3D3D3']]; // Initialize the button color array with grey
  word: string = '';
  buttonLetters: string[][] = [['', '', '', '', '']]; // Initialize the button letters array with empty strings
  elements: number=1
  questionMarks = 0
  charCountArray: number[] = []

  @ViewChildren('letterButton') letterButtons!: QueryList<any>; // Add ! to indicate that it will be initialized later
  grey: string[]=[];
  yellow: string[]=[]
  green:string[]=['?', '?', '?', '?', '?']
  boolYellow: boolean[]=[]

  constructor() { } // Added constructor

  addGrid() {
    // Add a new element to the grids array
    if(this.elements<4){
      this.grids.push(1);
      this.elements+=1
    }
  
    // Add a new array of colors to the buttonColors array with grey color
    this.buttonColors.push(['#D3D3D3', '#D3D3D3', '#D3D3D3', '#D3D3D3', '#D3D3D3']);
    
    // Add a new array of button letters with empty strings
    this.buttonLetters.push(['', '', '', '', '']);
  }
  

  changeColor(gridIndex: number, buttonIndex: number) {
    switch(this.buttonColors[gridIndex][buttonIndex]) {
      case '#D3D3D3': // If the color is grey, change it to green
        this.buttonColors[gridIndex][buttonIndex] = '#69AE45';
        break;
      case '#69AE45': // If the color is green, change it to yellow
        this.buttonColors[gridIndex][buttonIndex] = '#E5DB35';
        break;
      case '#E5DB35': // If the color is yellow, change it to grey
        this.buttonColors[gridIndex][buttonIndex] = '#D3D3D3';
        break;
      default:
        break;
    }
  }

  onSubmit() {
    let index = this.buttonLetters.findIndex((letters) => letters.includes(''));
    if (index === -1) {
      index = this.buttonLetters.length;
      this.addGrid();
    }
    for (let i = 0; i < this.word.length && i < 5; i++) {
      this.buttonLetters[index][i] = this.word[i];
    }
  }
  
  validateInput(event: any) {
    const input = event.target.value;
    this.word = input.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5);
  }

  isValidWord() {
    return /^[a-zA-Z]+$/.test(this.word);
  }

  onClick() {
    this.yellow = []
    this.grey = []
    this.grids.forEach((_, gridIndex) => {
      const buttonsInGrid = this.letterButtons.toArray().slice(gridIndex * 5, (gridIndex + 1) * 5);
      this.boolYellow.fill(false);
      buttonsInGrid.forEach((button, buttonIndex) => { // Here you get the index of the button in the grid
        const buttonText = button.nativeElement.textContent.trim();
        const buttonColor = button.nativeElement.style.background;
        // console.log(buttonColor);
        // console.log('Button index in grid:', buttonIndex); // This line logs the index of the button in the current grid
        if (buttonColor === 'rgb(211, 211, 211)' && !this.yellow.includes(buttonText) && !this.grey.includes(buttonText)) {
          this.grey.push(buttonText.toLowerCase());
        } else if (buttonColor ===  'rgb(105, 174, 69)' && !this.yellow.includes(buttonText) && !this.green.includes(buttonText)) {
          this.green[buttonIndex]=buttonText.toLowerCase();
        } else if (buttonColor === 'rgb(229, 219, 53)') {
          if (this.yellow.includes(buttonText)) {
            const index = this.yellow.indexOf(buttonText);
            if (!this.boolYellow[index]) {
              this.boolYellow[index] = true;
            } else if (this.boolYellow[index]) {
              this.yellow.push(buttonText.toLowerCase());
              this.boolYellow.push(true)
            }
          } else {
            this.yellow.push(buttonText.toLowerCase());
          }
        }
      });
    });

    this.charCountArray = Array(26).fill(0);
    this.questionMarks = 0
    console.log(this.grey)
    console.log(this.yellow)
    console.log(this.green)
    this.callAlgorithm(this.grey, this.yellow, this.green.join("")).then(words => {
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
  
  async callAlgorithm(lettersOUT: string[], lettersIN: string[], regex: string): Promise<string[]> {
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
}
