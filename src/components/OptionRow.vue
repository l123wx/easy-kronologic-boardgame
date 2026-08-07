<script setup lang="ts">
defineProps<{
  title: string
  label?: string
}>()
</script>

<template>
  <div class="option-row">
    <div class="row-header">
      <h3 class="row-title">{{ title }}</h3>
      <span v-if="label" class="row-label" :class="{ required: label === '必选' }">{{ label }}</span>
    </div>
    <div class="row-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.option-row {
  margin-bottom: 16px;
}

.row-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding: 0 4px;
}

.row-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.row-label {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  background: #e8e8e8;
  color: #666;
}

.row-label.required {
  background: #fff3e0;
  color: #ff6b35;
  font-weight: 600;
}

.row-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
}
</style>
