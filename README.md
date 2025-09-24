<div align="center">
  <h1>vue3-naiveui-admin</h1>

  ![Vue.js](https://img.shields.io/badge/Vue-3.5.21-42B883?logo=vuedotjs)
  ![Vite](https://img.shields.io/badge/Vite-7.1.5-bd34fe?logo=vite&logoColor=bd34fe)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript)
  ![UnoCSS](https://img.shields.io/badge/UnoCSS-66.5.1-333?logo=unocss)
  ![NaiveUI](https://img.shields.io/badge/NaiveUI-2.42.0-63e2b7.svg)
</div>

## 项目介绍

🚀 **vue3-naiveui-admin** 是一个基于 `Vue3` + `Vite` + `TypeScript` + `Naive UI` 构建的**极简开箱即用**的企业级后台管理前端模板。

### 生态系统

| 项目 | 说明 | 技术栈 |
|------|------|--------|
| **vue3-naiveui-admin** | 🎯 当前项目 | Vue3 + NaiveUI + TypeScript |
| [youlai-boot](https://gitee.com/youlaiorg/youlai-boot) | ☕ Java 后端 | Spring Boot + MyBatis Plus |
| [youlai-nest](https://gitee.com/youlaiorg/youlai-nest) | 🟢 Node 后端 | Nest.js + TypeORM |

### 多版本支持  
> 💡 **Element Plus 版本同步更新**

| 版本 | 说明 | 仓库地址 |
|------|------|----------|
| **标准版** | 功能完整的管理系统 | [vue3-element-admin](https://gitee.com/youlaiorg/vue3-element-admin) |
| **精简版** | 轻量级开发模板 | [vue3-element-template](https://gitee.com/youlaiorg/vue3-element-template) |
| **JS 版** | JavaScript 版本 | [vue3-element-admin-js](https://gitee.com/youlaiorg/vue3-element-admin-js) |

## 快速链接

<table align="center">
  <tr>
    <td align="center">
      <a href="https://vue.youlai.tech/naiveui" target="_blank">
        <img src="https://img.shields.io/badge/🌐_在线预览-0052CC?style=for-the-badge" alt="在线预览" />
      </a>
    </td>
    <td align="center">
      <a href="https://www.youlai.tech/naiveui-docs" target="_blank">
        <img src="https://img.shields.io/badge/📚_使用文档-FF6B35?style=for-the-badge" alt="使用文档" />
      </a>
    </td>
    <td align="center">
      <a href="https://gitee.com/zimo493/vue3-naiveui-admin" target="_blank">
        <img src="https://img.shields.io/badge/💾_Gitee_仓库-C71D23?style=for-the-badge" alt="Gitee仓库" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/zimo493/vue3-naiveui-admin" target="_blank">
        <img src="https://img.shields.io/badge/💾_GitHub_仓库-181717?style=for-the-badge" alt="GitHub仓库" />
      </a>
    </td>
  </tr>
</table>

## 核心特性 

### 技术栈
- **前端框架：** `Vue 3.5` + `Vite 7` + `TypeScript` + `TSX`
- **UI 组件库：** `Naive UI` - 简洁、现代的 Vue 3 组件库  
- **CSS 框架：** `UnoCSS` - 原子化 CSS 引擎
- **状态管理：** `Pinia` + 持久化插件 - 替代 Vuex
- **网络请求：** `Axios` - 完整的 TypeScript 封装

### 组件封装
- **表单组件：** 基于 `Naive UI` 二次封装的 `FormPro` 组件
- **表格组件：** 基于 `FormPro` 封装的 `TablePro` 组件  
- **弹窗组件：** `DrawerForm`、`ModalForm` - 提升开发效率
- **页面缓存：** `KeepAlive` 支持多级缓存

### 界面设计
- **主题适配：** 浅色/深色/自动模式，保持 `Naive UI` 原生风格
- **自定义主题：** 支持主题色自定义和页面过渡动效
- **响应式布局：** 完美适配桌面端和移动端

### 代码规范
- **代码约束：** `ESLint` + `Prettier` + `Stylelint` + `EditorConfig`  
- **Git 规范：** `Husky` + `Lint-staged` + `Commitlint` + `Commitizen`
- **提交格式：** 使用 `cz-git` 规范化 Git 提交信息

## 项目目录
<details>
<summary> vue3-naiveui-admin </summary>

```ini
├─ .husky                   # Git 提交钩子
├─ .vscode                  # VSCode 推荐配置
├─ build                    # 构建文件配置
│  ├─ buildOptions.ts        # Vite构建配置
│  ├─ cssOptions.ts          # CSS 配置
│  ├─ htmlPlugin.ts          # 自定义Vite插件
│  ├─ index.ts               # 构建入口
│  ├─ optimizeDepsOptions.ts # 依赖优化配置
│  ├─ pluginsOptions.ts      # 插件配置
│  ├─ resolveOptions.ts      # 路径配置
│  ├─ rollupOptions.ts       # rollup 配置
│  ├─ serverOptions.ts       # 开发服务器配置
│  └─ terserOptions.ts       # terser 配置
├─ locales                  # 国际化文件
├─ public                   # 静态资源文件（该文件夹不会被打包）
├─ sql                      # 数据库脚本
│  └─ youlai_boot.sql        # 基础数据库脚本
├─ src                      # 源代码
│  ├─ api                   # API 接口管理
│  ├─ assets                # 静态资源文件
│     └── svg-icons          # 自定义svg图标资源(图标选择器选择本地图标源)
│  ├─ components            # 全局组件
│  ├─ directives            # 全局指令文件
│  ├─ enums                 # 枚举文件
│  ├─ hooks                 # 常用 Hooks 封装
│     ├── useWebsocket/*     # Websocket
│     ├── index.ts           # 统一导出全局 Hooks
│     ├── useBoolean.ts      # 组合式使用 Boolean
│     ├── useCompRef.ts      # 组合式使用 ref
│     ├── useDict.ts         # 获取字典数据
│     ├── useKeepTicking.ts  # 组合式定时器钩子方法
│     ├── useLoading.ts      # 组合式使用Loading方法
│     └── useRange.ts        # 列表搜索时间范围处理方法
│  ├─ layout                # 框架布局模块
│     ├── components         # 布局内部组件
│     ├── main               # 布局框架
│     └── index.txs          # 布局组件基座
│  ├─ modules               # 全局模块注册
│     ├── assets.ts          # 静态资源
│     ├── directives.ts      # 指令
│     └── i18n.ts            # 多语言
│  ├─ plugins               # 全局插件注册
│     ├── appVersion.ts      # App更新提示刷新
│     ├── websocket.ts       # WebSocket
│     └── index.ts           # 统一导出
│  ├─ router                # 路由管理
│     ├── modules            # 路由模块
│         ├── guard.ts        # 路由守卫配置
│         └── routes.ts       # 本地静态页面路由
│     └── index.ts           # 实例化路由导出
│  ├─ store                 # pinia store
│     ├── modules            # store模块
│         ├── app.ts     # 样式布局设置相关存储
│         ├── auth.ts         # 用户权限相关存储
│         ├── dict.ts         # 字典相关存储
│         ├── routes.ts       # 路由相关存储
│         ├── tab.ts          # Tab页签相关存储
│         └── watermark.ts    # 水印相关存储
│     └── index.ts           # 实例化仓库导出
│  ├─ styles                # 全局样式文件
│     ├── index.css          # 统一导出出口
│     ├── naive.css          # 修改NaiveUI原有样式
│     ├── reset.css          # 重置样式css
│     ├── transition.css     # 过渡样式css
│     └── wangEditor.css     # wangEditor富文本编辑器样式
│  ├─ types                 # 全局 ts 声明
│  ├─ typings               # 自动导入类型文件(此目录可删除,启动项目后会自动生成)
│     ├── auto-imports.d.ts  # 自动导入方法类型文件
│     └── components.d.ts    # 自动导入组件类型文件
│  ├─ utils                 # 常用工具库
│     ├── comm.ts            # 常用工具方法
│     ├── i18n.ts            # 国际化方法
│     ├── icon.ts            # 图标工具
│     ├── index.ts           # 工具类统一导出出口
│     ├── is.ts              # 各种判断方法
│     ├── jsencrypt.ts       # encrypt加密解密方法
│     ├── request.ts         # axios 请求封装
│     ├── router.ts          # 路由工具
│     ├── spin.ts            # 加载动画和通用异步操作封装工具
│     ├── storage.ts         # 存储封装工具
│     └── theme.ts           # 主题配置
│  ├─ views                 # 项目所有页面
│  ├─ App.tsx               # APP根组件
│  └─ main.ts               # 项目入口文件
├─ .env.development        # 开发环境配置
├─ .env.production         # 生产环境配置
├─ .eslintrc-auto-import.json  # eslint 自动引入配置文件
├─ .gitignore              # 忽略 git 提交
├─ .prettierignore         # prettier 忽略文件
├─ .prettierrc.yaml        # prettier 规则配置
├─ .stylelintignore        # stylelint 忽略文件
├─ .stylelintrc.cjs        # stylelint 规则配置
├─ commitlint.config.cjs   # 代码提交规则配置
├─ eslint.config.ts        # eslint 规则配置
├─ index.html              # 入口 html
├─ LICENSE                 # 开源协议文件
├─ package.json            # 依赖包管理
├─ pnpm-lock.json          # 依赖包包版本锁定文件
├─ README.md               # README 介绍
├─ tsconfig.json           # typescript 全局配置
├─ unocss.config.js        # unocss 配置
└─ vite.config.ts          # vite 全局配置文件
```
</details>

## 项目启动
### 后端启动
- 后端安装请拉取 [有来开源组织/youlai-boot](https://gitee.com/youlaiorg/youlai-boot) 源代码。
- 本项目中的图标经过修改，请执行本项目内的 `sql` 文件夹下的 `youlai_boot.sql` 文件到数据库中，配置好数据库、Redis连接，启动项目即可。

### 前端启动
```bash
# 全局安装 pnpm
npm install pnpm -g

# 设置pnpm镜像
pnpm config set registry https://registry.npmmirror.com

# 安装依赖
pnpm install

# 启动运行
pnpm dev
```

## Git 提交规范

项目使用 `commitizen` + `cz-git` 规范化提交信息：

```bash
# 规范化提交（推荐）
pnpm commit

# 或使用传统方式
git commit -m "feat: 添加新功能"
```

![](https://foruda.gitee.com/images/1687755823165218215/c1705416_716974.png)


| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | ✨ 新功能 | `feat: 添加用户管理功能` |  
| `fix` | 🐛 修复Bug | `fix: 修复登录页面验证码问题` |
| `docs` | 📝 文档更新 | `docs: 更新README安装说明` |
| `style` | 💄 代码格式 | `style: 统一代码缩进格式` |
| `refactor` | ♻️ 代码重构 | `refactor: 优化用户服务逻辑` |
| `perf` | ⚡ 性能优化 | `perf: 优化表格渲染性能` |
| `test` | ✅ 测试相关 | `test: 添加登录功能单元测试` |
| `chore` | 🔧 构建/工具 | `chore: 更新依赖包版本` |


## 项目部署 
```bash
# 项目打包
pnpm build  # 参考package.json "scripts" 配置
```

> 将打包生成在 `dist` 目录下的文件拷贝至服务器 `/website/dist` 目录下

> 不直接在 `nginx.conf` 中配置，单独配置方便后期维护。

> `nginx.conf` 默认会加载 `/etc/nginx/conf.d/*.conf` 文件

```bash
# 创建 /etc/nginx/conf.d/admin.conf 文件
vim /etc/nginx/conf.d/admin.conf
```

```shell
# admin.conf 配置
server {
  listen 80;
  server_name localhost;
  location / {
    root /website/dist; # 对应上传的文件夹路径
    try_files $uri $uri/ /index.html; # 默认打开 index.html
    index index.html;
  }
  # 反向代理配置
  location /prod-api/ {
    # localhost:8989 替换成实际的后端API地址，请注意末尾的 "/"
    proxy_pass http://localhost:8989/;
  }
}
```

---

  
## 技术支持

如果这个项目对你有帮助的话，请不吝给个 ⭐ **Star** 鼓励一下，让更多开发者受益！

| 交流方式 | 联系信息 |
|---------|----------|
| 📖 **使用文档** | [https://www.youlai.tech/naiveui-docs](https://www.youlai.tech/naiveui-docs) |
| 🌐 **在线预览** | [https://vue.youlai.tech/naiveui](https://vue.youlai.tech/naiveui) |
| 💬 **问题反馈** | [提交 Issue](https://gitee.com/zimo493/vue3-naiveui-admin/issues) |

