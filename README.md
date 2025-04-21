<div align="center">
  <h1>vue3-naiveui-admin</h1>

![Vue.js](https://img.shields.io/badge/Vue-3.5.13-42B883?logo=vuedotjs)
![Vite](https://img.shields.io/badge/Vite-6.2.6-bd34fe?logo=vite&logoColor=bd34fe)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?logo=typescript)
![UnoCSS](https://img.shields.io/badge/UnoCSS-0.63.6-333?logo=unocss)
![NaiveUI](https://img.shields.io/badge/NaiveUI-2.41.0-63e2b7.svg)
![Author](https://img.shields.io/badge/Author-@zimo493-orange.svg)
</div>

![](https://foruda.gitee.com/images/1708618984641188532/a7cca095_716974.png "rainbow.png")

## 介绍 📖
[vue3-naiveui-admin](https://gitee.com/zimo493/vue3-naiveui-admin) 基于 `Vue3` `Vite` `TypeScript` 和 `Naive UI` 搭建的极简开箱即用企业级后台管理前端模板。 配套 Java 后端 [youlai-boot](https://gitee.com/youlaiorg/youlai-boot) 和 Node 后端 [youlai-nest](https://gitee.com/youlaiorg/youlai-nest) 。 提供Element Plus 三版本供开发者快速开发。
> 标准版: [vue3-element-admin](https://gitee.com/youlaiorg/vue3-element-admin) <br />
> 精简版: [vue3-element-template](https://gitee.com/youlaiorg/vue3-element-template) <br />
> JS版本: [vue3-element-admin-js](https://gitee.com/youlaiorg/vue3-element-admin) <br />

## 在线体验 👀
- Link：-

## 代码仓库 ⭐
- Gitee：https://gitee.com/zimo493/vue3-naiveui-admin
- GitHub：https://github.com/zimo493/vue3-naiveui-admin
- GitCode: -

## 项目功能 🔨
- 基于`Vue3.5`、`Vite6`、`TypeScript`、`NaiveUI`、`UnoCSS` `tsx` 等最新技术栈开发，单文件组件 **＜ script setup ＞**
- 使用 `Pinia` 替代 `Vuex`，轻量、简单、易用，集成 `Pinia` 持久化插件
- 使用 `ESLint` + `Prettier` + `Stylelint` + `EditorConfig` 约束和统一代码规范
- 集成 `Husky` + `lint-staged` + `commitlint` + `commitizen` + `cz-git` 配置 `Git` 提交规范
- 使用 `KeepAlive` 对页面进行缓存
- 使用 `TypeScript` 对 `Axios` 整个二次封装（请求拦截、常用请求封装…）
- 基于 `Naive` 二次封装 `FormPro`、基于 `FormPro` 封装 `SearchTable`、`DialogForm`、`DrawerForm` 组件，在一定程度上提高您的开发效率
- 支持自定义主题色、页面过度等超多设置，黑暗主题适配，界面样式保持 Naive 风格

## 项目目录 📁
<details>
<summary> vue3-naiveui-admin </summary>

```text
├─ .vscode                  # VSCode 推荐配置
├─ .husky                   # Git 提交钩子
├─ locales                  # 国际化文件
├─ public                   # 静态资源文件（该文件夹不会被打包）
├─ sql                      # 数据库脚本
│  └─ youlai_boot.sql        # 基础数据库脚本
├─ src
│  ├─ api                   # API 接口管理
│  ├─ assets                # 静态资源文件
│     └── svg-icons          # 自定义svg图标资源(图标选择器选择本地图标源)
│  ├─ components            # 全局组件
│     ├── common             # 内部组件
│     └── custom             # 自定义组件
│  ├─ directives            # 全局指令文件
│  ├─ enums                 # 枚举文件
│  ├─ hooks                 # 常用 Hooks 封装
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
│     ├── assets.ts          # 自动注册静态资源
│     └── directives.ts      # 自动注册指令
│  ├─ router                # 路由管理
│     ├── modules            # 路由模块
│         ├── guard.ts        # 路由守卫配置
│         └── routes.ts       # 本地静态页面路由
│     └── index.ts           # 实例化路由导出
│  ├─ store                 # pinia store
│     ├── modules            # store模块
│         ├── app/index.ts     # 样式布局设置相关存储
│         ├── app/theme.ts     # 主题配置
│         ├── auth.ts         # 用户权限相关存储
│         ├── dict.ts         # 字典相关存储
│         ├── routes.ts       # 路由相关存储
│         └── tab.ts          # Tab页签相关存储
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
│     ├── index.ts           # 工具类统一导出出口
│     ├── comm.ts            # 常用工具方法
│     ├── i18n.ts            # 国际化方法
│     ├── icon.ts            # 图标工具
│     ├── is.ts              # 各种判断方法
│     ├── jsencrypt.ts       # encrypt加密解密方法
│     ├── request.ts         # axios 请求封装
│     ├── router.ts          # 路由工具
│     └── storage.ts         # 存储封装工具
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
├─ eslint.config.js        # eslint 规则配置
├─ index.html              # 入口 html
├─ LICENSE                 # 开源协议文件
├─ package.json            # 依赖包管理
├─ pnpm-lock.json          # 依赖包包版本锁
├─ README.md               # README 介绍
├─ tsconfig.json           # typescript 全局配置
├─ unocss.config.js        # unocss 配置
└─ vite.config.ts          # vite 全局配置文件
```
</details>

## 安装使用步骤 📔
### 后端启动
> 后端安装请拉取 [有来开源组织/youlai-boot](https://gitee.com/youlaiorg/youlai-boot) 源代码。本项目中的图标经过修改，请执行本项目内的 `sql` 文件夹下的 `youlai_boot.sql` 文件到数据库中，配置好数据库、Redis连接，启动项目即可。

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

## 提交规范
### 执行 `pnpm commit` 唤起 git commit 交互，根据提示完成信息的输入和选择。
```shell
PS E:\Code\vue-naiveui-admin> pnpm commit

> vue-naiveui-admin@0.0.0 commit E:\Code\vue-naiveui-admin
> git-cz

cz-cli@4.3.1, cz-git@1.11.1

? 选择你要提交的类型 : 文档:     📝  文档变更
? 选择一个提交范围（可选）: empty
? 填写简短精炼的变更描述 :
 [Infinity more chars allowed]
 更新项目介绍和提交规范
? 填写更加详细的变更描述（可选）。使用 "|" 换行 :

? 选择关联issue前缀（可选）: skip

###--------------------------------------------------------###
docs: :memo: 更新项目介绍和提交规范
###--------------------------------------------------------###

? 是否提交或修改commit ? Yes
Running pre-commit hook...

> vue-naiveui-admin@0.0.0 lint:lint-staged E:\Code\vue-naiveui-admin
> lint-staged

✔ Backed up original state in git stash (7e08057)
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...
[main e190d89] docs: :memo: 更新项目介绍和提交规范
 1 file changed, 14 insertions(+), 3 deletions(-)
PS E:\Code\vue-naiveui-admin>
```

## 项目部署 🚀
```bash
# 项目打包
pnpm build  # 参考package.json "scripts" 配置

# 上传文件至远程服务器（XShell、MobaXterm）
将打包生成在 `dist` 目录下的文件拷贝至服务器 `/website/dist` 目录下
```

```bash
# 不在 nginx.conf 中直接配置，单独配置方便后期维护
# 创建 /etc/nginx/conf.d/admin.conf 文件
# nginx.conf 默认会加载 /etc/nginx/conf.d/ 下的所有 *.conf 文件

vim /etc/nginx/conf.d/admin.conf
```

```shell
# admin.conf 配置
server {
  listen 80;
  server_name localhost;
  location / {
    root /website/dist;
    try_files $uri $uri/ /index.html;
    index index.html index.htm;
  }
  # 反向代理配置
  location /prod-api/ {
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://localhost:8989/; # localhost:8989 替换成实际的后端API地址
  }
}
```
