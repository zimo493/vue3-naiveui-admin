<script lang="tsx">
import { NFlex, NTag } from "naive-ui";
import { toRefs } from "vue";

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
  setup(props) {
    // 使用 toRefs 确保 props 的响应性
    const { options, value, round, bordered, separator } = toRefs(props);

    // 将value转换为数组
    const valueArray = computed(() =>
      Array.isArray(value.value) ? value.value : value.value.toString().split(separator.value)
    );

    // 获取有效的选项
    const displayedOptions = computed(() =>
      valueArray.value.map((item) => {
        const valueStr = item.toString();
        const option = options.value.find((opt) => opt.value === valueStr);

        return option || { value: valueStr, label: valueStr, tagType: undefined };
      })
    );

    return () => (
      <NFlex justify="center" align="center" size="small">
        {displayedOptions.value.map((option) => {
          if (!option.tagType) {
            return option.label;
          } else {
            return (
              <NTag
                key={option.value}
                type={option.tagType}
                round={round.value}
                bordered={bordered.value}
              >
                {option.label}
              </NTag>
            );
          }
        })}
      </NFlex>
    );
  },
});
</script>
