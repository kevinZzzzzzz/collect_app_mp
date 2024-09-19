// 运输单状态-值映射
export const transStatusValueMap = {
  已揽收: 0,
  运输中: 1,
  已送达: 2,
  已取消: 3,
  已签收: 4,
  已拒收: 5,
  待揽收: 6,
  异常: 7,
}
// 运输单状态
export const transStatusMap = {
  0: {
    color: '#809AF9',
    text: '待启运', // 已揽收
  },
  1: {
    color: '#FAAB0C',
    text: '运输中',
  },
  2: {
    color: '#00C050',
    text: '已送达',
  },
  3: {
    color: '#FF0000',
    text: '已取消',
  },
  4: {
    color: '#323233',
    text: '已签收',
  },
  5: {
    color: '#FF0000',
    text: '已拒收',
  },
  6: {
    color: '#4BBBA1',
    text: '待揽收',
  },
  7: {
    color: '#FF0000',
    text: '异常',
  },
}

// 运输单时间文案
export const transOrderTimeTextMap = {
  6: '发血时间',
  0: '发血时间',
  7: '揽件异常时间',
  1: '启运时间',
  4: '签收时间',
}
