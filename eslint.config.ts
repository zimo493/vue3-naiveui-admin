// 基础ESLint配置
import js from "@eslint/js";
import globals from "globals";

// TypeScript支持
import tsEslint from "typescript-eslint";

// Vue支持
import vueParser from "vue-eslint-parser";
import vuePlugin from "eslint-plugin-vue";

// 代码风格与格式化
import eslintConfigPrettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

// 自动导入的全局变量
import autoImportGlobals from "./.eslintrc-auto-import.json";

// 环境变量
const isDevelopment = process.env.NODE_ENV !== "production";

export default tsEslint.config(
  // 基础配置
  js.configs.recommended,
  // TypeScript 配置
  ...tsEslint.configs.recommended,
  {
    // 全局配置
    files: ["**/*.{js,mjs,cjs,ts,tsx,vue}"],
    ignores: ["**/.*", "dist/*", "**/*.d.ts", "public/*", "src/assets/**"],
    // 自定义规则
    rules: {
      // 开发辅助
      "no-console": isDevelopment ? "off" : "warn",
      "no-debugger": isDevelopment ? "off" : "warn",

      // 代码风格
      "no-multiple-empty-lines": [
        "error",
        {
          max: 1, // 最多允许连续的空行数
          maxEOF: 1, // 文件末尾最多允许的空行数
          maxBOF: 0, // 文件开头不允许空行
        },
      ],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" }, // return 语句前需要空行
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" }, // 变量声明后需要空行
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }, // 连续变量声明之间空行可选
        { blankLine: "always", prev: "directive", next: "*" }, // 指令后需要空行
        { blankLine: "always", prev: "import", next: "*" }, // import 语句后需要空行
        { blankLine: "any", prev: "import", next: "import" }, // 连续 import 之间空行可选
        { blankLine: "always", prev: ["case", "default"], next: "*" }, // case/default 后需要空行
      ],

      // 格式化
      "prettier/prettier": [
        "error", // 使用 Prettier 进行格式化
        {
          endOfLine: "auto", // 自动识别换行符
        },
      ],

      // 变量使用
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // 忽略参数名以 _ 开头的参数未使用警告
          varsIgnorePattern: "^[A-Z0-9_]+$", // 忽略变量名为大写字母、数字或下划线组合的未使用警告（枚举定义未使用场景）
          ignoreRestSiblings: true, // 忽略解构赋值中同级未使用变量的警告
        },
      ],

      // 最佳实践
      eqeqeq: ["error", "always"], // 总是使用 === 而不是 ==
      "no-var": "error", // 禁止使用 var
      "prefer-const": "error", // 如果变量不会被重新赋值，使用 const
      "object-shorthand": ["error", "always"], // 使用对象简写语法
    },
  },
  // 全局变量配置
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...autoImportGlobals.globals,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // 基础规则
      "no-undef": "off", // TypeScript已处理此问题

      // 类型相关
      "@typescript-eslint/no-explicit-any": "off", // 允许使用 any
      "@typescript-eslint/no-empty-function": "off", // 允许空函数
      "@typescript-eslint/no-empty-object-type": "off", // 允许空对象类型
      "@typescript-eslint/no-extraneous-class": "off", // 允许空类
      "@typescript-eslint/no-non-null-assertion": "off", // 允许使用非空断言

      // 导入相关
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { disallowTypeAnnotations: false, fixStyle: "inline-type-imports" },
      ], // 统一类型导入风格

      // 变量使用
      "no-unused-vars": "off", // 关闭原生规则，使用TypeScript版本
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // 忽略参数名以 _ 开头的参数未使用警告
          varsIgnorePattern: "^[A-Z0-9_]+$", // 忽略变量名为大写字母、数字或下划线组合的未使用警告
          ignoreRestSiblings: true, // 忽略解构赋值中同级未使用变量的警告
        },
      ],

      // 代码风格
      "@typescript-eslint/explicit-function-return-type": "off", // 不强制要求函数返回类型
      "@typescript-eslint/explicit-module-boundary-types": "off", // 不强制要求模块边界类型
      "@typescript-eslint/no-inferrable-types": "warn", // 可推断类型不需要显式声明
    },
  },
  // Vue 配置
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsEslint.parser,
        tsconfigRootDir: __dirname,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      vue: vuePlugin,
    },
    processor: vuePlugin.processors[".vue"],
    rules: {
      // 使用Vue3推荐规则，避免使用可能不存在的配置
      ...vuePlugin.configs.recommended.rules,

      // 基础规则
      "no-undef": "off", // TypeScript已处理此问题

      // Vue特定规则
      "vue/no-v-html": "off", // 允许使用 v-html
      "vue/require-default-prop": "off", // 允许没有默认值的 prop
      "vue/multi-word-component-names": "off", // 允许单字组件名
      "vue/no-setup-props-destructure": "off", // 允许在setup中解构props (Vue3.2+响应式已修复此问题)
      "vue/attribute-hyphenation": ["error", "always"], // 强制使用连字符格式

      // TypeScript相关
      "@typescript-eslint/no-unsafe-function-type": "off", // 允许使用无参数的函数类型
      "@typescript-eslint/no-unused-expressions": "off", // 允许使用无表达式的表达式
      "@typescript-eslint/no-explicit-any": "off", // 允许使用 any
      "@typescript-eslint/no-inferrable-types": "warn", // 可推断类型不需要显式声明

      // 变量使用
      "no-unused-vars": "off", // 关闭原生规则，使用TypeScript版本
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // 忽略参数名以 _ 开头的参数未使用警告
          varsIgnorePattern: "^[A-Z0-9_]+$", // 忽略变量名为大写字母、数字或下划线组合的未使用警告
          ignoreRestSiblings: true, // 忽略解构赋值中同级未使用变量的警告
        },
      ],

      // 模板规则
      "vue/html-self-closing": [
        "error", // 强制自闭和标签
        {
          html: { void: "always", normal: "always", component: "always" },
          svg: "always",
          math: "always",
        },
      ],

      // 关闭一些可能导致解析错误的规则
      "vue/valid-template-root": "off", // 关闭无效的根元素
      "vue/no-multiple-template-root": "off", // 关闭多个根元素
    },
  },
  // Prettier 配置
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...eslintConfigPrettier.rules,
      "prettier/prettier": ["error", {}, { usePrettierrc: true }],
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
    },
  }
);
