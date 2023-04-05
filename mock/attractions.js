const Mock = require('mockjs')

// 生成50-300之间的随机数，作为mock数据的个数
const count = Mock.Random.integer(50, 300)

// 使用Mock.js生成mock数据
const attractionList = []
for (let i = 0; i < count; i++) {
  const product = Mock.mock({
    id: i + 1,
    name: '@ctitle(5, 10)',
    level: '@integer(1, 5)' + 'A',
    address: '@county(true)',
    latitude: '@float(30, 45, 2, 4)',
    longitude: '@float(100, 125, 2, 4)',
    'max_people|10-200': 1,
    open_time: '@openTime',
    'status|1': ['草稿', '已发布']
  })
  attractionList.push(product)
}

module.exports = [
  {
    url: '/vue-element-admin/attractions/list',
    type: 'get',
    response: config => {
      const { page, size } = config.query

      const start = (page - 1) * size
      const end = page * size

      return {
        code: 20000,
        data: {
          size,
          list: attractionList.slice(start, end)
        }
      }
    }
  },
  {
    url: '/vue-element-admin/attractions/count',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: attractionList.length
        }
      }
    }
  }
]