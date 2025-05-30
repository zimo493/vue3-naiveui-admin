import { NCheckbox } from "naive-ui";

export default defineComponent({
  name: "EditableCheckbox",
  props: {
    modelValue: { type: Number },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const val = computed({
      get: () => props.modelValue ?? 0,
      set: (v) => emit("update:modelValue", v),
    });

    return () => <NCheckbox v-model:checked={val.value} checked-value={1} unchecked-value={0} />;
  },
});
