export const enum CellKind {
  Block = 0,
  Open,
}

export const enum CellDecoration {
  None = 0,
  Circle,
}

export const enum Direction {
  Across = 0,
  Down,
}

export type GridPos = {
  row: number;
  col: number;
};

export type Dimensions = {
  rows: number;
  cols: number;
};

export interface Block {
  kind: CellKind.Block;
}

export interface Open {
  kind: CellKind.Open;
  value?: string;
  number?: number;
}

export type Cell = Block | Open;

export type Entry = {
  dir: Direction;
  cells: Open[];
  coords: GridPos[];
};
