export type CellType = {
  id: number,
  number?: number;
  value?: string;
};

export type Message = InitMessage | Query | Solution;

export interface InitMessage  {
  kind: "init",
}

export interface Query {
  kind: "query",
  input: Array<Array<number>>,
}

export interface Solution {
  kind: "solution",
  output: BigInt,
}