<script setup lang="ts">
import { onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { useGameState } from '@/composables/useGameState'

const router = useRouter()
const { reset } = useGameState()

onActivated(() => {
  reset()
})

function startGame() {
  router.push('/case')
}
</script>

<template>
  <div class="home">
    <div class="home-content">
      <div class="title-area">
        <h1 class="game-title">时空神探</h1>
        <p class="game-subtitle">Kronologic Board Game Assistant</p>
      </div>
      <button class="start-btn" @click="startGame">
        开始游戏
      </button>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.home-content {
  text-align: center;
  padding: 40px;
}

.title-area {
  margin-bottom: 60px;
}

.game-title {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
  letter-spacing: 8px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.game-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  letter-spacing: 2px;
}

.start-btn {
  padding: 16px 64px;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #e94560, #ff6b35);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  letter-spacing: 4px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(233, 69, 96, 0.4);
}

.start-btn:active {
  transform: scale(0.96);
}
</style>
