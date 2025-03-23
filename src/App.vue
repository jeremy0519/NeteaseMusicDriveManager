<script setup lang="ts">
import { ref } from 'vue'
const currentTab = ref('Home')
import HomeView from '@/views/HomeView.vue'
import UploadView from '@/views/UploadView.vue'
</script>

<template>
  <!-- name of each tab group should be unique -->
  <div class="tabs tabs-border flex justify-center">
    <label class="tab">
      <input type="radio" name="my_tabs" value="Home" v-model="currentTab" />
      <iconify-icon icon="mdi:home"></iconify-icon> 首页
    </label>
    <label class="tab">
      <input type="radio" name="my_tabs" value="Upload" v-model="currentTab" />
      <iconify-icon icon="mdi:upload"></iconify-icon> 上传
    </label>
  </div>

  <HomeView v-if="currentTab == 'Home'" />
  <UploadView v-else />
</template>
