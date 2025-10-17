<template>
  <n-drawer v-model:show="visible" :width="280" placement="left" :trap-focus="false">
    <n-drawer-content closable :native-scrollbar="false">
      <template #header>
        <div flex items-center gap-2>
          <SvgIconsLogo class="text-1.4em" />
          <n-ellipsis class="text-ellipsis overflow-hidden whitespace-nowrap">
            {{ pkg.name }}
          </n-ellipsis>
        </div>
      </template>
      <SideMenu />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
}

interface Emits {
  (e: "update:show", value: boolean): void;
}

const { pkg } = __APP_INFO__;

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const visible = computed({
  get: () => props.show,
  set: (value) => emit("update:show", value),
});
</script>
