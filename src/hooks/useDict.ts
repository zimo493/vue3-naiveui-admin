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
      DictDataAPI.getDictItems(dictType).then((data): void => {
        res.value[dictType] = data;
        useDictStoreHook().setDict(dictType, res.value[dictType]);
      });
    }
  });

  return toRefs(res.value);
}
