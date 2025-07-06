<template>
  <div class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div v-if="!selectedStaff" class="w-full max-w-md p-6 bg-white rounded-xl shadow space-y-4">
      <h1 class="text-xl font-bold text-center">Login Staff</h1>
      <p class="text-sm text-gray-500 text-center mb-4">Pilih nama staff untuk melanjutkan</p>

      <div class="space-y-3">
        <button
          v-for="staff in staffList"
          :key="staff.id"
          @click="selectStaff(staff)"
          class="w-full flex items-center justify-between border rounded-lg px-4 py-2 hover:bg-gray-100"
        >
          <span class="flex items-center gap-2">
            <i class="fas fa-user-circle text-2xl text-blue-500"></i> {{ staff.name }}
          </span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </button>
      </div>
    </div>

    <div v-else class="w-full max-w-md p-6 bg-white rounded-xl shadow space-y-4">
      <h1 class="text-xl font-bold text-center mb-2">Masukkan PIN</h1>
      <p class="text-sm text-gray-500 text-center">Staff: {{ selectedStaff.name }}</p>

      <form @submit.prevent="login" class="space-y-4">
        <input
          v-model="pin"
          type="password"
          maxlength="5"
          pattern="\d*"
          inputmode="numeric"
          placeholder="•••••"
          class="w-full text-center text-2xl tracking-widest px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div class="flex justify-between">
          <button type="button" @click="selectedStaff = null" class="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300">
            Kembali
          </button>
          <button type="submit" class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            Login
          </button>
        </div>
      </form>

      <p v-if="errorMessage" class="text-red-500 text-sm text-center mt-2">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const staffList = ref([])
const selectedStaff = ref(null)
const pin = ref('')
const errorMessage = ref('')

onMounted(async () => {
  try {
    const response = await api.get('/staff')
    staffList.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch staff:', error)
    errorMessage.value = 'Gagal mengambil data staff.'
  }
})

function selectStaff(staff) {
  selectedStaff.value = staff
  pin.value = ''
  errorMessage.value = ''
}

async function login() {
  try {
    const res = await api.post('/staff/login', {
      id: selectedStaff.value.id,
      pin: pin.value,
    })

    const { token, name } = res.data.data

    localStorage.setItem('token', token)

    alert(`Login berhasil! Selamat datang, ${name}`)
    router.push('/dashboard')
  } catch (err) {
    console.error(err)
    errorMessage.value = 'PIN salah atau login gagal.'
  }
}
</script>