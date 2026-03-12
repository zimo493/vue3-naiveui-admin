import { store } from "@/store";

/**
 * 字典缓存 Store
 * 用于在前端缓存字典数据，避免重复请求后端接口
 */
export const useDictStore = defineStore("dict-store", {
  state: (): Status.Dict => ({
    /**
     * 字典缓存
     * key: 字典编码 typeCode
     * value: 字典项列表
     */
    dict: {},
  }),

  actions: {
    /**
     * 获取字典项列表
     * @param key 字典编码
     * @returns 字典项列表，不存在时返回 null
     */
    getDict(key: string): DictData.Option[] | null {
      if (!key) return null;

      return this.dict[key] ?? null;
    },

    /**
     * 设置字典项列表，已存在则覆盖更新
     * @param key 字典编码
     * @param value 字典项列表
     */
    setDict(key: string, value: DictData.Option[]) {
      if (!key) return;
      this.dict[key] = value;
    },

    /**
     * 删除指定字典缓存
     * @param key 字典编码
     * @returns 删除成功返回 true，不存在返回 false
     */
    removeDict(key: string): boolean {
      if (!key || !(key in this.dict)) return false;
      delete this.dict[key];

      return true;
    },

    /**
     * 清空所有字典缓存
     */
    cleanDict() {
      this.dict = {};
    },
  },
  persist: { storage: sessionStorage },
});

export const useDictStoreHook = () => useDictStore(store);
