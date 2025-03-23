<template>
  <div class="p-6">
    <div v-if="store.isLogIn">
      <WelcomeUser />
    </div>
    <div v-else>
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue'
import WelcomeUser from '@/components/WelcomeUser.vue'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'
const store = useUserStore()
onMounted(() => {
  store.initialize() //在这里初始化store
})
</script>
