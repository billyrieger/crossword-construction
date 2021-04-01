import _ from "lodash";
import { CellType, CellKind } from "./types";

enum Symmetry {
    NONE,
    ROT180,
}

export class Crossword {
    rows: number;
    cols: number;
    cells: CellType[][];
    symmetry: Symmetry = Symmetry.ROT180;

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.cells = _.chunk(
            _.range(0, rows * cols).map((id) => {
                return { kind: CellKind.OPEN, id };
            }),
            cols
        );
        this.renumber();
    }

    public sample(): void {
        console.log("XXX");
        const blocks = [
            [0, 4],
            [0, 10],
            [1, 4],
            [1, 10],
            [2, 4],
            [2, 10],
            [3, 7],
            [4, 0],
            [4, 1],
            [4, 2],
            [4, 8],
            [4, 12],
            [4, 13],
            [4, 14],
            [5, 5],
            [5, 9],
            [6, 10],
            [7, 3],
            [7, 11],
            [8, 4],
            [9, 5],
            [9, 9],
            [10, 0],
            [10, 1],
            [10, 2],
            [10, 6],
            [10, 12],
            [10, 13],
            [10, 14],
            [11, 7],
            [12, 4],
            [12, 10],
            [13, 4],
            [13, 10],
            [14, 4],
            [14, 10],
        ];
        for (const r of _.range(this.rows)) {
            for (const c of _.range(this.cols)) {
                if (_.find(blocks, (e) => _.isEqual(e, [r, c]))) {
                    this.cells[r][c] = { kind: CellKind.BLOCK };
                } else {
                    this.cells[r][c] = { kind: CellKind.OPEN };
                }
            }
        }
        this.renumber();
    }

    private map([row, col]: [number, number]): [number, number][] {
        switch (this.symmetry) {
            case Symmetry.NONE:
                return [[row, col]];
            case Symmetry.ROT180:
                return [
                    [row, col],
                    [this.rows - row - 1, this.cols - col - 1],
                ];
        }
    }

    toggleCell(row: number, col: number): void {
        if (this.cells[row][col].kind === CellKind.OPEN) {
            for (const [r, c] of this.map([row, col])) {
                this.cells[r][c] = { kind: CellKind.BLOCK };
            }
        } else {
            for (const [r, c] of this.map([row, col])) {
                this.cells[r][c] = { kind: CellKind.OPEN };
            }
        }
        this.renumber();
    }

    renumber(): void {
        let idCounter = 0;
        let numberCounter = 1;
        for (const r of _.range(0, this.rows)) {
            for (const c of _.range(0, this.cols)) {
                if (this.cells[r][c].kind === CellKind.OPEN) {
                    this.cells[r][c].id = idCounter;
                    idCounter += 1;
                    if (
                        r === 0 ||
                        c === 0 ||
                        this.cells[r - 1][c].kind === CellKind.BLOCK ||
                        this.cells[r][c - 1].kind === CellKind.BLOCK
                    ) {
                        this.cells[r][c].number = numberCounter;
                        numberCounter += 1;
                    } else {
                        this.cells[r][c].number = undefined;
                    }
                }
            }
        }
    }

    entries(): number[][] {
        let entries = [];
        // Across entries.
        for (const r of _.range(0, this.rows)) {
            let currentEntry = [];
            for (const c of _.range(0, this.cols)) {
                const cell = this.cells[r][c];
                if (cell.kind === CellKind.OPEN) {
                    currentEntry = [...currentEntry, cell.id];
                } else if (currentEntry.length > 0) {
                    entries = [...entries, currentEntry];
                    currentEntry = [];
                }
            }
            if (currentEntry.length > 0) {
                entries = [...entries, currentEntry];
            }
        }
        // Down entries.
        for (const c of _.range(0, this.cols)) {
            let currentEntry = [];
            for (const r of _.range(0, this.rows)) {
                const cell = this.cells[r][c];
                if (cell.kind === CellKind.OPEN) {
                    currentEntry = [...currentEntry, cell.id];
                } else if (currentEntry.length > 0) {
                    entries = [...entries, currentEntry];
                    currentEntry = [];
                }
            }
            if (currentEntry.length > 0) {
                entries = [...entries, currentEntry];
            }
        }
        return entries;
    }
}
