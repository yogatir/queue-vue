<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 p-6">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <h1 class="text-3xl font-bold">Sistem Antrian Digital</h1>
        <button @click="callNext" class="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg">
          <i class="fas fa-bullhorn"></i>
          Panggil Berikutnya
        </button>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-right">
          <p class="font-semibold text-sm">{{ data.currentStaff?.name || 'Staff' }}</p>
          <p class="text-xs text-gray-500">{{ data.currentStaff?.email || '' }}</p>
        </div>
        <button @click="logout" class="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg">
          Log Out
        </button>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-6">
      <div class="col-span-1 space-y-4">
        <div class="bg-white rounded-xl shadow p-4 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Antrian Aktif</p>
            <p class="text-3xl font-bold">{{ data.activeQueues }}</p>
          </div>
          <i class="fas fa-ticket text-4xl text-gray-500"></i>
        </div>

        <div class="bg-white rounded-xl shadow p-4">
          <div class="flex justify-between items-center mb-2">
            <p class="text-sm font-semibold">Daftar Antrian</p>
            <button @click="showAddModal = true" class="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md">
              + Tambah Antrian
            </button>
          </div>
          <table class="w-full text-sm text-left border">
            <thead class="bg-gray-200">
                <tr>
                <th class="p-2">No</th>
                <th class="p-2">Nama</th>
                <th class="p-2">Jenis</th>
                <th class="p-2">Aksi</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y">
                <tr v-for="q in data.queues" :key="q.id">
                <td class="p-2">{{ q.queue_number }}</td>
                <td class="p-2">{{ q.name }}</td>
                <td class="p-2 capitalize">{{ q.type }}</td>
                <td class="p-2">
                    <button
                    v-if="q.status === 'CALLED'"
                    @click="markQueueDone(q.id)"
                    class="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                    >
                    Selesai
                    </button>
                </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col-span-1 space-y-4">
        <div class="bg-white rounded-xl shadow p-4 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Staff Aktif</p>
            <p class="text-3xl font-bold">{{ data.activeStaff }}</p>
          </div>
          <i class="fas fa-user-check text-4xl text-gray-500"></i>
        </div>
        <div class="bg-white rounded-xl shadow p-4">
          <p class="text-sm font-semibold mb-2">Daftar Staff Aktif</p>
          <table class="w-full text-sm text-left border">
            <thead class="bg-gray-200">
              <tr>
                <th class="p-2">Nama</th>
                <th class="p-2">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y">
              <tr v-for="s in data.staffs" :key="s.id">
                <td class="p-2">{{ s.name }}</td>
                <td class="p-2 text-green-600 font-semibold">Aktif</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col-span-2 space-y-4">
        <div class="bg-white rounded-xl shadow p-4">
          <p class="text-sm text-gray-500">Top 3 Staff</p>
          <table class="w-full text-sm text-left border mt-2">
            <thead class="bg-gray-200">
              <tr>
                <th class="p-2">#</th>
                <th class="p-2">Nama</th>
                <th class="p-2">Antrian Dilayani</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y">
              <tr v-for="(s, i) in data.topStaff" :key="s.staff_id">
                <td class="p-2">#{{ i + 1 }}</td>
                <td class="p-2">{{ s.staff.name }}</td>
                <td class="p-2">{{ s.served_count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-white rounded-xl shadow p-4">
          <p class="text-sm text-gray-500 mb-4">Rata-rata Waktu Pelayanan per Staff</p>
          <canvas ref="chartRef" height="150"></canvas>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Tambah Antrian Baru</h2>
          <button @click="showAddModal = false" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="submitQueue" class="space-y-4">
          <div>
            <label class="text-sm font-medium block mb-1">Nama Pasien</label>
            <input v-model="form.name" type="text" class="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label class="text-sm font-medium block mb-1">Tanggal Lahir</label>
            <input v-model="form.birth_date" type="date" class="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label class="text-sm font-medium block mb-1">Jenis Antrian</label>
            <select v-model="form.type" class="w-full border rounded-md px-3 py-2" required>
              <option value="">Pilih Jenis</option>
              <option value="WALK-IN">Walk-in</option>
              <option value="RESERVATION">Reservasi</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium block mb-1">Keluhan</label>
            <textarea v-model="form.notes" class="w-full border rounded-md px-3 py-2" rows="2"></textarea>
          </div>
          <div class="flex justify-end gap-2 pt-4">
            <button type="button" @click="showAddModal = false" class="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300">Batal</button>
            <button type="submit" class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Chart from 'chart.js/auto'
import api from '@/services/api'

const router = useRouter()

const data = ref({
  activeQueues: 0,
  activeStaff: 0,
  queues: [],
  staffs: [],
  topStaff: [],
  avgDurations: [],
  currentStaff: {}
})

const form = ref({
  name: '',
  birth_date: '',
  type: '',
  notes: ''
})

const showAddModal = ref(false)
const chartRef = ref()

let chartInstance = null

function logout() {
  localStorage.removeItem('token')
  router.push('/')
}

async function fetchDashboard() {
  try {
    const res = await api.get('/dashboard')
    data.value = res.data.data
    renderChart()
  } catch (err) {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/')
    } else {
      console.error('Gagal memuat dashboard:', err)
    }
  }
}

async function callNext() {
  try {
    const res = await api.post('/queue/call')
    if (res.data.data && res.data.data.queue_number) {
      alert(`Memanggil antrian ${res.data.data.queue_number}`)
    } else {
      alert('Tidak ada antrian untuk dipanggil.')
    }
    await fetchDashboard()
  } catch (err) {
    console.error('Gagal memanggil antrian:', err)
    alert('Terjadi kesalahan saat memanggil antrian.')
  }
}

async function submitQueue() {
  try {
    await api.post('/queue', form.value)
    alert('Antrian berhasil ditambahkan!')
    showAddModal.value = false
    await fetchDashboard()
    resetForm()
  } catch (err) {
    console.error('Gagal menambahkan antrian:', err)
    alert('Gagal menambahkan antrian.')
  }
}

async function markQueueDone(queueId) {
  try {
    await api.put(`/queue/${queueId}/done`)
    alert('Antrian telah diselesaikan!')
    await fetchDashboard()
  } catch (err) {
    console.error('Gagal menyelesaikan antrian:', err)
    alert('Gagal menyelesaikan antrian.')
  }
}

function resetForm() {
  form.value = { name: '', birth_date: '', type: '', notes: '' }
}

function renderChart() {
  const ctx = chartRef.value?.getContext('2d')
  if (!ctx || !Array.isArray(data.value.avgDurations)) return

  const chartData = data.value.avgDurations

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.map(s => s.staff.name),
      datasets: [{
        label: 'Waktu rata-rata (menit)',
        data: chartData.map(s =>
          Math.round((s.avg_duration || 0) / 60 * 100) / 100
        ),
        backgroundColor: '#3b82f6'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => `${value}m`
          }
        }
      }
    }
  })
}

onMounted(fetchDashboard)
</script>