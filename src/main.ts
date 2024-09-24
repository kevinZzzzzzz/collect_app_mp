import { createSSRApp } from 'vue'
import App from './App.vue'
import store from './store'
import { routeInterceptor, requestInterceptor, prototypeInterceptor } from './interceptors'
import 'virtual:uno.css'
// import '@/style/index.scss'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(routeInterceptor)
  app.use(requestInterceptor)
  app.use(prototypeInterceptor)
  // 全局隐藏tabbar
  uni.hideTabBar({
    success: () => {},
    fail: (e) => {
      console.log(e) // 捕获报错，防止没有tabbar页面调用后控制台报错
    },
  })
  return {
    app,
  }
}
