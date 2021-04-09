import range from "lodash/range";
import chunk from "lodash/chunk";
import type { CellType } from "./types";

export class Crossword {
  rows: number;
  cols: number;
  cells: Array<Array<CellType | undefined>>;
  across: Array<Array<CellType>> = [];
  down: Array<Array<CellType>> = [];

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.cells = chunk(
      range(0, rows * cols).map((id) => {
        return { id };
      }),
      cols
    );
    this.renumber();
  }

  renumber() {
    let id = 0;
    for (const row of this.cells) {
      for (let cell of row) {
        if (!cell) {
          continue;
        }
        cell.id = id;
        id += 1;
      }
    }

    this.across = [];
    this.down = [];
    let number = 1;
    for (const [r, row] of this.cells.entries()) {
      for (const [c, cell] of row.entries()) {
        if (!cell) {
          continue;
        }
        const isAcross = c === 0 || !this.cells[r][c - 1];
        const isDown = r === 0 || !this.cells[r - 1][c];

        if (isAcross || isDown) {
          cell.number = number;
          number += 1;
          if (isAcross) {
            this.across.push(this.calculateAcross(r, c));
          } else {
            this.down.push(this.calculateDown(r, c));
          }
        } else {
          cell.number = undefined;
        }
      }
    }
  }

  calculateAcross(row: number, col: number): Array<CellType> {
    let cells: Array<CellType> = [];
    while (this.cells[row]?.[col]) {
      cells = [...cells, this.cells[row][col]!];
      col += 1;
    }
    return cells;
  }

  calculateDown(row: number, col: number): Array<CellType> {
    let cells: Array<CellType> = [];
    while (this.cells[row]?.[col]) {
      cells = [...cells, this.cells[row][col]!];
      row += 1;
    }
    return cells;
  }

  toggleCell(row: number, col: number) {
    let cell = this.cells[row][col];
    this.cells[row][col] = cell ? undefined : { id: -1 };
    this.renumber();
  }
}
