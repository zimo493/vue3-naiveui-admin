export interface TableData {
  key: number;
  name: string;
  age: number;
  address: string;
  chinese: number;
  math: number;
  english: number;
  avatar?: string;
  photo?: string[];
}

export interface Form extends Partial<TableData> {
  dict?: string | number;
  dicts?: string[] | number[];
  options?: number;
}

export interface Search extends Partial<TableData>, PageQuery {
  createTime?: [string, string];
  dict?: string;
  options?: number;
  checkbox?: number[] | string[];
  time?: string;
  date?: string;
  dateTime?: string;
}
