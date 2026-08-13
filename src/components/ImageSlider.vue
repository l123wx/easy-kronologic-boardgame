<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  images: string[]
}>()

const currentIndex = ref(0)
const canGoPrev = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => currentIndex.value < props.images.length - 1)

// 已加载完成的图片索引
const loadedIndices = ref(new Set<number>())
const loading = computed(() => !loadedIndices.value.has(currentIndex.value))

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

function markLoaded(index: number) {
  const set = new Set(loadedIndices.value)
  set.add(index)
  loadedIndices.value = set
}

// 进入页面即预加载全部图片
onMounted(() => {
  props.images.forEach((url, i) => {
    const img = new Image()
    img.onload = () => markLoaded(i)
    img.onerror = () => markLoaded(i)
    img.src = url
  })
})
</script>

<template>
  <div class="image-slider" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <div class="slider-wrapper">
      <img
        :src="images[currentIndex]"
        :alt="`设置图 ${currentIndex + 1}`"
        class="slider-image"
        :style="{ opacity: loading ? 0 : 1 }"
        @load="markLoaded(currentIndex)"
      >
      <div v-if="loading" class="loading-mask">
        <span class="loading-text">加载中...</span>
      </div>
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
  position: relative;
  width: 100%;
  min-height: 200px;
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
  transition: opacity 0.2s ease;
}

.loading-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.loading-text {
  font-size: 14px;
  color: #999;
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
