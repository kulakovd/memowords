<script setup lang="ts">
defineProps<{
  text: string
  showAsCorrect: boolean
  showAsIncorrect: boolean
}>()

defineEmits<{
  click: [void]
}>()
</script>

<template>
  <button
    @click="$emit('click')"
    class="option"
    :class="{
      'correct-option': showAsCorrect,
      'wrong-option': showAsIncorrect
    }"
  >
    {{ text }}
  </button>
</template>

<style scoped>
.option {
  cursor: pointer;
  background: var(--color-background-soft);
  color: var(--color-text);
  border: none;
  font-size: 1.2em;
  border-radius: 8px;
}

.option.correct-option {
  background: var(--color-success);
  color: var(--color-background);
}

.option.wrong-option {
  background: var(--color-error);
  color: var(--color-background);
}

.option:active {
  transform: scale(0.95);
}
</style>
