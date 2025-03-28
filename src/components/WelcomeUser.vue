<template>
  <h1>Welcome! {{ username }}</h1>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const username = ref('神秘的音乐爱好者')
</script>
