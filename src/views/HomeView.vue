<template>
  <div class="p-6">
    <WelcomeUser v-if="store.isLogIn" />
    <LoginForm v-else />
  </div>
</template>

<script setup lang="ts">
const LoginForm = defineAsyncComponent(() => import('@/components/LoginForm.vue'))
import WelcomeUser from '@/components/WelcomeUser.vue'
import { useUserStore } from '@/stores/user'
import { defineAsyncComponent } from 'vue'
const store = useUserStore()
</script>
