import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GridCellComponent } from "./grid-cell/grid-cell.component";
import { Cell } from '../../interfaces/cell';

@Component({
  selector: 'app-play',
  imports: [CommonModule, GridCellComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent implements OnInit {

  rows = [0, 1, 2, 3, 4, 5, 6];
  cols = [0, 1, 2, 3, 4];

  cells: { level: number; row: number; col: number; }[][] = [];

  adaptableHoveredCell: Cell = { level: 0, row: -1, col: -1 };
  score = 0;

  ngOnInit() {
    this.initiateGame();
  }

  initiateGame() {
    this.cells = this.rows.map((row, rowIndex) => {
      return this.cols.map((col, colIndex) => {
        return { level: rowIndex < this.rows.length - 1 ? 0 : this.getRandomCellLevel(), row: rowIndex, col: colIndex };
      });
    });
  }

  getRandomCellLevel(): number {
    return Math.ceil(Math.random() * 3);
  }

  onCellDrop(event: { source: Cell, target: Cell }) {
    this.cells[event.source.row][event.source.col].level = 0;
    this.cells[event.target.row][event.target.col].level = event.target.level;

    this.rearrangeCells();

    if (!this.isMergableCellsAvailable()) {
      for (let i = 1; i <= this.rows.length - 1; i++) {
        this.cols.forEach((col, index) => {
          this.cells[i - 1][index].level = this.cells[i][index].level;
        })
      }
      this.cells[this.rows.length - 1].forEach(cell => cell.level = this.getRandomCellLevel());
    }
    this.adaptableHoveredCell = { level: 0, row: -1, col: -1 }
    this.score += 10;
  }

  isMergableCellsAvailable(): boolean {
    const flatCells = this.cells.flat();
    for (let i = 0; i < flatCells.length; i++) {
      for (let j = i + 1; j < flatCells.length; j++) {
        if (flatCells[i].level !== 0 && flatCells[i].level === flatCells[j].level) {
          return true;
        }
      }
    }
    return false;
  }

  rearrangeCells() {
    for (let i = this.rows.length - 1; i > 0; i--) {
      this.cols.forEach((col) => {
        if (this.cells[i][col].level == 0) {
          this.cells[i][col].level = this.cells[i - 1][col].level;
          this.cells[i - 1][col].level = 0;
        }
      })
    }
  }

  setAdaptCell(cell: Cell) {
    this.adaptableHoveredCell = cell;
  }

}
