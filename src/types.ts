export enum CellKind {
    BLOCK,
    OPEN,
}

export type CellType = {
    kind: CellKind,
    id?: number,
    value?: string;
    number?: number;
}