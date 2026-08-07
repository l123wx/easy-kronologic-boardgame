<script setup lang="ts">
import ClueOverlay from '@/components/ClueOverlay.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import OptionCircle from '@/components/OptionCircle.vue'
import OptionRow from '@/components/OptionRow.vue'
import TimeCircle from '@/components/TimeCircle.vue'
import { useGameState } from '@/composables/useGameState'
import { characters, rooms, times } from '@/config'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const {
  state,
  currentCase,
  currentScript,
  canViewClue,
  selectRoom,
  selectTime,
  selectCharacter,
  openClueOverlay,
  closeClueOverlay,
  openAnswerConfirm,
  closeAnswerConfirm,
  revealAnswer,
  closeAnswerImage,
} = useGameState()

const roomList = computed(() => {
  if (!currentCase.value)
    return []
  return Object.keys(currentCase.value.cardImages.rooms).map(id => rooms[id]).filter(Boolean)
})

const timeList = computed(() => {
  if (!currentCase.value)
    return []
  return Object.keys(currentCase.value.cardImages.times).map(id => times[id]).filter(Boolean)
})

const characterList = computed(() => {
  if (!currentCase.value)
    return []
  return Object.keys(currentCase.value.cardImages.characters).map(id => characters[id]).filter(Boolean)
})

const selectedRoom = computed(() => {
  return state.selectedRoomId ? rooms[state.selectedRoomId] : null
})

const selectedTime = computed(() => {
  return state.selectedTimeId ? times[state.selectedTimeId] : null
})

const selectedCharacter = computed(() => {
  return state.selectedCharacterId ? characters[state.selectedCharacterId] : null
})

const targetImage = computed(() => {
  if (!currentCase.value)
    return ''
  if (selectedTime.value)
    return currentCase.value.cardImages.times[selectedTime.value.id] ?? ''
  if (selectedCharacter.value)
    return currentCase.value.cardImages.characters[selectedCharacter.value.id] ?? ''
  return ''
})

const roomOverlayImage = computed(() => {
  if (!currentCase.value || !selectedRoom.value)
    return ''
  return currentCase.value.cardImages.rooms[selectedRoom.value.id] ?? ''
})

const answerImageUrl = computed(() => {
  return currentCase.value?.answerImage ?? ''
})

function goBack() {
  router.push('/setup')
}

function handleRevealAnswer() {
  openAnswerConfirm()
}

const confirmMessage = '确认提交答案吗？<br><b>每人仅有一次回答机会，猜错则直接出局。</b><br>查看答案之后，无论对错，都不要将答案告诉其他玩家，以免影响游戏体验。'

// 预加载进度
const loading = ref(true)
const loadedCount = ref(0)
const totalCount = ref(0)
const loadingPercent = computed(() => totalCount.value === 0 ? 0 : Math.round((loadedCount.value / totalCount.value) * 100))

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => { loadedCount.value++; resolve() }
    img.onerror = () => { loadedCount.value++; resolve() }
    img.src = url
  })
}

// 预加载当前案件的所有重叠图，防止点击查看线索时先露出房间图
onMounted(async () => {
  if (!currentCase.value) {
    loading.value = false
    return
  }
  const images = currentCase.value.cardImages
  const urls = [
    ...Object.values(images.rooms),
    ...Object.values(images.times),
    ...Object.values(images.characters),
  ]
  totalCount.value = urls.length
  await Promise.all(urls.map(preloadImage))
  loading.value = false
})
</script>

<template>
  <div class="game-page">
    <!-- 预加载进度层 -->
    <Transition name="fade">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-content">
          <p class="loading-text">
            资源加载中...
          </p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${loadingPercent}%` }" />
          </div>
          <p class="loading-count">
            {{ loadedCount }} / {{ totalCount }}
          </p>
        </div>
      </div>
    </Transition>

    <div class="game-header">
      <button class="header-btn home-btn" @click="goBack">
        返回上一页
      </button>
      <div v-if="currentScript && currentCase" class="header-info">
        <span class="header-script">{{ currentScript?.name }}</span>
        <span class="header-case">{{ currentCase?.name }}</span>
      </div>
      <button
        class="header-btn answer-btn"
        @click="handleRevealAnswer"
      >
        查看答案
      </button>
    </div>

    <div class="game-body">
      <OptionRow title="房间" label="必选">
        <OptionCircle
          v-for="item in roomList"
          :key="item.id"
          :item="item"
          :selected="state.selectedRoomId === item.id"
          :disabled="false"
          @select="selectRoom"
        />
      </OptionRow>

      <OptionRow title="时间" :label="state.selectedCharacterId ? '' : (state.selectedTimeId ? '已选' : '可选')">
        <TimeCircle
          v-for="item in timeList"
          :key="item.id"
          :item="item"
          :selected="state.selectedTimeId === item.id"
          :disabled="false"
          @select="selectTime"
        />
      </OptionRow>

      <OptionRow title="人物" :label="state.selectedTimeId ? '' : (state.selectedCharacterId ? '已选' : '可选')">
        <OptionCircle
          v-for="item in characterList"
          :key="item.id"
          :item="item"
          :selected="state.selectedCharacterId === item.id"
          :disabled="false"
          @select="selectCharacter"
        />
      </OptionRow>
    </div>

    <div class="game-footer">
      <button
        class="clue-btn"
        :disabled="!canViewClue"
        @click="openClueOverlay"
      >
        查看线索
      </button>
    </div>

    <!-- 线索叠加层 -->
    <ClueOverlay
      :visible="state.showClueOverlay"
      :room-image="roomOverlayImage"
      :target-image="targetImage"
      @close="closeClueOverlay"
    />

    <!-- 答案确认弹窗 -->
    <ConfirmModal
      :visible="state.showAnswerConfirm"
      title="查看答案"
      :message="confirmMessage"
      @confirm="revealAnswer"
      @cancel="closeAnswerConfirm"
    />

    <!-- 答案图片展示 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="state.showAnswerImage" class="answer-overlay" @click.self="closeAnswerImage">
          <div class="answer-content">
            <h3 class="answer-title">
              案件答案
            </h3>
            <img :src="answerImageUrl" alt="答案" class="answer-img">
            <button class="close-btn" @click="closeAnswerImage">
              关闭
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.game-page {
  min-height: 100vh;
  padding: 0 0 100px;
  background: #f8f9fa;
  max-width: 480px;
  margin: 0 auto;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-btn {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  white-space: nowrap;
}

.home-btn {
  color: #666;
}

.answer-btn {
  color: #e94560;
  border-color: #e94560;
}

.answer-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.header-info {
  text-align: center;
}

.header-script {
  font-size: 12px;
  color: #999;
  display: block;
}

.header-case {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.game-body {
  padding: 20px 16px;
}

.game-footer {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  padding: 16px;
  background: #f8f9fa;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
}

.clue-btn {
  width: 100%;
  padding: 16px 0;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #4a90d9, #357abd);
  color: #fff;
  transition: opacity 0.2s;
}

.clue-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 答案图片展示 */
.answer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.answer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  max-width: 90vw;
  max-height: 90vh;
}

.answer-title {
  color: #fff;
  font-size: 20px;
  margin: 0;
}

.answer-img {
  max-width: 80vw;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 8px;
}

.close-btn {
  padding: 10px 32px;
  border: 2px solid #fff;
  border-radius: 8px;
  background: transparent;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 预加载进度层 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
}

.loading-content {
  text-align: center;
  color: #fff;
}

.loading-text {
  font-size: 18px;
  margin: 0 0 16px;
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin: 0 auto 10px;
}

.progress-fill {
  height: 100%;
  background: #4a90d9;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.loading-count {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}
</style>
