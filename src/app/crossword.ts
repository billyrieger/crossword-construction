import range from "lodash/range";
import chunk from "lodash/chunk";
import cloneDeep from "lodash/cloneDeep";
import inRange from "lodash/inRange";
import type { CellType, Entry } from "./types";
import type { Maybe } from "./types/util";

export class Crossword {
    readonly rows: number;
    readonly cols: number;
    private cells: Array<Array<CellType | undefined>>;

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.cells = chunk(
            range(0, rows * cols).map(() => {
                return {};
            }),
            cols
        );
        this.assignNumbersInPlace();
    }

    private assignNumbersInPlace() {
        let number = 1;
        for (const r of range(0, this.rows)) {
            for (const c of range(0, this.cols)) {
                let cell = this.cells[r][c];
                if (!cell) {
                    continue;
                }
                const isAcross = c === 0 || !this.cells[r][c - 1];
                const isDown = r === 0 || !this.cells[r - 1][c];
                if (isAcross || isDown) {
                    cell.number = number;
                    number += 1;
                } else {
                    cell.number = undefined;
                }
            }
        }
    }

    getCell(row: number, col: number): Maybe<CellType> {
        return cloneDeep(this.cells[row]?.[col]);
    }

    private updateCellInPlace(
        row: number,
        col: number,
        update: Maybe<Partial<CellType>>
    ) {
        if (inRange(row, 0, this.rows) && inRange(col, 0, this.cols)) {
            if (update) {
                this.cells[row][col] = { ...this.cells[row][col], ...update };
            } else {
                this.cells[row][col] = undefined;
            }
        }
    }

    updateCell(
        row: number,
        col: number,
        update: Partial<Maybe<CellType>>
    ): Crossword {
        let result = cloneDeep(this);
        result.updateCellInPlace(row, col, update);
        return result;
    }

    calculateAcross(row: number, col: number): Array<CellType> {
        let cells: Array<CellType> = [];
        while (this.cells[row]?.[col]) {
            cells = [...cells, this.cells[row][col]!];
            col += 1;
        }
        return cells;
    }

    calculateDown(row: number, col: number): Array<CellType> {
        let cells: Array<CellType> = [];
        while (this.cells[row]?.[col]) {
            cells = [...cells, this.cells[row][col]!];
            row += 1;
        }
        return cells;
    }

    applySolution(solution: string): Crossword {
        let result = cloneDeep(this);
        let counter = 0;

        for (const row of result.cells) {
            for (let cell of row) {
                if (!cell) {
                    continue;
                }
                cell.value = solution.charAt(counter);
                counter += 1;
            }
        }

        return result;
    }
}
