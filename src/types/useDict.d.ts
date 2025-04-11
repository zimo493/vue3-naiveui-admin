declare namespace Dict {
  interface StoreType {
    key: string;
    value: DictData.VO[];
  }
  interface DictItem {
    [key: string]: DictData.VO[];
  }
}
