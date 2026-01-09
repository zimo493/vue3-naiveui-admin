import type { VNodeChild } from "vue";
import { type SelectOption, type SelectRenderTag, NSelect, NFlex, NText } from "naive-ui";

export default defineComponent({
  name: "Selection",
  props: {
    modelValue: { type: [String, Number] },
    options: { type: Array as PropType<OptionItem[]>, default: () => [] },
    filterable: { type: Boolean, default: true },
    clearable: { type: Boolean, default: false },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { t } = useI18n();

    const val = computed({
      get: () => props.modelValue,
      set: (v) => emit("update:modelValue", v),
    });

    return () => (
      <NSelect
        v-model:value={val.value}
        options={props.options}
        clearable={props.clearable}
        filterable={props.filterable}
        consistent-menu-width={false}
        render-label={(option: SelectOption): VNodeChild => (
          <NFlex>
            <NText>{option.label}</NText>
            <NText>{option.value}</NText>
          </NFlex>
        )}
        render-tag={({ option }: { option: SelectOption }): SelectRenderTag => (
          <NText>{option.label}</NText>
        )}
        placeholder={t("codeGen.tableHeader.dictType")}
      />
    );
  },
});
