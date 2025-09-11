### ✨ Features

| 影响模块 | 描述 | 修改日期 | 作者 |
| --- | --- | :--: | --- |
| `utils` | 重构时间格式化函数，支持更灵活的时间格式化 | `2025/9/10` | [@NuyOah](https://github.com/zimo493) |
| `form-tip-label` | 添加 `reverse` 属性，支持标签和帮助信息的反向布局 | `2025/9/10` | [@NuyOah](https://github.com/zimo493) |
| `form-pro` | 增加 `labelReverse` 属性，用于应用 `form-tip-label` 控制标签和提示信息的布局顺序 | `2025/9/10` | [@NuyOah](https://github.com/zimo493) |
| `utils` | 添加 `getJsonSizeWithUnit` 函数，用于获取 JSON 对象的字节大小和单位，并在 `字典管理` 页面中显示字典缓存 | `2025/9/10` | [@NuyOah](https://github.com/zimo493) |

### 🐛 Fixes

| 影响模块 | 描述 | 修改日期 | 作者 |
| --- | --- | :--: | --- |
| `cron-tab` | 修复 `cron-tab` 组件中的 `CronResult` 被错误的拼写为 `Result` | `2025/9/9` | [@NuyOah](https://github.com/zimo493) |

### ♻️ Refactor

| 影响模块 | 描述 | 修改日期 | 作者 |
| --- | --- | :--: | --- |
| `appVersion` | 重构应用版本更新提示功能，将通知方式从 `notification` 改为 `dialog` 防止用户在更新提示时进行其他操作，保留原有的 `notification` 方式 | `2025/9/11` | [@NuyOah](https://github.com/zimo493) |

## 🎉 v2.0.0

`2025-09-09`

### ✨ Features

| 影响模块 | 描述 | 修改日期 | 作者 |
| --- | --- | :--: | --- |
| `generate-code` | 添加多语言支持 | `2025/8/2` | [@NuyOah](https://github.com/zimo493) |
| `image-cut` | 添加 `webp` 图片格式支持 | `2025/8/6` | [@NuyOah](https://github.com/zimo493) |
| `app` | 添加 `系统更新提示` 功能 | `2025/8/8` | [@NuyOah](https://github.com/zimo493) |
| `form-pro` | 添加字段块状提示信息功能并支持自定义组件 | `2025/8/11` | [@NuyOah](https://github.com/zimo493) |
| `directives` | 添加 `fitScreen` 自定义指令用于适配全屏 | `2025/8/13` | [@NuyOah](https://github.com/zimo493) |
| `views` | 添加数据大屏页面 | `2025/8/13` ~ `2025/8/19` | [@NuyOah](https://github.com/zimo493) |
| `form-pro` | 添加 `单选按钮组组件` 支持 | `2025/8/28` | [@NuyOah](https://github.com/zimo493) |
| `table-pro` | 添加 `表格配置功能` 并优化表格样式 | `2025/9/5` | [@NuyOah](https://github.com/zimo493) |
| `watermark` | 添加 `水印设置功能` 并添加水印设置相关翻译 | `2025/9/8` | [@NuyOah](https://github.com/zimo493) |
| `system` | 优化用户管理页面不允许删除当前用户 | `2025/9/8` | [@NuyOah](https://github.com/zimo493) |
| `form-pro` | 添加 `颜色选择器` `滑块选择器` 组件 | `2025/9/9` | [@NuyOah](https://github.com/zimo493) |

### 🐛 Fixes

| 影响模块 | 描述 | 修改日期 | 作者 |
| --- | --- | :--: | --- |
| `i18n` | 修改 `zh_TW.json` 错误翻译文案 | `2025/8/1` | [@NuyOah](https://github.com/zimo493) |
| `dict-item` | 修复重置按钮事件处理 | `2025/8/2` | [@NuyOah](https://github.com/zimo493) |
| `html-plugin` | 修复构建时间戳的插入和获取逻辑 | `2025/8/15` | [@NuyOah](https://github.com/zimo493) |
| `layout` | 修复页面过渡动画设置后的页面刷新问题 | | [@NuyOah](https://github.com/zimo493) |

### ♻️ Refactor

| 影响模块 | 描述 | 修改日期 | 作者 |
| --- | --- | :--: | --- |
| `menu` | 移除侧边栏自动折叠功能 | `2025/8/1` | [@NuyOah](https://github.com/zimo493) |
| `sql` | 修改系统工具菜单路径 | `2025/8/1` | [@NuyOah](https://github.com/zimo493) |
| `layout` | 优化首页图标引 | `2025/8/1` | [@NuyOah](https://github.com/zimo493) |
| `form-pro` | 调整表单标签宽度设置 | `2025/8/1` | [@NuyOah](https://github.com/zimo493) |
| `i18n` | 优化字典项清除成功提示信息 | `2025/8/1` | [@NuyOah](https://github.com/zimo493) |
| `profile` | 重构个人资料页面 | `2025/8/4` | [@NuyOah](https://github.com/zimo493) |
| `route` | 重构路由处理逻辑 | `2025/8/21` | [@NuyOah](https://github.com/zimo493) |
| `keep-alive` | 优化页面缓存机制，使用路由 `fullPath` 作为组件名称缓存 | `2025/9/4` | [@NuyOah](https://github.com/zimo493) |
| `eslint` | 强制 `Vue` 组件属性使用连字符格式 | `2025/9/4` | [@NuyOah](https://github.com/zimo493) |
| `components` | 统一组件命名格式，将所有组件名称改为小写 | `2025/9/5` | [@NuyOah](https://github.com/zimo493) |
| `layout` | 限制侧边栏宽度设置范围 | `2025/9/8` | [@NuyOah](https://github.com/zimo493) |
| `lang-switch` | 更新语言切换图标为地球图标 | `2025/9/8` | [@NuyOah](https://github.com/zimo493) |
| `app-version` | 优化系统更新提示功能，只允许用户刷新，不允许取消 | `2025/9/8` | [@NuyOah](https://github.com/zimo493) |
