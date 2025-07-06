<template>
  <div class="min-h-screen bg-black text-white flex flex-col items-center justify-center">
    <div class="text-center mb-8">
      <p class="text-lg text-gray-400 mb-2">Sedang Dipanggil</p>
      <h1 class="text-8xl font-bold text-yellow-400 animate-pulse">{{ queue.queue_number || '-' }}</h1>
      <p class="text-2xl mt-2">{{ queue.type || '-' }}</p>
    </div>

    <div class="text-center">
      <p class="text-lg text-gray-400">Loket</p>
      <p class="text-3xl font-semibold text-cyan-400">{{ queue.staff || '-' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { io } from 'socket.io-client'

const queue = ref({})
let lastQueueNumber = null

const socket = io('http://localhost:3000')

socket.on('connect', () => {
  console.log('Terhubung ke server Socket.IO')
})

socket.on('queue-called', payload => {
  if (payload.queue_number !== lastQueueNumber) {
    queue.value = payload
    lastQueueNumber = payload.queue_number
    playSound(payload.queue_number, payload.type, payload.staff)
  }
})

function playSound(number, type, staff) {
  const bell = new Audio("https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3")
  bell.play()

  setTimeout(() => {
    const message = `Antrian ${number}, dipanggil oleh ${staff}`
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.lang = 'id-ID'
    utterance.rate = 0.65
    speechSynthesis.speak(utterance)
  }, 800)
}

socket.on('disconnect', () => {
  console.warn('Terputus dari server Socket.IO')
})
</script>

<style>
@keyframes blink {
  0%, 100% { opacity: 1 }
  50% { opacity: 0.4 }
}

.animate-pulse {
  animation: blink 1.5s infinite;
}
</style>