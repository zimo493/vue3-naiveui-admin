import type { ToRefs } from "vue";
import DictDataAPI from "@/api/system/dict/data";
import { useDictStoreHook } from "@/store";

/**
 * 获取字典列表组合式封装
 */
export function useDict<T extends string>(...args: T[]): ToRefs<DictData.Compose> {
  const dictStore = useDictStoreHook();

  /**
   * 用 store 缓存初始化
   */
  const res = reactive<DictData.Compose>(
    Object.fromEntries(args.map((typeCode) => [typeCode, dictStore.getDict(typeCode) || []]))
  );

  args.forEach((typeCode: string) => {
    /**
     * 如果缓存中没有该字典，则从后端获取
     */
    if (!res[typeCode].length) {
      void DictDataAPI.getDictItems(typeCode).then((data) => {
        res[typeCode] = data;
        dictStore.setDict(typeCode, data);
      });
    }
  });

  return toRefs(res);
}
