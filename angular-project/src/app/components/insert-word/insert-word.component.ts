import { Component } from '@angular/core';

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
    // Fill the first five empty buttons with the first five letters from the input
    for (let i = 0; i < this.word.length && i < 5; i++) {
      this.buttonLetters[this.grids.length - 1][i] = this.word[i];
      }
  }
  
  validateInput(event: any) {
    const input = event.target.value;
    this.word = input.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5);
  }

  isValidWord() {
    return /^[a-zA-Z]+$/.test(this.word);
  }

  
}
