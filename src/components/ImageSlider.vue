<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  images: string[]
}>()

const currentIndex = ref(0)
const canGoPrev = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => currentIndex.value < props.images.length - 1)

let touchStartX = 0

function prev() {
  if (canGoPrev.value)
    currentIndex.value--
}

function next() {
  if (canGoNext.value)
    currentIndex.value++
}

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
}

function onTouchEnd(e: TouchEvent) {
  const diff = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(diff) > 50) {
    if (diff > 0)
      next()
    else prev()
  }
}
</script>

<template>
  <div class="image-slider" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <div class="slider-wrapper">
      <img
        :src="images[currentIndex]"
        :alt="`设置图 ${currentIndex + 1}`"
        class="slider-image"
      >
    </div>

    <div class="slider-controls">
      <button class="slider-btn" :disabled="!canGoPrev" @click="prev">
        &lt;
      </button>
      <span class="slider-indicator">{{ currentIndex + 1 }} / {{ images.length }}</span>
      <button class="slider-btn" :disabled="!canGoNext" @click="next">
        &gt;
      </button>
    </div>
  </div>
</template>

<style scoped>
.image-slider {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.slider-wrapper {
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.slider-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
}

.slider-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #ddd;
  border-radius: 50%;
  background: #fff;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.slider-indicator {
  font-size: 14px;
  color: #666;
}
</style>
