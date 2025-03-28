<template>
  <h1>Welcome! {{ username }}</h1>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { axios_instance } from '@/main'
import { useUserStore } from '@/stores/user'
const store = useUserStore()
const username = ref('神秘的音乐爱好者')
axios_instance
  .post(`/user/account?timestamp=${Date.now()}`, { cookie: store.cookie })
  .then((res) => {
    username.value = res.data.profile.nickname
  })
</script>
