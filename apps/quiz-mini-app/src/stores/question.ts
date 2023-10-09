import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import type { Word } from '@/domain/model/word'
import { injectApi } from '@/stores/utils/injectApi'
import { injectTelegram } from '@/stores/utils/injectTelegram'

const QUESTION_DISAPPEAR_TIMEOUT = 700

export const useQuestionStore = defineStore('question', () => {
  const api = injectApi()
  const telegram = injectTelegram()

  const options = reactive<Word[]>([])
  const correctOption = ref<string | null>(null)
  const userAnswer = ref<string | null>(null)
  const answerIsShown = ref(false)
  const questionIsShown = ref(true)
  const answeredCount = ref(0)
  const totalToAnswer = ref(20)

  async function nextQuestion() {
    const question = await api.getQuestion()
    options.splice(0, options.length, ...question.options)
    correctOption.value = question.correctOption
    questionIsShown.value = true
  }

  const questionWord = computed<Word | undefined>(() =>
    options.find((option) => option.id === correctOption.value)
  )

  function validateAnswer(id: string | null) {
    answerIsShown.value = true
    userAnswer.value = id
    answeredCount.value += 1

    const isCorrect = id === correctOption.value

    if (isCorrect) {
      telegram.HapticFeedback.notificationOccurred('success')
    }

    api.sendAnswer({
      wordId: correctOption.value!,
      isCorrect,
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
    answeredCount,
    totalToAnswer,
    validateAnswer,
    showNextQuestion
  }
})
