import type { CaseInfo, Script } from '@/types'
import { computed, reactive, readonly, watch } from 'vue'
import { scripts } from '@/config'

interface PersistedState {
  currentScriptId: string | null
  currentCaseId: string | null
  selectedRoomId: string | null
  selectedTimeId: string | null
  selectedCharacterId: string | null
  answerRevealed: boolean
}

interface GameState extends PersistedState {
  showClueOverlay: boolean
  showAnswerConfirm: boolean
  showAnswerImage: boolean
}

const STORAGE_KEY = 'kronologic-game-state'

function loadPersistedState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw)
      return JSON.parse(raw)
  }
  catch {}
  return {
    currentScriptId: null,
    currentCaseId: null,
    selectedRoomId: null,
    selectedTimeId: null,
    selectedCharacterId: null,
    answerRevealed: false,
  }
}

function savePersistedState(state: GameState) {
  const data: PersistedState = {
    currentScriptId: state.currentScriptId,
    currentCaseId: state.currentCaseId,
    selectedRoomId: state.selectedRoomId,
    selectedTimeId: state.selectedTimeId,
    selectedCharacterId: state.selectedCharacterId,
    answerRevealed: state.answerRevealed,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function clearPersistedState() {
  localStorage.removeItem(STORAGE_KEY)
}

const persisted = loadPersistedState()

const state = reactive<GameState>({
  currentScriptId: persisted.currentScriptId,
  currentCaseId: persisted.currentCaseId,
  selectedRoomId: persisted.selectedRoomId,
  selectedTimeId: persisted.selectedTimeId,
  selectedCharacterId: persisted.selectedCharacterId,
  answerRevealed: persisted.answerRevealed,
  showClueOverlay: false,
  showAnswerConfirm: false,
  showAnswerImage: false,
})

// 监听变化自动保存
watch(
  () => ({
    currentScriptId: state.currentScriptId,
    currentCaseId: state.currentCaseId,
    selectedRoomId: state.selectedRoomId,
    selectedTimeId: state.selectedTimeId,
    selectedCharacterId: state.selectedCharacterId,
    answerRevealed: state.answerRevealed,
  }),
  () => savePersistedState(state),
  { deep: false },
)

export function useGameState() {
  const currentScript = computed<Script | undefined>(() =>
    scripts.find(s => s.id === state.currentScriptId),
  )

  const currentCase = computed<CaseInfo | undefined>(() =>
    currentScript.value?.cases.find(c => c.id === state.currentCaseId),
  )

  const canViewClue = computed(() =>
    state.selectedRoomId !== null
    && (state.selectedTimeId !== null || state.selectedCharacterId !== null),
  )

  // --- 页面流转 ---
  function selectScript(scriptId: string) {
    state.currentScriptId = scriptId
    state.currentCaseId = null
  }

  function selectCase(caseId: string) {
    state.currentCaseId = caseId
  }

  // --- 游戏操作 ---
  function selectRoom(roomId: string) {
    state.selectedRoomId = roomId
  }

  /** 选择时间：自动取消人物选择（互斥） */
  function selectTime(timeId: string) {
    state.selectedTimeId = timeId
    state.selectedCharacterId = null
  }

  /** 选择人物：自动取消时间选择（互斥） */
  function selectCharacter(characterId: string) {
    state.selectedCharacterId = characterId
    state.selectedTimeId = null
  }

  // --- UI 控制 ---
  function openClueOverlay() {
    if (canViewClue.value)
      state.showClueOverlay = true
  }

  function closeClueOverlay() {
    state.showClueOverlay = false
  }

  function openAnswerConfirm() {
    if (!state.answerRevealed)
      state.showAnswerConfirm = true
  }

  function closeAnswerConfirm() {
    state.showAnswerConfirm = false
  }

  /** 确认查看答案：关闭弹窗，显示答案图片 */
  function revealAnswer() {
    state.showAnswerConfirm = false
    state.answerRevealed = true
    state.showAnswerImage = true
  }

  function closeAnswerImage() {
    state.showAnswerImage = false
  }

  /** 重置全部状态 */
  function reset() {
    state.currentScriptId = null
    state.currentCaseId = null
    state.selectedRoomId = null
    state.selectedTimeId = null
    state.selectedCharacterId = null
    state.showClueOverlay = false
    state.showAnswerConfirm = false
    state.showAnswerImage = false
    state.answerRevealed = false
    clearPersistedState()
  }

  return {
    state: readonly(state),
    currentScript,
    currentCase,
    canViewClue,
    selectScript,
    selectCase,
    selectRoom,
    selectTime,
    selectCharacter,
    openClueOverlay,
    closeClueOverlay,
    openAnswerConfirm,
    closeAnswerConfirm,
    revealAnswer,
    closeAnswerImage,
    reset,
  }
}
