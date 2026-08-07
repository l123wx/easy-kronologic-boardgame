<script setup lang="ts">
import { rulesImages } from '@/config'
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.push('/index')
}
</script>

<template>
  <div class="rules-page">
    <div class="rules-header">
      <button class="back-btn" @click="goBack">
        返回
      </button>
      <h1 class="page-title">
        游戏规则
      </h1>
      <div class="spacer" />
    </div>
    <div class="rules-list">
      <img
        v-for="(img, i) in rulesImages"
        :key="i"
        :src="img"
        :alt="`规则图 ${i + 1}`"
        class="rule-image"
      >
    </div>
  </div>
</template>

<style scoped>
.rules-page {
  min-height: 100vh;
  background: #1a1a2e;
  max-width: 600px;
  margin: 0 auto;
}

.rules-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-btn {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: #fff;
  cursor: pointer;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.spacer {
  width: 50px;
}

.rules-list {
  padding: 16px 0;
}

.rule-image {
  width: 100%;
  display: block;
}
</style>
