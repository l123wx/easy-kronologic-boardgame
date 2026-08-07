<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameState } from '@/composables/useGameState'
import { scripts } from '@/config'

const router = useRouter()
const { currentScript, currentCase, selectScript, selectCase } = useGameState()

const selectedScriptId = ref<string | null>(currentScript.value?.id ?? null)
const selectedCaseId = ref<string | null>(currentCase.value?.id ?? null)

const selectedScript = computed(() => scripts.find(s => s.id === selectedScriptId.value))

function onScriptSelect(scriptId: string) {
  selectedScriptId.value = scriptId
  selectedCaseId.value = null
  selectScript(scriptId)
}

function onCaseSelect(caseId: string) {
  selectedCaseId.value = caseId
  selectCase(caseId)
}

function confirmSelection() {
  if (selectedScriptId.value && selectedCaseId.value) {
    router.push('/setup')
  }
}

function goBack() {
  router.push('/index')
}

function difficultyStars(count: number): string {
  return '⭐'.repeat(count)
}
</script>

<template>
  <div class="case-page">
    <h1 class="page-title">
      案件选择
    </h1>

    <!-- 选择剧本 -->
    <div class="section">
      <h2 class="section-title">
        选择剧本
      </h2>
      <div class="card-list">
        <div
          v-for="script in scripts"
          :key="script.id"
          class="card"
          :class="{ active: selectedScriptId === script.id }"
          @click="onScriptSelect(script.id)"
        >
          <div class="card-name">
            {{ script.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 选择案件 -->
    <div v-if="selectedScript" class="section">
      <h2 class="section-title">
        选择案件
      </h2>
      <div class="card-list">
        <div
          v-for="c in selectedScript.cases"
          :key="c.id"
          class="card"
          :class="{ active: selectedCaseId === c.id }"
          @click="onCaseSelect(c.id)"
        >
          <div class="card-name">
            {{ c.name }}
          </div>
          <div class="card-difficulty">
            难度：{{ difficultyStars(c.difficulty) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <button class="btn-secondary" @click="goBack">
        返回
      </button>
      <button
        class="btn-primary"
        :disabled="!selectedScriptId || !selectedCaseId"
        @click="confirmSelection"
      >
        确认选择
      </button>
    </div>
  </div>
</template>

<style scoped>
.case-page {
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
  margin: 0 0 28px;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #666;
  margin: 0 0 12px;
  padding-left: 4px;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card {
  padding: 16px 20px;
  background: #fff;
  border-radius: 12px;
  border: 2px solid #eee;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.card:active {
  transform: scale(0.98);
}

.card.active {
  border-color: #4a90d9;
  box-shadow: 0 2px 12px rgba(74, 144, 217, 0.2);
}

.card-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.card-difficulty {
  font-size: 14px;
  color: #f0a500;
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
  text-align: center;
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
}

.btn-primary {
  background: linear-gradient(135deg, #4a90d9, #357abd);
  color: #fff;
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
