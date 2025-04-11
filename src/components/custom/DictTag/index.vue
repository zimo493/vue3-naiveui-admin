<script lang="tsx">
import { NSpace, NTag, type TagProps } from "naive-ui";

export default defineComponent({
  name: "DictTag",
  props: {
    // 字典数据列表
    options: { type: Array as PropType<DictData.Option[]>, required: true },
    // 字典值
    value: {
      type: [String, Number, Array] as PropType<string | number | (string | number)[]>,
      required: true,
    },
    // 是否圆角
    round: { type: Boolean, default: false },
    // 是否显示边框
    bordered: { type: Boolean, default: false },
    // 如果传递的不是数组类型，则使用分隔符进行分割，默认为 ,
    separator: { type: String, default: "," },
  },
  setup({ options, value, round, bordered, separator }) {
    // 将value转换为数组
    const valueArray = computed(() =>
      Array.isArray(value) ? value : value.toString().split(separator)
    );

    // 获取有效的选项
    const displayedOptions = computed(() =>
      valueArray.value.map((item) => {
        const valueStr = item.toString();
        const option = options.find((opt) => opt.value === valueStr);

        return option || { value: valueStr, label: valueStr, tagType: undefined };
      })
    );

    // 转换标签类型
    const getTagType = (type: DictData.Option["tagType"]): TagProps["type"] => {
      if (type === "danger") return "error";

      return type || "default";
    };

    return () => (
      <NSpace justify="center" size="small">
        {displayedOptions.value.map((option) => (
          <NTag
            key={option.value}
            type={getTagType(option.tagType)}
            round={round}
            bordered={bordered}
          >
            {option.label}
          </NTag>
        ))}
      </NSpace>
    );
  },
});
</script>
