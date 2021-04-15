export const enum CellKind {
  Block = "CellKind_Block",
  Open = "CellKind_Open",
}

export const enum CellDecoration {
  None = "CellDecoration_None",
  Circle = "CellDecoration_Circle",
}

export const enum Direction {
  Across = "Direction_Across",
  Down = "Direction_Down",
}

export type GridPos = {
  row: number;
  col: number;
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
