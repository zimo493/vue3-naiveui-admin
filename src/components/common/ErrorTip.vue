<script setup lang="ts">
defineProps<{
  /** 异常类型 403 404 500 */
  type: "403" | "404" | "500";
}>();
const map = {
  403: {
    title: "403 禁止访问",
    desc: "总有些门是对你关闭的",
  },
  404: {
    title: "404 资源不存在",
    desc: "生活总归带点荒谬",
  },
  500: {
    title: "500 服务器错误",
    desc: "服务器出错可能说明该雇更多程序员了",
  },
};
const router = useRouter();
</script>

<template>
  <div class="flex-col-center h-full">
    <n-result :status="type" :title="map[type].title" :description="map[type].desc">
      <template #footer>
        <n-button type="primary" @click="router.push('/')">返回首页</n-button>
      </template>
    </n-result>
  </div>
</template>
