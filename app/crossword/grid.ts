import type { Cell } from "./types";
import { CellKind } from ".";
import type { Coords } from "../types";

import cloneDeep from "lodash/cloneDeep";
import range from "lodash/range";

export class Grid {
    readonly rows: number;
    readonly cols: number;
    private cells: Cell[];

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.cells = range(0, rows * cols).map(() => {
            return { kind: CellKind.Open };
        });
        this.assignNumbersMut();
    }

    get(coords: Coords): Cell | undefined {
        if (this.inbounds(coords)) {
            return cloneDeep(this.cells[coords.row * this.cols + coords.col]);
        }
    }

    set(coords: Coords, cell: Cell): Grid {
        let result = cloneDeep(this);
        if (this.inbounds(coords)) {
            result.cells[coords.row * this.cols + coords.col] = cell;
            result.assignNumbersMut();
        }
        return result;
    }

    update(coords: Coords, update: Partial<Cell>): Grid {
        let result = cloneDeep(this);
        result.updateMut(coords, update);
        result.assignNumbersMut();
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

    private inbounds({ row, col }: Coords): boolean {
        return 0 <= row && row < this.rows && 0 <= col && col < this.cols;
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

    private assignNumbersMut() {
        let number = 1;
        for (const row of range(0, this.rows)) {
            for (const col of range(0, this.cols)) {
                const cell = this.get({row, col});
                if (!cell || cell.kind === CellKind.Block) {
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
