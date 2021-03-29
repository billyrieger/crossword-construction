import _ from "lodash";
import { CellType, CellKind } from "./types";

export class Crossword {
    rows: number;
    cols: number;
    cells: CellType[][];

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

    toggleCell(row: number, col: number): void {
        if (this.cells[row][col].kind === CellKind.OPEN) {
            this.cells[row][col] = { kind: CellKind.BLOCK };
        } else {
            this.cells[row][col] = { kind: CellKind.OPEN };
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
        console.log(entries);
        return entries;
    }
}
