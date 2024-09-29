import { pages, subPackages, tabBar } from '@/pages.json'
import PLATFORM from './platform'
import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

const getLastPage = () => {
  // getCurrentPages() 至少有1个元素，所以不再额外判断
  // const lastPage = getCurrentPages().at(-1)
  // 上面那个在低版本安卓中打包回报错，所以改用下面这个【虽然我加了src/interceptions/prototype.ts，但依然报错】
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

/** 判断当前页面是否是tabbar页  */
export const getIsTabbar = () => {
  if (!tabBar) {
    return false
  }
  if (!tabBar.list.length) {
    // 通常有tabBar的话，list不能有空，且至少有2个元素，这里其实不用处理
    return false
  }
  const lastPage = getLastPage()
  const currPath = lastPage.route
  return !!tabBar.list.find((e) => e.pagePath === currPath)
}

/**
 * 获取当前页面路由的 path 路径和 redirectPath 路径
 * path 如 ‘/pages/login/index’
 * redirectPath 如 ‘/pages/demo/base/route-interceptor’
 */
export const currRoute = () => {
  const lastPage = getLastPage()
  const currRoute = (lastPage as any).$page
  // console.log('lastPage.$page:', currRoute)
  // console.log('lastPage.$page.fullpath:', currRoute.fullPath)
  // console.log('lastPage.$page.options:', currRoute.options)
  // console.log('lastPage.options:', (lastPage as any).options)
  // 经过多端测试，只有 fullPath 靠谱，其他都不靠谱
  const { fullPath } = currRoute as { fullPath: string }
  // console.log(fullPath)
  // eg: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor (小程序)
  // eg: /pages/login/index?redirect=%2Fpages%2Froute-interceptor%2Findex%3Fname%3Dfeige%26age%3D30(h5)
  return getUrlObj(fullPath)
}

const ensureDecodeURIComponent = (url: string) => {
  if (url.startsWith('%')) {
    return ensureDecodeURIComponent(decodeURIComponent(url))
  }
  return url
}
/**
 * 解析 url 得到 path 和 query
 * 比如输入url: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor
 * 输出: {path: /pages/login/index, query: {redirect: /pages/demo/base/route-interceptor}}
 */
export const getUrlObj = (url: string) => {
  const [path, queryStr] = url.split('?')
  // console.log(path, queryStr)

  if (!queryStr) {
    return {
      path,
      query: {},
    }
  }
  const query: Record<string, string> = {}
  queryStr.split('&').forEach((item) => {
    const [key, value] = item.split('=')
    // console.log(key, value)
    query[key] = ensureDecodeURIComponent(value) // 这里需要统一 decodeURIComponent 一下，可以兼容h5和微信y
  })
  return { path, query }
}
/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 这里设计得通用一点，可以传递key作为判断依据，默认是 needLogin, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的pages，如果传递了 key, 则表示通过 key 过滤
 */
export const getAllPages = (key = 'needLogin') => {
  // 这里处理主包
  const mainPages = [
    ...pages
      .filter((page) => !key || page[key])
      .map((page) => ({
        ...page,
        path: `/${page.path}`,
      })),
  ]
  // 这里处理分包
  const subPages: any[] = []
  subPackages.forEach((subPageObj) => {
    // console.log(subPageObj)
    const { root } = subPageObj

    subPageObj.pages
      .filter((page) => !key || page[key])
      .forEach((page: { path: string } & Record<string, any>) => {
        subPages.push({
          ...page,
          path: `/${root}/${page.path}`,
        })
      })
  })
  const result = [...mainPages, ...subPages]
  // console.log(`getAllPages by ${key} result: `, result)
  return result
}

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const getNeedLoginPages = (): string[] => getAllPages('needLogin').map((page) => page.path)

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const needLoginPages: string[] = getAllPages('needLogin').map((page) => page.path)

/**
 * 睡眠函数
 * @params second 延迟时间
 */
export function sleep(second: number = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000 * second)
  })
}

/**
 * 获取navigate跳转携带的参数
 * @params options
 */
export function getNavigateOptions(options: any, key: string) {
  let result: any = null
  if (PLATFORM.isMp) {
    if (options.ctx.$scope.options[key]) {
      result = options.ctx.$scope.options[key]
    }
  } else {
    if (options.attrs[key]) {
      result = options.attrs[key]
    }
  }
  return result
}

/**
 * 先检查数字是否有小数点 是则必须只有一位小数 没有的话不限制
 * @param num 要检查的数字
 * @returns true or false
 */
export function hasOneDecimalPlace(num) {
  // 将数字转换为字符串
  const numStr = num.toString()
  // 检查是否有小数点
  if (numStr.includes('.')) {
    // 分割整数部分和小数部分
    const parts = numStr.split('.')
    // 检查小数点后是否只有一位数字
    return parts[1].length === 1
  }
  // 如果没有小数点，则返回true
  return true
}
/**
 * @method {*} encrypt 密码加密
 * @param {*} pwd 密码
 * @param {*} key 公钥
 * @return secretPwd 加密后的密码
 */
export const encrypt = (pwd: string, key: string) => {
  const encrypt = new JSEncrypt()
  const priviteKey = '-----BEGIN RSA PUBLIC KEY-----\n' + key + '\n-----END PUBLIC KEY-----'
  encrypt.setPublicKey(priviteKey)
  const secretPwd = encrypt.encrypt(pwd)
  return secretPwd
}
export const windowAtob = (encodedString) => {
  let base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  let decodedString = ''
  let currentChar, charCode1, charCode2, charCode3, encIndex1, encIndex2, encIndex3, encIndex4

  for (let i = 0; i < encodedString.length; i += 4) {
    encIndex1 = base64Chars.indexOf(encodedString[i])
    encIndex2 = base64Chars.indexOf(encodedString[i + 1])
    encIndex3 = base64Chars.indexOf(encodedString[i + 2])
    encIndex4 = base64Chars.indexOf(encodedString[i + 3])

    charCode1 = (encIndex1 << 2) | (encIndex2 >> 4)
    charCode2 = ((encIndex2 & 15) << 4) | (encIndex3 >> 2)
    charCode3 = ((encIndex3 & 3) << 6) | encIndex4

    decodedString += String.fromCharCode(charCode1)

    if (encIndex3 !== 64) {
      decodedString += String.fromCharCode(charCode2)
    }
    if (encIndex4 !== 64) {
      decodedString += String.fromCharCode(charCode3)
    }
  }
  return decodedString
}
/**
 *
 * @method {*} getUserInfoByToken 解析token获取用户信息
 * @param {*} token token
 * @return userInfo 用户信息
 */
export const getUserInfoByToken = (token: string) => {
  const tokenString = token?.split('.')[1]
  let userInfo = ''
  if (tokenString) {
    const str = windowAtob(tokenString.replace(/-/g, '+').replace(/_/g, '/')).replace(
      /[^\x20-\x7E\u4E00-\u9FFF]+/g,
      '',
    )
    const outerJson = JSON.parse(str)
    const innerJson = JSON.parse(outerJson.data)
    userInfo = innerJson ? innerJson : {}
  }
  return userInfo
}
