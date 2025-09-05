<script setup lang="ts">
import UserCenter from "@/layout/components/header/user-center";

defineOptions({ name: "RightNavigation" });
</script>

<template>
  <div class="flex-y-center gap-1 h-full p-x-10px">
    <MenuSearch />
    <FullScreen />
    <DarkModeSwitch />
    <LangSwitch />
    <Notices />
    <SystemSetting />
    <UserCenter />
  </div>
</template>
