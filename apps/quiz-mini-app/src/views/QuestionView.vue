<script setup lang="ts">
import { useQuestionStore } from '@/stores/question'
import { storeToRefs } from 'pinia'
import SwitchTransition from '@/components/SwitchTransition.vue'
import AnswerOption from '@/components/AnswerOption.vue'

const questionStore = useQuestionStore()

const { options, correctOption, userAnswer, answerIsShown, questionIsShown, questionWord } =
  storeToRefs(questionStore)
</script>

<template>
  <div class="question-animation-container">
    <SwitchTransition @showNext="questionStore.showNextQuestion">
      <div v-if="questionIsShown" class="question">
        <div class="word">
          {{ questionWord }}
        </div>
        <div class="options">
          <AnswerOption
            v-for="option in options"
            :key="option.id"
            :text="option.russian"
            :showAsCorrect="answerIsShown && option.id === correctOption"
            :showAsIncorrect="
              answerIsShown && option.id !== correctOption && option.id === userAnswer
            "
            @click="questionStore.validateAnswer(option.id)"
          />
        </div>
        <button class="idk" @click="questionStore.validateAnswer(null)">I don't know</button>
      </div>
    </SwitchTransition>
  </div>
</template>

<style scoped>
.question-animation-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.question {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.word {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: var(--color-text);
  font-size: 3rem;
}

.options {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  padding: 0 16px;
  gap: 8px;
  flex: 1;
}

.idk {
  background: none;
  border: none;
  color: var(--color-link);
  font-size: 0.8em;
  cursor: pointer;
  padding: 16px 0;
}

.idk:active {
  transform: scale(0.95);
}
</style>
