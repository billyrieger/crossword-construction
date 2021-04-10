export type Maybe<T> = T | undefined;

export type DeepReadonly<T> = T extends (infer R)[]
    ? DeepReadonlyArray<R>
    : T extends Function
    ? T
    : T extends object
    ? DeepReadonlyObject<T>
    : T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export interface CellType {
    id: number;
    number?: number;
    value?: string;
};

export type Entry = Array<number>;

export enum MsgKind {
    INIT = "INIT",
    RESET = "RESET",
    ADD_WORD = "ADD_WORD",
    ADD_ENTRY = "ADD_ENTRY",
    BEGIN_SEARCH = "BEGIN_SEARCH",
    SOLUTION_FOUND = "SOLUTION_FOUND",
}

export interface Init {
    msgKind: MsgKind.INIT;
}

export interface Reset {
    msgKind: MsgKind.RESET;
}

export interface AppendWord {
    msgKind: MsgKind.ADD_WORD;
    word: string;
}

export interface AppendEntry {
    msgKind: MsgKind.ADD_ENTRY;
    entry: Entry;
}

export interface BeginSearch {
    msgKind: MsgKind.BEGIN_SEARCH;
}

export interface SolutionFound {
    msgKind: MsgKind.SOLUTION_FOUND;
    solution: string;
}

export type WorkerMsg = Init | Reset | AppendWord | AppendEntry | BeginSearch;

export type ReturnMsg = SolutionFound;
