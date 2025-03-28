<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
const currentTab = ref('Home')
const HomeView = defineAsyncComponent(() => import('@/views/HomeView.vue'))
const UploadView = defineAsyncComponent(() => import('@/views/UploadView.vue'))
import { useUserStore } from './stores/user'
const store = useUserStore()
onMounted(() => {
  store.initialize() //需要初始化store
})
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <a class="btn btn-ghost text-xl">Cloud Drive Manager</a>
    </div>
    <div class="navbar-center">
      <div class="tabs tabs-border">
        <label class="tab">
          <input type="radio" name="my_tabs" value="Home" v-model="currentTab" />
          <iconify-icon icon="mdi:home"></iconify-icon> 首页
        </label>
        <label class="tab">
          <input type="radio" name="my_tabs" value="Upload" v-model="currentTab" />
          <iconify-icon icon="mdi:upload"></iconify-icon> 上传
        </label>
      </div>
    </div>
    <div class="navbar-end">
      <button class="btn btn-ghost btn-circle pe-6" v-if="store.isLogIn" @click="store.logOut">
        <iconify-icon icon="mdi:logout" width="auto" height="auto"></iconify-icon>
      </button>
    </div>
  </div>

  <HomeView v-if="currentTab == 'Home'" />
  <UploadView v-else />
</template>
