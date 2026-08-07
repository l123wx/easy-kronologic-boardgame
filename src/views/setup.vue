<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameState } from '@/composables/useGameState'
import ImageSlider from '@/components/ImageSlider.vue'

const router = useRouter()
const { currentCase, currentScript } = useGameState()

function startGame() {
  if (currentCase.value) {
    router.push('/game')
  }
}

function goBack() {
  router.push('/case')
}
</script>

<template>
  <div class="setup-page">
    <h1 class="page-title">初始设置</h1>

    <div v-if="currentScript && currentCase" class="setup-info">
      <p class="script-name">{{ currentScript.name }}</p>
      <p class="case-name">{{ currentCase.name }}</p>
    </div>

    <div v-if="currentCase" class="setup-images">
      <ImageSlider :images="currentCase.setupImages" />
    </div>

    <div v-else class="no-data">
      <p>未选择案件，请返回重新选择</p>
      <button class="btn-back" @click="goBack">返回选择</button>
    </div>

    <div class="actions">
      <button class="btn-secondary" @click="goBack">返回</button>
      <button class="btn-primary" :disabled="!currentCase" @click="startGame">
        开始游戏
      </button>
    </div>
  </div>
</template>

<style scoped>
.setup-page {
  min-height: 100vh;
  padding: 24px 16px 100px;
  background: #f8f9fa;
  max-width: 480px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin: 0 0 20px;
}

.setup-info {
  text-align: center;
  margin-bottom: 24px;
}

.script-name {
  font-size: 14px;
  color: #999;
  margin: 0 0 4px;
}

.case-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.setup-images {
  margin-bottom: 24px;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.btn-back {
  margin-top: 16px;
  padding: 10px 24px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.actions {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: 14px 0;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
}

.btn-primary {
  background: linear-gradient(135deg, #e94560, #ff6b35);
  color: #fff;
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
