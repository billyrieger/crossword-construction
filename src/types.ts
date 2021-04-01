export enum CellKind {
    BLOCK,
    OPEN,
}

export type CellType = {
    kind: CellKind;
    id?: number;
    value?: string;
    number?: number;
};

export type OpenCell = {
    id: number;
    value?: string;
    number?: number;
};
