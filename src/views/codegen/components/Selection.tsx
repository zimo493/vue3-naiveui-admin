import type { VNodeChild } from "vue";
import { type SelectOption, type SelectRenderTag, NSelect, NFlex, NText } from "naive-ui";

export default defineComponent({
  name: "Selection",
  props: {
    modelValue: { type: [String, Number] },
    options: { type: Array as PropType<OptionType[]>, default: () => [] },
    filterable: { type: Boolean, default: true },
    clearable: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
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
        placeholder="请选择字典类型"
      />
    );
  },
});
