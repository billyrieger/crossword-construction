import type { CellKind } from ".";

export type Coords = {
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
