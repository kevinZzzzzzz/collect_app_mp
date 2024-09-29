// 运输单状态-值映射
export const transStatusValueMap = {
  运输中: 1,
  待揽收: 2,
  已揽收: 3,
  待签收: 4,
  已签收: 5,
  异常: 9,
}
export const transStatusTextMap = {
  1: '运输中',
  2: '待揽收',
  3: '已揽收',
  4: '待签收',
  5: '已签收',
  9: '异常',
}
// 运输单状态
export const transStatusMap = {
  0: {
    color: '#809AF9',
    text: '待启运',
  },
  1: {
    color: '#FAAB0C',
    text: '运输中',
  },
  2: {
    color: '#1890FF',
    text: '待签收',
  },
  3: {
    color: '#323233',
    text: '已取消',
  },
  4: {
    color: '#323233',
    text: '已签收',
  },
  5: {
    color: '#323233',
    text: '已拒收',
  },
  6: {
    color: '#4BBBA1',
    text: '未揽收',
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

// 运输方式
export const transportWays = {
  0: '医院取血',
  1: '血站送血',
  2: '无人机配送',
}
export const telReg = /^[1][3-9][0-9]{9}$/ // 手机正则
