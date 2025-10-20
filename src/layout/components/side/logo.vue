<script setup lang="ts">
import { useAppStoreHook } from "@/store";

const appStore = useAppStoreHook();
const { pkg } = __APP_INFO__;

const router = useRouter();
</script>

<template>
  <div class="h-50px flex-center cursor-pointer gap-2 p-x-2" @click="router.push('/')">
    <SvgIconsLogo class="text-1.2em" />
    <n-ellipsis
      v-if="!appStore.collapsed"
      class="text-1.15em text-ellipsis overflow-hidden whitespace-nowrap"
    >
      {{ pkg.name }}
    </n-ellipsis>
  </div>
</template>
