// 运输单状态-值映射
export const transStatusValueMap = {
  // 运输中: 1,
  待揽收: 2,
  已揽收: 3,
  待签收: 4,
  已签收: 5,
  异常: 9,
}
// 运输单状态
export const transStatusMap = {
  2: {
    color: '#4BBBA1',
    text: '待揽收',
  },
  3: {
    color: '#809AF9',
    text: '待启运', // 已揽收
  },
  4: {
    color: '#1890FF',
    text: '待签收',
  },
  5: {
    color: '#323233',
    text: '已签收',
  },
  9: {
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
