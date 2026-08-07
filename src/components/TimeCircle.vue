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
</script>

<template>
  <div
    class="time-circle"
    :class="{ selected, disabled }"
    @click="!disabled && emit('select', item.id)"
  >
    <div class="circle-img-wrapper">
      <img
        :src="item.iconImage"
        :alt="item.name"
        class="circle-img"
      >
    </div>
  </div>
</template>

<style scoped>
.time-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: transform 0.15s, opacity 0.2s;
  user-select: none;
}

.time-circle:active {
  transform: scale(0.95);
}

.time-circle.selected .circle-img-wrapper {
  border-color: #4a90d9;
  box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.4);
}

.time-circle.disabled {
  opacity: 0.35;
  pointer-events: none;
}

.circle-img-wrapper {
  width: 56px;
  height: 56px;
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
</style>
