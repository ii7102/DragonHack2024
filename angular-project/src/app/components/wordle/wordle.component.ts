import {Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren} from '@angular/core';

import {WORDS} from './words';

// Lenght of the word
const WORD_LENGTH = 5;

// Number of tries
const NUM_TRIES = 6;

// Letter map
const LETTERS = (() => {
  const ret: {[key: string]: boolean} = {};
  for (let charCode = 97; charCode < 97 + 26; charCode++) {
    ret[String.fromCharCode(charCode)] = true;
  }
  return ret;
})();

//One try
interface Try {
  letters: Letter[];
}

//One letter in a try.
interface Letter {
  text: string;
  state: LetterState;
}

enum LetterState {

  WRONG,
  //There is a letter but not on correct position
  PARTIAL_MATCH,
  //Whole word is a mach
  FULL_MATCH,
  //Before the try is submitted
  PENDING,
}

@Component({
  selector: 'wordle',
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.scss'],
})
export class WordleComponent {
  @ViewChildren('tryContainer') tryContainers!: QueryList<ElementRef>;

  words = WORDS;
  wordsWithLengthFive: string[];

  selectedWord!: string;
  selectedMode!: string;

  //Every player starts with 0 points
  player1Points: number = 0;
  player2Points: number = 0;

  selectPlayer(player: string) {
    this.selectedMode = player;
  }

  //calculating the total point of a player
  calculatePoints(points: number) {
    if (this.selectedMode === 'player1') {
      this.player1Points += points;
    } else if (this.selectedMode === 'player2') {
      this.player2Points += points;
    }
  }
  
  //the tries are stored
  tries: Try[] = [];

  //make LetterState accesible in html
  readonly LetterState = LetterState;

  //these are the keybord rows
  readonly keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
  ];

  //State of keybord by index
  curLetterStates: {[key: string]: LetterState} = {};

  //Final message
  infoMsg = '';
  fadeOutInfoMessage = false;
  showShareDialogContainer = false;
  showShareDialog = false;

  //Current letter index
  private curLetterIndex = 0;

  //Number of submitted tries
  private numSubmittedTries = 0;

  //The target word for guessing
  private targetWord = '';

  //Final situation, win of loose
  private won = false;

  //storing a counter for each letter
  private targetWordLetterCounts: {[letter: string]: number} = {};

  
  constructor() {
    //Getting the words with 5 letters
    this.wordsWithLengthFive = this.words.filter(word => word.length === 5);
    //The first selected word is the first word in the array
    this.selectedWord = this.wordsWithLengthFive[0];
  }


  funkcija() {
    //Initial state of every call
    this.tries = [];
    this.curLetterStates = {};
    this.infoMsg = '';
    this.fadeOutInfoMessage = false;
    this.showShareDialogContainer = false;
    this.showShareDialog = false;
    this.curLetterIndex = 0;
    this.numSubmittedTries = 0;
    this.targetWord = '';
    this.won = false;
  

    for (let i = 0; i < NUM_TRIES; i++) {
      const letters: Letter[] = [];
      for (let j = 0; j < WORD_LENGTH; j++) {
        letters.push({text: '', state: LetterState.PENDING});
      }
      this.tries.push({letters});
    }

    this.targetWord=this.selectedWord.toLowerCase();

    //you can use this part for cheating (:
    console.log('solution= ',this.selectedWord);
    

    //Counting letters of the target word
    for (const letter of this.targetWord) {
      const count = this.targetWordLetterCounts[letter];
      if (count == null) {
        this.targetWordLetterCounts[letter] = 0;
      }
      this.targetWordLetterCounts[letter]++;
    }
    console.log(this.targetWordLetterCounts);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.handleClickKey(event.key);
  }

  getKeyClass(key: string): string {
    const state = this.curLetterStates[key.toLowerCase()];
    switch (state) {
      case LetterState.FULL_MATCH:
        return 'match key';
      case LetterState.PARTIAL_MATCH:
        return 'partial key';
      case LetterState.WRONG:
        return 'wrong key';
      default:
        return 'key';
    }
  }

  handleClickKey(key: string) {
    if (this.won) {
      return;
    }
    //if the pressed key is a letter display it in the corresponding box
    if (LETTERS[key.toLowerCase()]) {
      if (this.curLetterIndex < (this.numSubmittedTries + 1) * WORD_LENGTH) {
        this.setLetter(key);
        this.curLetterIndex++;
      }
    }
    else if (key === 'Backspace') {
      //We dont delete the previous tries
      if (this.curLetterIndex > this.numSubmittedTries * WORD_LENGTH) {
        this.curLetterIndex--;
        this.setLetter('');
      }
    }//you check your try with pressing Enter
    else if (key === 'Enter') {
      this.checkCurrentTry();
    }
  }

  handleClickShare() {

    let clipboardContent = '';
    for (let i = 0; i < this.numSubmittedTries; i++) {
      for (let j = 0; j < WORD_LENGTH; j++) {
        const letter = this.tries[i].letters[j];
        switch (letter.state) {
          case LetterState.FULL_MATCH:
            clipboardContent += '🟩';
            break;
          case LetterState.PARTIAL_MATCH:
            clipboardContent += '🟨';
            break;
          case LetterState.WRONG:
            clipboardContent += '⬜';
            break;
          default:
            break;
        }
      }
      clipboardContent += '\n';
    }
    console.log(clipboardContent);
    navigator.clipboard.writeText(clipboardContent);
    this.showShareDialogContainer = false;
    this.showShareDialog = false;
    this.showInfoMessage('Copied results to clipboard');
  }

  private setLetter(letter: string) {
    const tryIndex = Math.floor(this.curLetterIndex / WORD_LENGTH);
    const letterIndex = this.curLetterIndex - tryIndex * WORD_LENGTH;
    this.tries[tryIndex].letters[letterIndex].text = letter;
  }

  private async checkCurrentTry() {
    const curTry = this.tries[this.numSubmittedTries];
    if (curTry.letters.some(letter => letter.text === '')) {
      this.showInfoMessage('Not enough letters');
      return;
    }

    const wordFromCurTry =
        curTry.letters.map(letter => letter.text).join('').toUpperCase();
    if (!WORDS.includes(wordFromCurTry)) {
      this.showInfoMessage('Not in word list');
      const tryContainer =
          this.tryContainers.get(this.numSubmittedTries)?.nativeElement as
          HTMLElement;
      tryContainer.classList.add('shake');
      setTimeout(() => {
        tryContainer.classList.remove('shake');
      }, 500);
      return;
    }

  
    const targetWordLetterCounts = {...this.targetWordLetterCounts};
    const states: LetterState[] = [];
    for (let i = 0; i < WORD_LENGTH; i++) {
      const expected = this.targetWord[i];
      const curLetter = curTry.letters[i];
      const got = curLetter.text.toLowerCase();
      let state = LetterState.WRONG;
      
      if (expected === got && targetWordLetterCounts[got] > 0) {
        targetWordLetterCounts[expected]--;
        state = LetterState.FULL_MATCH;
      } else if (
          this.targetWord.includes(got) && targetWordLetterCounts[got] > 0) {
        targetWordLetterCounts[got]--
        state = LetterState.PARTIAL_MATCH;
      }
      states.push(state);
    }
    console.log(states);

   
    const tryContainer =
        this.tryContainers.get(this.numSubmittedTries)?.nativeElement as
        HTMLElement;
   
    const letterEles = tryContainer.querySelectorAll('.letter-container');
    for (let i = 0; i < letterEles.length; i++) {
      
      const curLetterEle = letterEles[i];
      curLetterEle.classList.add('fold');
      await this.wait(180);
      curTry.letters[i].state = states[i];
      curLetterEle.classList.remove('fold');
      await this.wait(180);
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
      const curLetter = curTry.letters[i];
      const got = curLetter.text.toLowerCase();
      const curStoredState = this.curLetterStates[got];
      const targetState = states[i];
  
      if (curStoredState == null || targetState > curStoredState) {
        this.curLetterStates[got] = targetState;
      }
    }

    this.numSubmittedTries++;

    // Check if all letters in the current try are correct
    if (states.every(state => state === LetterState.FULL_MATCH)) {
      this.showInfoMessage('NICE!');
      this.won = true;
      this.calculatePoints(7-this.numSubmittedTries);
      // Animation
      for (let i = 0; i < letterEles.length; i++) {
        const curLetterEle = letterEles[i];
        curLetterEle.classList.add('bounce');
        await this.wait(160);
      }
      this.showShare();
      return;
    }

   
    if (this.numSubmittedTries === NUM_TRIES) {
   
      this.showInfoMessage(this.targetWord.toUpperCase(), false);
      this.showShare();
      this.calculatePoints(0);

    }
  }

  private showInfoMessage(msg: string, hide = true) {
    this.infoMsg = msg;
    if (hide) {
      setTimeout(() => {
        this.fadeOutInfoMessage = true;
        setTimeout(() => {
          this.infoMsg = '';
          this.fadeOutInfoMessage = false;
        }, 500);
      }, 2000);
    }
  }

  private async wait(ms: number) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    })
  }

  private showShare() {
    setTimeout(() => {
      this.showShareDialogContainer = true;
      setTimeout(() => {
        this.showShareDialog = true;
      });
    }, 1500);
  }
}
