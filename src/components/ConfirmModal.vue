<script setup lang="ts">
defineProps<{
  visible: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="modal-overlay" @click.self="emit('cancel')">
        <div class="modal-content">
          <h3 class="modal-title">
            {{ title }}
          </h3>
          <p class="modal-message">
            {{ message }}
          </p>
          <div class="modal-actions">
            <button class="btn-cancel" @click="emit('cancel')">
              取消
            </button>
            <button class="btn-confirm" @click="emit('confirm')">
              确认
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  padding: 28px 24px;
  width: 85vw;
  max-width: 360px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
}

.modal-message {
  margin: 0 0 24px;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  white-space: pre-line;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  max-width: 120px;
  padding: 10px 0;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  border: none;
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
}

.btn-confirm {
  background: #ff6b35;
  color: #fff;
  font-weight: 600;
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
