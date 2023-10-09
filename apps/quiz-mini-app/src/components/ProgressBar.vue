<script setup lang="ts">
import { useQuestionStore } from '@/stores/question'
import { storeToRefs } from 'pinia'

const questionStore = useQuestionStore()

const { answeredCount, totalToAnswer } = storeToRefs(questionStore)
</script>

<template>
  <div class="progress">
    <div class="progress-bar">
      <div
        class="progress-bar-inner"
        :class="{ success: answeredCount >= totalToAnswer }"
        :style="{ width: `${(answeredCount / totalToAnswer) * 100}%` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.progress {
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-bar {
  width: 80%;
  height: 8px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.progress-bar-inner {
  height: 100%;
  background: var(--color-progress-bar);
  transition:
    width 0.3s ease-in-out,
    background 0.3s ease-in-out;
}

.progress-bar-inner.success {
  background: var(--color-success);
}
</style>
