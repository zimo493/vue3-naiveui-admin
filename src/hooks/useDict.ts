import type { ToRefs } from "vue";
import DictDataAPI from "@/api/system/dict/data";
import { useDictStoreHook } from "@/store";

export function useDict<T extends string>(...args: T[]): ToRefs<Dict.DictItem> {
  const res = ref<Dict.DictItem>({});

  args.forEach((dictType: string) => {
    res.value[dictType] = [];
    const dict = useDictStoreHook().getDict(dictType);

    if (dict) res.value[dictType] = dict;
    else {
      DictDataAPI.getDictItemPage(dictType, {
        pageNum: 1,
        pageSize: 999,
      }).then(({ list }): void => {
        res.value[dictType] = list;
        useDictStoreHook().setDict(dictType, res.value[dictType]);
      });
    }
  });

  return toRefs(res.value);
}
