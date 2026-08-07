<script setup lang="ts">
import type { OptionItem } from '@/types'

defineProps<{
  item: OptionItem
  selected: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const placeholderSrc = '/images/placeholder.svg'

function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement
  if (img.src !== placeholderSrc) {
    img.src = placeholderSrc
  }
}
</script>

<template>
  <div
    class="option-circle"
    :class="{ selected, disabled }"
    @click="!disabled && emit('select', item.id)"
  >
    <div class="circle-img-wrapper">
      <img
        :src="item.iconImage"
        :alt="item.name"
        class="circle-img"
        @error="handleImageError"
      >
    </div>
    <span class="circle-name">{{ item.name }}</span>
  </div>
</template>

<style scoped>
.option-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: transform 0.15s, opacity 0.2s;
  user-select: none;
}

.option-circle:active {
  transform: scale(0.95);
}

.option-circle.selected .circle-img-wrapper {
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.4);
}

.option-circle.disabled {
  opacity: 0.35;
  pointer-events: none;
}

.circle-img-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ddd;
  background: #f5f5f5;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.circle-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.circle-name {
  margin-top: 6px;
  font-size: 13px;
  color: #333;
  text-align: center;
  max-width: 72px;
}
</style>
