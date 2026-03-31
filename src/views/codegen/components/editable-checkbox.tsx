import { NCheckbox } from "naive-ui";

export default defineComponent({
  name: "EditableCheckbox",
  props: {
    modelValue: { type: Number, default: 0 },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const val = computed({
      get: () => props.modelValue,
      set: (v) => emit("update:modelValue", v),
    });

    return () => <NCheckbox v-model:checked={val.value} checked-value={1} unchecked-value={0} />;
  },
});
