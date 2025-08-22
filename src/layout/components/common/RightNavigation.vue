<script setup lang="ts">
import UserCenter from "@/layout/components/header/UserCenter";

defineOptions({ name: "RightNavigation" });
</script>

<template>
  <div class="flex-y-center gap-1 h-full p-x-10px">
    <Search />
    <FullScreen />
    <DarkModeSwitch />
    <LangSwitch />
    <Notices />
    <Setting />
    <UserCenter />
  </div>
</template>
