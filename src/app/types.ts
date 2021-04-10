export type CellType = {
    id: number;
    number?: number;
    value?: string;
};

export type Entry = Array<number>;

export type WorkerMsg =
    | Init
    | WordlistAppend
    | WordlistClear
    | EntriesAppend
    | EntriesClear
    | BeginSearch;

export type ReturnMsg =
    | Void
    | SolutionFound;

export type Void = {
    kind: "Void",
};

export  type SolutionFound = {
    kind: "SolutionFound"
};

export interface Init {
    kind: "INIT";
}

export interface WordlistAppend {
    kind: "WORDLIST_APPEND";
    words: Array<string>;
}

export interface WordlistClear {
    kind: "WORDLIST_CLEAR";
}

export interface EntriesAppend {
    kind: "ENTRIES_APPEND";
    entries: Array<Entry>;
}

export interface EntriesClear {
    kind: "ENTRIES_CLEAR";
}

export interface BeginSearch {
    kind: "BEGIN_SEARCH";
}
