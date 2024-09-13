import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: 'unibest',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#018d71',
    backgroundColor: '#F8F8F8',
    borderStyle: 'black',
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        pagePath: 'pages/login/index',
        text: '登录',
      },
    ],
  },
  subPackages: [
    {
      root: 'packageA',
      pages: [
        {
          path: 'collect/index',
          type: 'page',
          style: {
            navigationBarTitleText: '血液揽收',
          },
        },
        {
          path: 'collect/detail',
          type: 'page',
          style: {
            navigationBarTitleText: '',
          },
        },
        {
          path: 'collect/result',
          type: 'page',
          style: {
            navigationBarTitleText: '血液揽收',
          },
        },
        {
          path: 'collect/error',
          type: 'page',
          style: {
            navigationBarTitleText: '揽收异常',
          },
        },
      ],
    },
    {
      root: 'packageB',
      pages: [
        {
          path: 'notified/index',
          type: 'page',
          style: {
            navigationBarTitleText: '消息通知',
          },
        },
      ],
    },
  ],
})
