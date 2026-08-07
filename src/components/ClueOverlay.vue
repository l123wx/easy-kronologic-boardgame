<script setup lang="ts">
defineProps<{
  roomImage: string
  targetImage: string
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="clue-overlay" @click.self="emit('close')">
        <div class="clue-content">
          <div class="clue-images">
            <img :src="roomImage" alt="房间" class="clue-img clue-room">
            <img :src="targetImage" alt="线索" class="clue-img clue-target">
          </div>
          <button class="close-btn" @click="emit('close')">
            关闭
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.clue-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.clue-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  max-width: 90vw;
  max-height: 90vh;
}

.clue-images {
  position: relative;
  width: 90vw;
  max-width: 700px;
  aspect-ratio: 1 / 1;
}

.clue-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.clue-room {
  z-index: 1;
}

.clue-target {
  z-index: 2;
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
</style>
