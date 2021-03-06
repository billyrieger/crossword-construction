import { CellKind, Direction, Open } from ".";
import type { Cell, GridPos, Entry } from ".";

import cloneDeep from "lodash/cloneDeep";

export class Grid {
  readonly rows: number;
  readonly cols: number;
  private _cells: Array<Cell & GridPos>;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    let i = 0;
    this._cells = new Array(rows * cols).fill(0).map(() => {
      const coords = { row: Math.floor(i / cols), col: i % cols };
      const cell = { kind: CellKind.Open };
      i += 1;
      return { ...cell, ...coords };
    });
    this.assignNumbersMut();
  }

  get cells(): ReadonlyArray<Cell & GridPos> {
    return this._cells;
  }

  allCells(): Array<Cell & GridPos> {
    return cloneDeep(this._cells);
  }

  getCell(coords: GridPos): Cell | undefined {
    if (this.inbounds(coords)) {
      return this.getCellUnchecked(coords);
    }
  }

  getCellUnchecked(coords: GridPos): Cell {
    return cloneDeep(this._cells[coords.row * this.cols + coords.col]);
  }

  setCell({ row, col }: GridPos, cell: Cell): Grid {
    let result = cloneDeep(this);
    if (this.inbounds({ row, col })) {
      result._cells[row * this.cols + col] = { ...cell, row, col };
      result.assignNumbersMut();
    }
    return result;
  }

  updateCell(coords: GridPos, update: Partial<Open>): Grid {
    let result = cloneDeep(this);
    result.updateMut(coords, update);
    result.assignNumbersMut();
    return result;
  }

  entries(): Entry[] {
    let entries = [];
    for (const { row, col } of this._cells.filter(
      (cell) => cell.kind === CellKind.Open
    )) {
      const isAcross =
        this.getCell({ row, col: col - 1 })?.kind !== CellKind.Open;
      const isDown =
        this.getCell({ row: row - 1, col })?.kind !== CellKind.Open;
      if (isAcross) {
        entries.push(this.calculateAcross({ row, col }));
      }
      if (isDown) {
        entries.push(this.calculateDown({ row, col }));
      }
    }
    return entries;
  }

  private assignNumbersMut() {
    let number = 1;
    for (const { row, col } of this._cells.filter(
      (cell) => cell.kind === CellKind.Open
    )) {
      const isAcross =
        this.getCell({ row, col: col - 1 })?.kind !== CellKind.Open;
      const isDown =
        this.getCell({ row: row - 1, col })?.kind !== CellKind.Open;
      if (isAcross || isDown) {
        this.updateMut({ row, col }, { number: number });
        number += 1;
      } else {
        this.updateMut({ row, col }, { number: undefined });
      }
    }
  }

  private inbounds({ row, col }: GridPos): boolean {
    return 0 <= row && row < this.rows && 0 <= col && col < this.cols;
  }

  private updateMut({ row, col }: GridPos, update: Partial<Open>) {
    const cell = this.getCell({ row, col });
    if (cell?.kind === CellKind.Open) {
      this._cells[row * this.cols + col] = { ...cell, ...update, row, col };
    }
  }

  private calculateAcross({ row, col }: GridPos): Entry {
    let entry: Entry = { dir: Direction.Across, cells: [], coords: [] };
    while (this.getCell({ row, col })?.kind === CellKind.Open) {
      entry.cells.push(<Open>this.getCell({ row, col }));
      entry.coords.push({ row, col });
      col += 1;
    }
    return entry;
  }

  private calculateDown({ row, col }: GridPos): Entry {
    let entry: Entry = { dir: Direction.Down, cells: [], coords: [] };
    while (this.getCell({ row, col })?.kind === CellKind.Open) {
      entry.cells.push(<Open>this.getCell({ row, col }));
      entry.coords.push({ row, col });
      row += 1;
    }
    return entry;
  }
}
