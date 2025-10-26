import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Colors } from '../../../enums/colors.enum';
import { Cell } from '../../../interfaces/cell';
import { Constants } from '../../../enums/consts';

@Component({
  selector: 'app-grid-cell',
  imports: [],
  templateUrl: './grid-cell.component.html',
  styleUrl: './grid-cell.component.scss'
})
export class GridCellComponent {
  @Input() level!: number;
  @Input() row!: number;
  @Input() col!: number;

  Colors = Colors;

  @Output() cellDropped: EventEmitter<{ source: Cell, target: Cell }> = new EventEmitter();
  @Output() adaptDrop: EventEmitter<Cell> = new EventEmitter();

  onDrag($event: DragEvent) {
    if (this.level === 0) {
      $event.preventDefault();
    }

    $event.dataTransfer?.setData(`application/level-${this.level}-${this.row}-${this.col}`, JSON.stringify({ level: this.level, row: this.row, col: this.col }));
    $event.dataTransfer?.setData(`text/plain`, JSON.stringify({ level: this.level, row: this.row, col: this.col }));
  }

  onDragOver($event: DragEvent) {
    $event.preventDefault();
    const types = Array.from($event.dataTransfer!.types);
    const match = types.map(type => type.match(/^application\/level-(\d+)-(\d+)-(\d+)$/)).find(Boolean);
    if (match) {
      const level = parseInt(match[1], 10);
      const row = parseInt(match[2], 10);
      const col = parseInt(match[3], 10);
      if (level === this.level && !(row == this.row && col == this.col)) {
        this.adaptDrop.emit({ level, row: this.row, col: this.col });
      }
    }
  }

  onDrop($event: DragEvent) {
    const data = $event.dataTransfer?.getData('text/plain');
    if (data) {
      const draggedCell = JSON.parse(data);
      if (draggedCell.level === this.level && !(draggedCell.row == this.row && draggedCell.col == this.col)) {
        this.cellDropped.emit({ source: draggedCell, target: { level: this.level >= Constants.MaxCellLevel ? 0 : this.level + 1, row: this.row, col: this.col } })
      }
    }
  }

}
