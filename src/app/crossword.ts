import range from "lodash/range";
import cloneDeep from "lodash/cloneDeep";
import type { CellType, Coords, Entry } from "./types";
import type { Maybe } from "./types/util";

export enum CellKind {
    Block = 0,
    Open = 1,
}

export interface Block {
    kind: CellKind.Block;
}

export interface Open {
    kind: CellKind.Open;
    value?: string;
    number?: number;
}

export type Cell = Block | Open;

export class Crossword {
    readonly rows: number;
    readonly cols: number;
    private cells: Cell[];

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.cells = range(0, rows * cols).map(() => {
            return { kind: CellKind.Open };
        });
        this.assignNumbers();
    }

    inbounds({ row, col }: Coords): boolean {
        return 0 <= row && row < this.rows && 0 <= col && col < this.cols;
    }

    get(coords: Coords): Maybe<Cell> {
        if (this.inbounds(coords)) {
            return cloneDeep(this.cells[coords.row * this.cols + coords.col]);
        }
    }

    has(coords: Coords): boolean {
        return this.get(coords) !== undefined;
    }

    set(coords: Coords, cell: Cell): Crossword {
        let result = cloneDeep(this);
        if (this.inbounds(coords)) {
            result.cells[coords.row * this.cols + coords.col] = cell;
            result.assignNumbers();
        }
        return result;
    }

    update(coords: Coords, update: Partial<Cell>): Crossword {
        let result = cloneDeep(this);
        result.updateMut(coords, update);
        result.assignNumbers();
        return result;
    }

    slots(): Array<Coords[]> {
        let slots = [];
        for (const row of range(0, this.rows)) {
            for (const col of range(0, this.cols)) {
                const cell = this.get({ row, col })!;
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

    private updateMut(coords: Coords, update: Partial<Cell>) {
        if (this.inbounds(coords)) {
            let cell = this.get(coords)!;
            this.cells[coords.row * this.cols + coords.col] = {
                ...cell,
                ...update,
            };
        }
    }

    private assignNumbers() {
        let number = 1;
        for (const row of range(0, this.rows)) {
            for (const col of range(0, this.cols)) {
                if (!this.has({ row, col })) {
                    continue;
                }
                const left = this.get({ row, col: col - 1 });
                const isAcross = !left || left.kind === CellKind.Block;

                const above = this.get({ row: row - 1, col });
                const isDown = !above || above.kind === CellKind.Block;

                if (isAcross || isDown) {
                    this.updateMut({ row, col }, { number: number });
                    number += 1;
                } else {
                    this.updateMut({ row, col }, { number: undefined });
                }
            }
        }
    }

    private calculateAcross(coords: Coords): Coords[] {
        let slot: Coords[] = [];
        while (this.get(coords)?.kind === CellKind.Open) {
            slot.push(cloneDeep(coords));
            coords.col += 1;
        }
        return slot;
    }

    private calculateDown(coords: Coords): Coords[] {
        let slot: Coords[] = [];
        while (this.get(coords)?.kind === CellKind.Open) {
            slot.push(cloneDeep(coords));
            coords.row += 1;
        }
        return slot;
    }
}
