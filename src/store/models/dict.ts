import { store } from "@/store";

export const useDictStore = defineStore("dict-store", {
  // state
  state: (): { dict: Dict.StoreType[] } => ({
    dict: [],
  }),
  actions: {
    // 获取字典
    getDict(_key: string | null) {
      if (_key === null && _key === "") {
        return [];
      }
      try {
        for (let i = 0; i < this.dict.length; i++) {
          if (this.dict[i].key === _key) {
            return this.dict[i].value;
          }
        }
      } catch (e) {
        console.error(e);

        return [];
      }
    },
    // 设置字典
    setDict(_key: string | null, value: DictData.Option[]) {
      if (_key !== null && _key !== "") {
        for (let i = 0; i < this.dict.length; i++) {
          if (this.dict[i].key === _key) {
            return;
          }
        }
        this.dict.push({
          key: _key,
          value,
        });
      }
    },
    // 删除字典
    removeDict(_key: string) {
      let bln = false;

      try {
        for (let i = 0; i < this.dict.length; i++) {
          if (this.dict[i].key === _key) {
            this.dict.splice(i, 1);

            return true;
          }
        }
      } catch (e) {
        console.error(e);
        bln = false;
      }

      return bln;
    },
    // 清空字典
    cleanDict() {
      this.dict = [];
      this.$reset();
    },
    // 初始字典
    initDict() {
      console.log("init");
    },
  },
  persist: { storage: sessionStorage },
});

export const useDictStoreHook = () => useDictStore(store);
