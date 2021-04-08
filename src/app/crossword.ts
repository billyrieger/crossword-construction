import _ from "lodash";
import type { CellType } from "./types";

export class Crossword {
  rows: number;
  cols: number;
  cells: Array<Array<CellType | undefined>>;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.cells = _.chunk(
      _.range(0, rows * cols).map(() => {
        return {};
      }),
      cols
    );
    this.renumber();
  }

  renumber() {
    let counter = 0;
    for (const [r, row] of this.cells.entries()) {
      for (const [c, cell] of row.entries()) {
        if (!cell) {
          continue;
        }
        const isEntryStart =
          r === 0 || c === 0 || !this.cells[r - 1][c] || !this.cells[r][c - 1];
        if (isEntryStart) {
          counter += 1;
          cell.number = counter;
        } else {
          cell.number = undefined;
        }
      }
    }
  }

  toggleCell(row: number, col: number) {
    this.cells[row][col] = this.cells[row][col] ? undefined : {};
    this.renumber();
  }
}
