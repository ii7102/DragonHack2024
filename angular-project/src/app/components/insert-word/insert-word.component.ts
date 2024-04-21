import { Component, ViewChildren, QueryList } from '@angular/core';

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

  @ViewChildren('letterButton') letterButtons!: QueryList<any>; // Add ! to indicate that it will be initialized later
  grey: string[]=[];
  yellow: string[]=[]
  green:string[]=['?', '?', '?', '?', '?']
  boolYellow: boolean[]=[]

  constructor() { } // Added constructor

  addGrid() {
    // Add a new element to the grids array
    if(this.elements<5){
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
    this.grids.forEach((_, gridIndex) => {
      const buttonsInGrid = this.letterButtons.toArray().slice(gridIndex * 5, (gridIndex + 1) * 5);
      this.boolYellow.fill(false);
      buttonsInGrid.forEach((button, buttonIndex) => { // Here you get the index of the button in the grid
        const buttonText = button.nativeElement.textContent.trim();
        const buttonColor = button.nativeElement.style.background;
        // console.log(buttonColor);
        // console.log('Button index in grid:', buttonIndex); // This line logs the index of the button in the current grid
        if (buttonColor === 'rgb(211, 211, 211)' && !this.yellow.includes(buttonText) && !this.grey.includes(buttonText)) {
          this.grey.push(buttonText);
        } else if (buttonColor ===  'rgb(105, 174, 69)' && !this.yellow.includes(buttonText) && !this.green.includes(buttonText)) {
          this.green[buttonIndex]=buttonText;
        } else if (buttonColor === 'rgb(229, 219, 53)') {
          if (this.yellow.includes(buttonText)) {
            const index = this.yellow.indexOf(buttonText);
            if (!this.boolYellow[index]) {
              this.boolYellow[index] = true;
            } else if (this.boolYellow[index]) {
              this.yellow.push(buttonText);
              this.boolYellow.push(true)
            }
          } else {
            this.yellow.push(buttonText);
          }
        }
      });
    });
  
    console.log('Grey:', this.grey);
    console.log('Green:', this.green);
    console.log('Yellow:', this.yellow);
  }
  
  
}
