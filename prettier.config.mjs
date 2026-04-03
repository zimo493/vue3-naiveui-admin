export default {
  // 箭头函数参数是否始终加括号
  // 可选值: "always" | "avoid"
  // always: (x) => x
  // avoid: x => x
  arrowParens: "always",

  // HTML 标签的 > 是否单独换行
  // 可选值: true | false
  // false: <div\n  class="a">\n
  // true:  <div\n  class="a"\n>
  bracketSameLine: false,

  // 对象字面量中括号两边是否有空格
  // 可选值: true | false
  // true: { foo: bar }
  // false: {foo: bar}
  bracketSpacing: true,

  // 是否格式化嵌入代码（如 HTML 中的 JS/CSS）
  // 可选值: "auto" | "off"
  // auto: 自动格式化嵌入代码
  embeddedLanguageFormatting: "auto",

  // HTML 空白敏感度
  // 可选值: "css" | "strict" | "ignore"
  // css: 按 CSS display 规则处理
  // strict: 严格保留
  // ignore: 忽略空白（更激进压缩）
  htmlWhitespaceSensitivity: "ignore",

  // 每行最大字符数，超过会换行
  // 常见值: 80 / 100 / 120
  printWidth: 100,

  // Markdown 文本是否换行
  // 可选值: "always" | "never" | "preserve"
  // preserve: 保留原样
  proseWrap: "preserve",

  // 对象属性是否加引号
  // 可选值: "as-needed" | "consistent" | "preserve"
  // as-needed: 只有必要时加（推荐）
  quoteProps: "as-needed",

  // 语句结尾是否加分号
  // 可选值: true | false
  // true: 强制加分号
  semi: true,

  // 字符串是否使用单引号
  // 可选值: true | false
  // false: 使用双引号
  // true: 使用单引号（更常见）
  singleQuote: false,

  // 缩进空格数
  // 常见值: 2 / 4
  tabWidth: 2,

  // 尾随逗号
  // 可选值: "none" | "es5" | "all"
  // none: 不加
  // es5: ES5 支持的地方加（对象、数组等）
  // all: 所有地方都加（包括函数参数）
  trailingComma: "es5",

  // 是否使用 tab 缩进
  // 可选值: true | false
  // false: 使用空格
  useTabs: false,

  // Vue 文件中 script 和 style 是否额外缩进
  // 可选值: true | false
  // false: 不额外缩进（更扁平）
  vueIndentScriptAndStyle: false,

  // 行尾符
  // 可选值: "lf" | "crlf" | "cr" | "auto"
  // auto: 根据系统自动判断（跨平台推荐）
  endOfLine: "auto",

  overrides: [
    {
      // 针对 html 文件单独配置
      files: "*.html",
      options: {
        // 指定解析器
        // 可选值: "html" | "babel" | "vue" 等
        parser: "html",
      },
    },
  ],
};
