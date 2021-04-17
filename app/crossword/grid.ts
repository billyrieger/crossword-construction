import { CellKind, Direction, Open } from ".";
import type { Cell, GridPos, Entry } from ".";

import cloneDeep from "lodash/cloneDeep";

export class Grid {
  readonly rows: number;
  readonly cols: number;
  private cells: Cell[];

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.cells = new Array(rows * cols).map(() => {
      return { kind: CellKind.Open };
    });
    this.assignNumbersMut();
  }

  get(coords: GridPos): Cell | undefined {
    if (this.inbounds(coords)) {
      return this.getUnchecked(coords);
    }
  }

  getUnchecked = (coords: GridPos): Cell => {
    return cloneDeep(this.cells[coords.row * this.cols + coords.col]);
  };

  set(coords: GridPos, cell: Cell): Grid {
    let result = cloneDeep(this);
    if (this.inbounds(coords)) {
      result.cells[coords.row * this.cols + coords.col] = cell;
      result.assignNumbersMut();
    }
    return result;
  }

  addRow = (): Grid => {
    let result = new Grid(this.rows + 1, this.cols);
    return result;
  };

  update(coords: GridPos, update: Partial<Cell>): Grid {
    let result = cloneDeep(this);
    result.updateMut(coords, update);
    result.assignNumbersMut();
    return result;
  }

  entries(): Array<Entry> {
    let slots = [];
    for (let row = 0; row < this.rows; row += 1) {
      for (let col = 0; col < this.cols; col += 1) {
        const cell = this.getUnchecked({ row, col });
        if (cell.kind === CellKind.Block) {
          continue;
        }
        const left = this.get({ row, col: col - 1 });
        const isAcross = !left || left.kind === CellKind.Block;

        const above = this.get({ row: row - 1, col });
        const isDown = !above || above.kind === CellKind.Block;

        if (isAcross) {
          slots.push(this.calculateAcross({ row, col }));
        }
        if (isDown) {
          slots.push(this.calculateDown({ row, col }));
        }
      }
    }
    return slots;
  }

  private inbounds({ row, col }: GridPos): boolean {
    return 0 <= row && row < this.rows && 0 <= col && col < this.cols;
  }

  private updateMut(coords: GridPos, update: Partial<Cell>) {
    if (this.inbounds(coords)) {
      let cell = this.get(coords)!;
      if (update.kind === CellKind.Block) {
        this.cells[coords.row * this.cols + coords.col] = {
          kind: CellKind.Block,
        };
      } else {
        this.cells[coords.row * this.cols + coords.col] = {
          ...cell,
          ...update,
        };
      }
    }
  }

  private assignNumbersMut = () => {
    let number = 1;
    for (let row = 0; row < this.rows; row += 1) {
      for (let col = 0; col < this.cols; col += 1) {
        const cell = this.get({ row, col });
        if (!cell || cell.kind === CellKind.Block) {
          continue;
        }
        const across = this.get({ row, col: col - 1 })?.kind !== CellKind.Open;
        const down = this.get({ row: row - 1, col })?.kind !== CellKind.Open;
        if (across || down) {
          this.updateMut({ row, col }, { number: number });
          number += 1;
        } else {
          this.updateMut({ row, col }, { number: undefined });
        }
      }
    }
  };

  private calculateAcross = ({ row, col }: GridPos): Entry => {
    const entry: Entry = { dir: Direction.Across, cells: [], coords: [] };
    while (this.get({ row, col })?.kind === CellKind.Open) {
      entry.cells.push(<Open>this.get({ row, col }));
      entry.coords.push({ row, col });
      col += 1;
    }
    return entry;
  };

  private calculateDown = ({ row, col }: GridPos): Entry => {
    const entry: Entry = { dir: Direction.Down, cells: [], coords: [] };
    while (this.get({ row, col })?.kind === CellKind.Open) {
      entry.cells.push(<Open>this.get({ row, col }));
      entry.coords.push({ row, col });
      row += 1;
    }
    return entry;
  };
}
