<script setup lang="ts">
defineEmits<{
  showNext: [void]
}>()
</script>

<template>
  <Transition name="switch" @afterLeave="$emit('showNext')">
    <slot />
  </Transition>
</template>

<style scoped>
.switch-enter-active {
  transition: all 0.3s ease-out;
}

.switch-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.switch-enter-from {
  transform: translateX(100px);
  opacity: 0;
}

.switch-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}
</style>
