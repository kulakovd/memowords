import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import type { Word } from '@/domain/model/word'
import { injectApi } from '@/stores/utils/injectApi'

const QUESTION_DISAPPEAR_TIMEOUT = 700

export const useQuestionStore = defineStore('question', () => {
  const api = injectApi()

  const options = reactive<Word[]>([])
  const correctOption = ref<string | null>(null)
  const userAnswer = ref<string | null>(null)
  const answerIsShown = ref(false)
  const questionIsShown = ref(true)

  async function nextQuestion() {
    const question = await api.getQuestion()
    options.splice(0, options.length, ...question.options)
    correctOption.value = question.correctOption
    questionIsShown.value = true
  }

  const questionWord = computed<string | undefined>(
    () => options.find((option) => option.id === correctOption.value)?.english
  )

  function validateAnswer(id: string | null) {
    answerIsShown.value = true
    userAnswer.value = id
    api.sendAnswer({
      wordId: correctOption.value!,
      isCorrect: id === correctOption.value,
      idk: id === null
    })
    setTimeout(async () => {
      questionIsShown.value = false
      answerIsShown.value = false
      userAnswer.value = null
    }, QUESTION_DISAPPEAR_TIMEOUT)
  }

  nextQuestion()

  function showNextQuestion() {
    nextQuestion()
  }

  return {
    options,
    correctOption,
    userAnswer,
    answerIsShown,
    questionIsShown,
    questionWord,
    validateAnswer,
    showNextQuestion
  }
})
