<!-- 图标选择器示例 -->
<script setup lang="ts">
// 本地SVG图标格式取 src/assets/svg-icons 下的文件名，需要添加 "local:" 前缀，不需要svg后缀
// 在线图标请 访问 https://icones.js.org/ 获取图标名称填写即可 示例：ant-design:android-filled ant-design:google-outlined

const iconName1 = ref("local:vue"); // 本地图标
const iconName2 = ref("logos:typescript-icon"); // 在线图标
</script>

<template>
  <n-card>
    <n-flex vertical :size="[0, 30]">
      <div flex-center w="[50%]">
        <div w-80px>本地图标:</div>
        <IconSelect v-model="iconName1" />
      </div>
      <div flex-center w="[50%]">
        <div w-80px>在线图标:</div>
        <IconSelect v-model="iconName2" />
      </div>
      <div flex items-end>
        <div w-100px>自动导入图标:</div>
        <div flex items-end gap-10px>
          <icon-park-outline-smiling-face />
          <icon-park-outline-smiling-face class="text-2em" />
          <icon-park-outline-smiling-face class="text-4em" />
        </div>
      </div>

      <div flex items-end>
        <div w-160px>自动导入本地SVG图标:</div>
        <div flex items-end gap-10px>
          <SvgIconsVite />
          <SvgIconsVue class="text-2em" />
          <SvgIconsLogo class="text-4em" />
        </div>
      </div>

      <div flex items-end>
        <div w-140px>Icones组件加载:</div>
        <div flex items-end gap-10px>
          <Icones icon="local:vue" />
          <Icones icon="local:vite" :size="30" />
          <Icones icon="logos:visual-studio-code" :size="50" />
          <Icones icon="ant-design:wechat-outlined" :size="50" color="#1CD66C" />
        </div>
      </div>
    </n-flex>
  </n-card>
</template>
