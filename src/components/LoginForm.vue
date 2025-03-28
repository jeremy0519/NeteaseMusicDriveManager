<template>
  <div class="flex flex-col items-center">
    <p class="text-lg font-bold mb-2">请扫码</p>
    <img id="qrImg" :src="qrImgSrc" class="mask mask-squircle shadow-lg" />
  </div>
  <div role="alert" class="alert alert-error" v-if="errorMessage">
    <iconify-icon icon="mdi:cross-circle"></iconify-icon>
    <span>{{ errorMessage }}</span>
  </div>
  <div role="alert" class="alert alert-success" v-if="successMessage">
    <iconify-icon icon="mdi:success"></iconify-icon>
    <span>{{ successMessage }}</span>
  </div>
</template>

<script lang="ts" setup>
import { axios_instance } from '@/main'
import { useUserStore } from '@/stores/user'
import { ref, onMounted, onUnmounted } from 'vue'
import chroma from 'chroma-js'
import QRCode from 'qrcode'

const store = useUserStore()
const qrImgSrc = ref('')
const errorMessage = ref('')
const successMessage = ref('')
let qrkey: string = ''
let qrurl: string = ''
let timer: NodeJS.Timeout

onMounted(() => {
  buildQRCode()
  watchColorScheme()
  // 检查扫码状态
  timer = setInterval(async () => {
    const statusRes = await checkStatus(qrkey)
    console.log(statusRes)
    if (statusRes.code === -1) {
      // checkstatus出现问题
      clearInterval(timer)
    } else if (statusRes.code === 800) {
      console.log('二维码已过期,正在重新获取')
      buildQRCode()
    } else if (statusRes.code === 802) {
      successMessage.value = '二维码已扫描,请确认登录'
    } else if (statusRes.code === 803) {
      clearInterval(timer)
      console.log('授权登录成功')
      await nowLogin(statusRes.cookie)
    }
  }, 3000)
})

onUnmounted(() => {
  clearInterval(timer)
})

// 第一步 获取二维码数据
async function buildQRCode() {
  try {
    const { data: keyRes } = await axios_instance.get(`/login/qr/key?timestamp=${Date.now()}`)
    qrkey = keyRes.data.unikey
    const { data: qrRes } = await axios_instance.get(
      `/login/qr/create?key=${qrkey}&qrimg=true&timestamp=${Date.now()}`,
    )
    qrurl = qrRes.data.qrurl
    drawQRCode()
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = 'Error building QR code: ' + error.message
    } else {
      errorMessage.value = 'Error building QR code: ' + String(error)
    }
  }
}

// 第二步 画二维码
async function drawQRCode() {
  const rootStyles = getComputedStyle(document.documentElement)
  const lightColor = chroma(rootStyles.getPropertyValue('--color-base-200')).hex('rgba')
  const darkColor = chroma(rootStyles.getPropertyValue('--color-base-content')).hex('rgba')
  QRCode.toDataURL(qrurl, { color: { light: lightColor, dark: darkColor } })
    .then((img) => {
      qrImgSrc.value = img
    })
    .catch((error) => {
      if (error instanceof Error) {
        errorMessage.value = 'Error drawing QR code: ' + error.message
      } else {
        errorMessage.value = 'Error drawing QR code: ' + String(error)
      }
    })
  console.log('二维码生成成功')
}

// 小工具 监听 prefers-color-scheme 变化
function watchColorScheme() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = (event: MediaQueryListEvent) => {
    console.log('Color scheme changed:', event.matches ? 'dark' : 'light')
    drawQRCode() // Regenerate QR code with updated colors
  }
  mediaQuery.addEventListener('change', handleChange)

  // Cleanup listener on component unmount
  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handleChange)
  })
}

async function checkStatus(key: string) {
  try {
    const res = await axios_instance.get(
      `/login/qr/check?key=${key}&timestamp=${Date.now()}&noCookie=true`,
    )
    return res.data
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = 'Error checking QR code status: ' + error.message
    } else {
      errorMessage.value = 'Error checking QR code status: ' + String(error)
    }
    return { code: -1 } // Return a default error code
  }
}

// 第四步 登录
async function nowLogin(cookie = '') {
  try {
    const res = await axios_instance.post(`/login/status?timestamp=${Date.now()}`, {
      data: {
        cookie,
      },
    })
    console.log(res.data)
    successMessage.value = '登录成功'
    setTimeout(() => {
      store.logIn(res.data.data.account.id, cookie)
    }, 3000)
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = 'Error during login: ' + error.message
    } else {
      errorMessage.value = 'Error during login: ' + String(error)
    }
  }
}
</script>
