export type CellType = {
  number?: number;
  value?: string;
};

export type Message = InitMessage | Query | Solution;

export interface InitMessage  {
  kind: "init",
}

export interface Query {
  kind: "query",
  input: number,
}

export interface Solution {
  kind: "solution",
  output: number,
}