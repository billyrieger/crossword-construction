import { CellKind } from ".";
import type { Cell, GridPos } from ".";

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

    get(coords: GridPos): Cell | undefined {
        if (this.inbounds(coords)) {
            return cloneDeep(this.cells[coords.row * this.cols + coords.col]);
        }
    }

    set(coords: GridPos, cell: Cell): Grid {
        let result = cloneDeep(this);
        if (this.inbounds(coords)) {
            result.cells[coords.row * this.cols + coords.col] = cell;
            result.assignNumbersMut();
        }
        return result;
    }

    update(coords: GridPos, update: Partial<Cell>): Grid {
        let result = cloneDeep(this);
        result.updateMut(coords, update);
        result.assignNumbersMut();
        return result;
    }

    slots(): Array<GridPos[]> {
        let slots = [];
        for (const row of range(0, this.rows)) {
            for (const col of range(0, this.cols)) {
                const cell = this.get({ row, col })!;
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

    private assignNumbersMut() {
        let number = 1;
        for (const row of range(0, this.rows)) {
            for (const col of range(0, this.cols)) {
                const cell = this.get({ row, col });
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

    private calculateAcross(coords: GridPos): GridPos[] {
        let { row, col } = coords;
        let slot: GridPos[] = [];
        while (this.get({ row, col })?.kind === CellKind.Open) {
            slot.push({ row, col });
            col += 1;
        }
        return slot;
    }

    private calculateDown(coords: GridPos): GridPos[] {
        let { row, col } = coords;
        let slot: GridPos[] = [];
        while (this.get({ row, col })?.kind === CellKind.Open) {
            slot.push({ row, col });
            row += 1;
        }
        return slot;
    }
}
