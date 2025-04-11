declare namespace Dict {
  interface StoreType {
    key: string;
    value: DictData.Option[];
  }
  interface DictItem {
    [key: string]: DictData.Option[];
  }
}
