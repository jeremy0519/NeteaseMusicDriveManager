import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      isLogIn: false, //false只是随便一个值，后面还会再initialize时候重新赋正确值
      userId: '', //同理
      cookie: '', //同理
    }
  },
  actions: {
    logIn(userId: string, cookie: string): void {
      this.isLogIn = true
      this.userId = userId
      this.cookie = cookie
      this.sync()
    },
    logOut(): void {
      this.isLogIn = false
      this.userId = ''
      this.cookie = ''
      this.sync()
    },
    initialize(): void {
      if (!localStorage.getItem('user')) {
        console.log("初始化localstorage")
        localStorage.setItem('user', JSON.stringify({"isLogIn":false,"userId":"","cookie":""}))
      }
      const user = JSON.parse(localStorage.getItem('user')!)
      this.isLogIn = user.isLogIn
      this.userId = user.userId
      this.cookie = user.cookie
    },
    sync(): void {
      console.log("同步到localstorage: "+"[islogin]"+this.isLogIn+"[userid]"+this.userId+"[cookie]"+this.cookie)
      localStorage.setItem('user', JSON.stringify({
        isLogIn: this.isLogIn,
        userId: this.userId,
        cookie: this.cookie,
      }))
    }
  },
})
